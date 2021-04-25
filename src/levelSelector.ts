import { Game } from './game';
import { loadLevel } from './levelEngine';

const numLevels = 5;

const levelSelectorEl = document.getElementById('levelSelector');
const children: { btn: HTMLElement; evtLister: EventListener }[] = [];
let isOpen = false;
let rejectPromise: any;
const selectLevel = (resolve: any, level: string) => {
  resolve(level);
  cleanup();
};

const cleanup = () => {
  levelSelectorEl.classList.remove('fade-in');
  levelSelectorEl.classList.add('fade-out');
  isOpen = false;
  for (let i = 0; i < children.length; i++) {
    children[i].btn.removeEventListener('click', children[i].evtLister);
  }
  levelSelectorEl.innerHTML = '';
};

export const closePopup = () => {
  if (rejectPromise) {
    rejectPromise();
  }
  cleanup();
};

export const isLevelSelectorOpen = () => {
  return isOpen;
};

export const openLevelSelector = () => {
  isOpen = true;
  return new Promise((resolve, reject) => {
    const children = [];
    levelSelectorEl.classList.add('fade-in');
    levelSelectorEl.classList.remove('fade-out');
    for (let i = 1; i < numLevels + 1; i++) {
      const btn = document.createElement('button');
      const level = `level${i}`;
      btn.innerHTML = `Play level ${i}`;
      const evtListener = btn.addEventListener('click', () =>
        selectLevel(resolve, level)
      );
      children.push([{ btn, evtListener }]);
      levelSelectorEl.appendChild(btn);
    }
    rejectPromise = reject;
  });
};
