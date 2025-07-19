import { createContext, use, useState, useEffect, type Context } from 'react';
import Loading from '../../components/Loading/DefaultLoading';
import {
    generateMnemonic, 
    verifyWallet, 
    buildWallet,
} from './creation';
// import {
//     activateWallet,
//     activateNewWallet,
//     addNewSavedWallet,
//     deleteWallet,
//     getActiveWallet,
//     getSavedWallet,
//     getWallet,
//     getWalletDetails,
//     getWalletOnStartup,
//     renameWallet,
// } from './management';
// import {
//     loadCashtabSettings,
//     changeSettings,
// } from './settings';

// @ts-ignore
import bcash from '@hansekontor/checkout-components';
const { Mnemonic } = bcash;
import { type Wallet, type WalletState } from './types';
import localforage from 'localforage';
import CashtabState from './management';

type WalletContextType = {
    wallet: Wallet | null,
    createWallet: Function,
}
export const WalletContext: Context<WalletContextType> = createContext({} as WalletContextType);

export const WalletProvider = ( { children }: 
    { children: React.ReactElement }
) => {
    // const [wallet, setWallet] = useState(null);
    const [wallet, ] = useState(null);
    const [cashtabState, setCashtabState] = useState(new CashtabState());
    // const [isLoading, setIsLoading] = useState(true);
    const [walletLoading, setWalletLoading ] = useState(false);
    const [walletLoaded, setWalletLoaded] = useState(false);

    useEffect(() => {
        loadCashtabState();
    }, [])

    useEffect(() => {
        console.log("cashtabState", cashtabState);
    })

    useEffect(() => {
        if (walletLoaded && cashtabState.wallets.length > 0) {
            update(cashtabState);
            setWalletLoading(false);
        } else if (walletLoaded) {
            setWalletLoading(false);
        }
    }, [walletLoaded, cashtabState.wallets[0]?.name])

    const loadCashtabState = async () => {
        console.log("loadCashtabState()");
        setWalletLoading(true);
        const wallets = await localforage.getItem("wallets");
        console.log("loadCashtabState found wallets", wallets);
        if (wallets) {
            console.log("set stored wallets clause");
            const newState = Object.assign(cashtabState, { wallets });
            console.log("new cashtab state", newState);
            setCashtabState(newState);            
        } else {
            setWalletLoading(false);
        }
        setWalletLoaded(true);
    };

    const createWallet = (mnemonicInput?: string) => {
        console.log("createWallet()");
        const mnemonic = mnemonicInput ? 
            Mnemonic.fromPhrase(mnemonicInput) : 
            generateMnemonic();
    
        // verify uniqueness of new wallet in saved wallets
        // todo: integrate save wallets
        const isNewWallet = verifyWallet(mnemonic, []);
        if (isNewWallet) {
            // build Wallet type
            const newWallet = buildWallet(mnemonic);
            console.log("newWallet", newWallet);
            // update
            updateCashtabState("wallets", [...cashtabState.wallets, newWallet]);
        } else {
            console.error("Wallet already exists");
            // notification
        }
    }

    const updateCashtabState = async (key: string, value: Wallet[]) => {
        console.log("updateCashtabState key", key, "value", value);
    
        setCashtabState({ ...cashtabState, [`${key}`]: value});
    
        // value = getJsonWallets(value as Wallet[]);
    
        setWalletLoading(true);
        await localforage.setItem(key, value);
        setWalletLoading(false);
    }

    const update = async (cashtabState: CashtabState) => {
        console.log("update()");
    
        const activeWallet = cashtabState.wallets[0];
        // todo: get indexer data for wallet
    
        const newWalletState: WalletState = {
            balances: {
                totalBalance: 0,
                totalBalanceInSatoshis: 0
            },
            tokenBalance: 0,
            utxos: [],
            tokens: [],
            slpBalancesAndUtxos: {},
            parsedTxHistory: []
        };
    
        // update state and storage
        activeWallet.state = newWalletState;
        const remainingWallets = cashtabState.wallets.slice(1);
        await updateCashtabState('wallets', [activeWallet, ...remainingWallets]);
    }
    
    return (
        <WalletContext value={{
            wallet,
            createWallet,
        }}>
            {children}
            {walletLoading && <Loading>{"Loading Wallet..."}</Loading>}
        </WalletContext>
    )
}

export const useWallet = () => {
    const context = use(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within an WalletProvider");
    }

    return context;
}