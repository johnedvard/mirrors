import { NearConnection } from './nearConnection';

export const fadeIn = (): void => {
  const overlayId = 'overlay-fader';
  let overlayEl = document.getElementById(overlayId);
  overlayEl.classList.add('fade-out');
};
export const fadeOut = (): void => {
  const overlayId = 'overlay-fader';
  let overlayEl = document.getElementById(overlayId);
  overlayEl.classList.remove('fade-out');
};
