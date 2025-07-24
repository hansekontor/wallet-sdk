import { createContext, use, useState, useEffect, type Context } from 'react';
import Loading from '../../components/Loading/DefaultLoading';
import {
    generateMnemonic, 
    verifyWallet, 
    buildWallet,
} from './creation';
import CashtabState, { getWalletOrder } from './management';
import {
    getUtxos, 
    getBalances, 
    getSlpBalancesAndUtxos,
    getTxHistory, 
    parseTxHistory
} from './update';
// import {
//     loadCashtabSettings,
//     changeSettings,
// } from './settings';

// @ts-ignore
import bcash from '@hansekontor/checkout-components';
const { Mnemonic } = bcash;
import { type Wallet, type WalletState } from './types';
import localforage from 'localforage';

type WalletContextType = {
    wallet: Wallet | undefined,
    cashtab: any,
    createWallet: Function,
    activateWallet: Function,
    update: Function,
}
export const WalletContext: Context<WalletContextType> = createContext({} as WalletContextType);

export const WalletProvider = ( { children }: 
    { children: React.ReactElement }
) => {
    // const [wallet, setWallet] = useState(null);
    const [wallet, setWallet] = useState<Wallet | undefined>();
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
        if (!activeWallet) {
            throw new Error("No wallet found");
        }

        // todo: get indexer data for wallet
        const utxos = await getUtxos(activeWallet.Path1899.cashAddress);
        const slpBalancesAndUtxos = getSlpBalancesAndUtxos(utxos);
        const balances = getBalances(slpBalancesAndUtxos);
        const txHistory = await getTxHistory(activeWallet.Path1899.cashAddress);
        const parsedTxHistory = parseTxHistory(txHistory);
        
        const newWalletState: WalletState = {
            balances,
            utxos,
            slpBalancesAndUtxos,
            parsedTxHistory,
        };
    
        // update state and storage
        activeWallet.state = newWalletState;
        const remainingWallets = cashtabState.wallets.slice(1);
        await updateCashtabState('wallets', [activeWallet, ...remainingWallets]);
        setWallet(activeWallet);
    }

    const activateWallet = async (walletToActivate: Wallet) => {
        const newStoredWallets = getWalletOrder(walletToActivate, cashtabState.wallets);   
        updateCashtabState("wallets", newStoredWallets);
    }
    
    return (
        <WalletContext value={{
            wallet,
            cashtab: cashtabState,
            createWallet,
            activateWallet,
            update,
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