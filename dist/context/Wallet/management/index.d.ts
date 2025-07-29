import { Wallet } from '../types';
export declare const getWalletOrder: (activeWallet: Wallet, wallets: Wallet[]) => Wallet[];
/**
 * cashtabState.js
 * cashtabState should be a class, so that we can ensure the default cashtabState
 * is always a new one
 */
interface CashtabStateInterface {
    wallets: Wallet[];
}
declare class CashtabState implements CashtabStateInterface {
    wallets: Wallet[];
    constructor(wallets?: never[]);
}
export default CashtabState;
