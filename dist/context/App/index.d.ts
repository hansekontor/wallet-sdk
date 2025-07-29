import { Context } from 'react';
import { Wallet } from '../Wallet/types';
import { default as CashtabState } from '../Wallet/management';
type App = {
    status: string;
    wallet: Wallet | undefined;
    cashtab: CashtabState;
    validateMnemonic: Function;
    updateWallet: Function;
    changeWallet: Function;
    addWallet: Function;
    deleteWallet: Function;
    send: Function;
    receive: object;
    bridge: Function;
    withdraw: Function;
};
export declare const AppContext: Context<App>;
export declare const AppProvider: ({ children }: {
    children: React.ReactElement;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useApp: () => App;
export {};
