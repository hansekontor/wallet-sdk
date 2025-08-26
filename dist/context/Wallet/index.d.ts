import { Context } from 'react';
import { default as CashtabState } from './management';
import { Wallet } from './types';
type WalletContextType = {
    wallet: Wallet | undefined;
    cashtab: CashtabState;
    createWallet: (activate: boolean, mnemonicInput?: string) => Promise<void>;
    activateWallet: (walletToActivate: Wallet) => Promise<void>;
    removeWallet: (walletToDelete: Wallet) => Promise<void>;
    renameWalletLocally: (walletToRename: Wallet, newName: string) => Promise<void>;
    update: (cashtabState: CashtabState, forceUpdate?: boolean) => Promise<void>;
    walletLoading: boolean;
    hasInitialized: boolean;
};
export declare const WalletContext: Context<WalletContextType>;
export declare const WalletProvider: ({ children }: {
    children: React.ReactElement;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useWallet: () => WalletContextType;
export {};
