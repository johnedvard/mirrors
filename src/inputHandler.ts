import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

import { KeyState } from './keyState';

export class InputHandler {
  keyStateSource: {
    [pid: string]: BehaviorSubject<KeyState>;
  } = {};
  constructor() {}
  setKeyState(pid: string, code: string, pressed: boolean, released: boolean) {
    const currentKeyState = { ...this.keyStateSource[pid].value };
    if (
      !currentKeyState[code] ||
      currentKeyState[code].pressed !== pressed ||
      currentKeyState[code].released !== released
    ) {
      currentKeyState[code] = { pressed, released };

      this.keyStateSource[pid].next(currentKeyState);
    }
  }
  releaseKey(pid: string, code: string) {
    this.setKeyState(pid, code, false, true);
  }
  pressKey(pid: string, code: string) {
    this.setKeyState(pid, code, true, false);
  }

  getKeyState(pid: string): Observable<KeyState> {
    if (!this.keyStateSource.hasOwnProperty(pid)) {
      this.keyStateSource[pid] = new BehaviorSubject({});
    }
    return this.keyStateSource[pid].asObservable();
  }
}
