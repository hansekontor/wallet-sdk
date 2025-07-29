import { Context } from 'react';
import { Wallet } from './types';
type WalletContextType = {
    wallet: Wallet | undefined;
    cashtab: any;
    createWallet: Function;
    activateWallet: Function;
    removeWallet: Function;
    update: Function;
    walletLoading: boolean;
};
export declare const WalletContext: Context<WalletContextType>;
export declare const WalletProvider: ({ children }: {
    children: React.ReactElement;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useWallet: () => WalletContextType;
export {};
