import { createContext, use, useState, useEffect, type Context } from 'react';
import { getWalletState } from '../../utils/cashMethods';
import Loading from '../../components/Loading/DefaultLoading';
import {
    createNewWallet, 
    deriveAccount, 
    createWallet,
} from './creation';
import {
    activateWallet,
    activateNewWallet,
    addNewSavedWallet,
    deleteWallet,
    getActiveWallet,
    getSavedWallet,
    getWallet,
    getWalletDetails,
    getWalletOnStartup,
    renameWallet,
} from './management';
import {
    loadCashtabSettings,
    changeSettings,
} from './settings';
import {
    forceWalletUpdate,
    updateWallet,
    writeWalletstate,
} from './update';

import { type Wallet } from './types';

type WalletContextType = {
    wallet: Wallet
}
export const WalletContext: Context<WalletContextType> = createContext({} as WalletContextType);

const WalletWrapper = ( { children, passWallet }: 
    { children: React.ReactElement, passWallet: Wallet }
) => {
    const [wallet, setWallet] = useState(passWallet);
    const { slpBalancesAndUtxos } = getWalletState(wallet);

    return (
        <WalletContext value={{
            wallet, 
        }}>
            {children}
        </WalletContext>
    )
}

export const WalletProvider = ({ children }: 
    { children: React.ReactElement}
) => {

    const [wallet, setWallet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // const fetchWallet = async () => {
        //     try {
        //         const walletFromStorage = await getWalletOnStartup();
        //         if (walletFromStorage) {
        //             setWallet(walletFromStorage);
        //         } else {
        //             const newWallet = await createNewWallet();
        //             setWallet(newWallet);
        //         }
        //     } catch (error) {
        //         console.error("Error fetching wallet", error);
        //     } finally {
                // setIsLoading(false);
        //     }
        // };

        fetchWallet();
    });

    if (isLoading) {
        return <Loading>{"Loading Wallet..."}</Loading>;
    }

    if (!wallet) {
        console.error("No wallet found");
        return <Loading>No Wallet Found!</Loading>; // Handle case where wallet is not found
    }

    return (
        <WalletWrapper passWallet={wallet}>
            {children}
        </WalletWrapper>
    )
}

export const useWallet = () => {
    const context = use(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within an WalletProvider");
    }

    return context;
}