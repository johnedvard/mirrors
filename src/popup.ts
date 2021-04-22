import { getCurrentLevel } from './levelEngine';
import { NearConnection } from './nearConnection';

export class Popup {
  loginEl: HTMLElement;
  logoutEl: HTMLElement;
  registerTimeEl: HTMLElement;
  nextLevelEl: HTMLElement;
  popupEl: HTMLElement;
  responseMsgEl: HTMLElement;
  bestTimeEl: HTMLElement;
  currentTimeEl: HTMLElement;
  currentLevelEl: HTMLElement;
  private closePopupResolve: any;

  timeScore = 'some highscore';

  constructor(private nearConnection: NearConnection) {
    this.popupEl = document.getElementById('popup');
    this.responseMsgEl = document.getElementById('response-msg');
    this.currentLevelEl = document.getElementById('current-level');
    this.bestTimeEl = document.getElementById('best-time');
    this.currentTimeEl = document.getElementById('current-time');
    this.loginEl = document.getElementById('login');
    this.logoutEl = document.getElementById('logout');
    this.nextLevelEl = document.getElementById('next-level');
    this.registerTimeEl = document.getElementById('register-time');
    this.loginEl.addEventListener('click', () => this.login());
    this.registerTimeEl.addEventListener('click', () => this.registerTime());
    this.nextLevelEl.addEventListener('click', () => this.nextLevelClick());
    this.logoutEl.addEventListener('click', () => this.logout());

    this.initContract();
  }

  initContract() {
    this.nearConnection.initContract().then(async (res) => {
      if (!this.nearConnection.walletConnection.isSignedIn()) {
        // TODO (johnedvard add Login button)
        this.loginEl.removeAttribute('disabled');
        this.logoutEl.setAttribute('disabled', 'true');
        this.registerTimeEl.setAttribute('disabled', 'true');
      } else {
        this.registerTimeEl.removeAttribute('disabled');
        this.logoutEl.removeAttribute('disabled');
        this.loginEl.setAttribute('disabled', 'true');
      }
    });
  }
  cleanupPopop = () => {
    this.nextLevelEl.removeEventListener('click', this.nextLevelClick);
    this.loginEl.removeEventListener('click', this.login);
    this.registerTimeEl.removeEventListener('click', this.registerTime);
  };

  login = () => {
    this.nearConnection.login();
    this.logoutEl.removeAttribute('disabled');
    this.loginEl.setAttribute('disabled', 'true');
    this.registerTimeEl.removeAttribute('disabled');
  };
  logout = () => {
    this.registerTimeEl.setAttribute('disabled', 'true');
    this.loginEl.removeAttribute('disabled');
    this.logoutEl.setAttribute('disabled', 'true');
    this.nearConnection.logout();
  };
  registerTime = () => {
    this.responseMsgEl.innerHTML = 'Registration in progress';
    this.nearConnection
      .setScore(
        getCurrentLevel(),
        this.timeScore,
        this.nearConnection.accountId
      )
      .then((res) => {
        console.log('res after save', res);
        this.responseMsgEl.innerHTML = 'Registration complete';
        this.bestTimeEl.innerHTML = this.timeScore;
      })
      .catch((err) => {
        this.responseMsgEl.innerHTML = 'Some error occured';
      });
  };

  nextLevelClick = () => {
    this.popupEl.classList.remove('fade-in');
    this.popupEl.classList.add('fade-out');
    this.closePopupResolve(true);
  };

  openPopup = (): Promise<boolean> => {
    console.log('getCurrentLevel', getCurrentLevel());

    this.nearConnection.getScore(getCurrentLevel()).then((res: string) => {
      console.log('res', res);
      if (res) {
        const resJson: { score: string; name: string } = JSON.parse(res);
        this.bestTimeEl.innerHTML = resJson.score;
      } else {
        this.bestTimeEl.innerHTML = 'Nothing registered';
      }
    });
    this.responseMsgEl.innerHTML = '';
    this.bestTimeEl.innerHTML = 'Fetching high score';
    this.currentTimeEl.innerHTML = this.timeScore;
    this.currentLevelEl.innerHTML = getCurrentLevel();
    const popupEl = document.getElementById('popup');
    popupEl.classList.remove('fade-out');
    popupEl.classList.add('fade-in');
    return new Promise((resolve, _reject) => {
      this.closePopupResolve = resolve;
    });
  };
}
