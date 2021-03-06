import { ILevel } from './iLevel';

const cachedLevels: any = {};
let currentLevel = 'level1';
export const loadLevel = (level: string): Promise<ILevel> => {
  currentLevel = level;
  return new Promise((resolve, reject) => {
    if (cachedLevels[level]) resolve(cachedLevels[level]);
    var xObj = new XMLHttpRequest();
    xObj.overrideMimeType('application/json');
    xObj.open('GET', `./assets/levels/${level}.json`, true);
    // 1. replace './data.json' with the local path of your file
    xObj.onreadystatechange = function () {
      if (xObj.readyState === 4 && xObj.status === 200) {
        // 2. call your callback function
        const levelJson = JSON.parse(xObj.responseText);
        cachedLevels[level] = levelJson;
        resolve(levelJson);
      } else if (xObj.readyState === 4) {
        reject(null);
      }
    };
    xObj.send(null);
  });
};

export const getCurrentLevel = (): string => {
  return currentLevel;
};

export const getLevel = (level: string) => {};
