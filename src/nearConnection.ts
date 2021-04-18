import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import getConfig from './config';

export class NearConnection {
  walletConnection: WalletConnection;
  contract: Contract;
  accountId: string;
  nearConfig = getConfig('development');
  constructor() {}

  // Initialize contract & set global variables
  async initContract() {
    console.log('init');

    // Initialize connection to the NEAR testnet
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    console.log('keyStore', keyStore);
    const near = await connect({ ...this.nearConfig, keyStore });

    // Initializing Wallet based Account. It can work with NEAR testnet wallet that
    // is hosted at https://wallet.testnet.near.org
    this.walletConnection = new WalletConnection(near, null);

    // Getting the Account ID. If still unauthorized, it's just empty string
    this.accountId = this.walletConnection.getAccountId();

    // Initializing our contract APIs by contract name and configuration
    this.contract = await new Contract(
      this.walletConnection.account(),
      this.nearConfig.contractName,
      {
        // View methods are read only. They don't modify the state, but usually return some value.
        viewMethods: ['getGreeting'],
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: ['setGreeting'],
      }
    );
    return this.walletConnection;
  }

  logout() {
    this.walletConnection.signOut();
    // reload page
  }
  login() {
    // Allow the current app to make calls to the specified contract on the
    // user's behalf.
    // This works by creating a new access key for the user's account and storing
    // the private key in localStorage.
    this.walletConnection.requestSignIn(this.nearConfig.contractName);
  }
  getCurrentGreeting() {
    (<any>this.contract).getGreeting({
      accountId: this.accountId,
    });
  }
}
