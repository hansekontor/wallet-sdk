import { WalletState, Wallet, Path } from '../types';
declare const Mnemonic: any, HDPrivateKey: any;
export declare const generateMnemonic: () => any;
export declare const deriveAccount: (masterHDNode: typeof HDPrivateKey, path: string) => Path;
export declare const buildWallet: (mnemonic: typeof Mnemonic) => {
    mnemonic: any;
    name: string;
    Path1899: Path;
    state: WalletState;
};
export declare const verifyWallet: (mnemonic: object, wallets: Wallet[] | []) => boolean;
export {};
