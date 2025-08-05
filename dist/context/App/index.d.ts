import { Context } from 'react';
import { Wallet } from '../Wallet/types';
import { default as CashtabState } from '../Wallet/management';
type App = {
    status: string;
    hasInitialized: boolean;
    wallet: Wallet | undefined;
    cashtab: CashtabState;
    validateMnemonic: Function;
    updateWallet: Function;
    changeWallet: Function;
    renameWallet: Function;
    addWallet: Function;
    deleteWallet: Function;
    getMaxSendAmount: Function;
    send: Function;
    bridge: Function;
    withdraw: Function;
};
export declare const AppContext: Context<App>;
export declare const AppProvider: ({ children }: {
    children: React.ReactElement;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useApp: () => App;
export {};
