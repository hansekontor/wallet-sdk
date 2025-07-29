import { WalletState, Wallet, Path } from '../types';
export declare const generateMnemonic: () => any;
export declare const deriveAccount: (masterHDNode: any, path: string) => Path;
export declare const buildWallet: (mnemonic: any) => {
    mnemonic: any;
    name: string;
    Path1899: Path;
    state: WalletState;
};
export declare const verifyWallet: (mnemonic: object, wallets: Wallet[] | []) => boolean;
