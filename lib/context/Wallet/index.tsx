import { createContext, use, useState, useEffect, type Context } from 'react';
import localforage from 'localforage';
// @ts-ignore
import bcash from '@hansekontor/checkout-components';
const { Mnemonic } = bcash;

import {
    generateMnemonic, 
    verifyWallet, 
    buildWallet,
} from './creation';
import CashtabState, { getWalletOrder } from './management';
import {
    getUtxos, 
    getBalances, 
    getSlp,
    getTxHistory, 
    parseTxHistory,
} from './update';
import EventBus from '../../utils/events';
import { type Wallet, type WalletState } from './types';
import useTimeout from '../../hooks/useTimeout';
import deepEqual from 'deep-equal';

type WalletContextType = {
    wallet: Wallet | undefined,
    cashtab: any,
    createWallet: Function,
    activateWallet: Function,
    removeWallet: Function,
    renameWalletLocally: Function,
    update: Function,
    walletLoading: boolean,
    hasInitialized: boolean
}
export const WalletContext: Context<WalletContextType> = createContext({} as WalletContextType);

export const WalletProvider = ( { children }: 
    { children: React.ReactElement }
) => {
    // const [wallet, setWallet] = useState(null);
    const [wallet, setWallet] = useState<Wallet | undefined>();
    const [cashtabState, setCashtabState] = useState(new CashtabState());
    const [walletLoading, setWalletLoading ] = useState(true);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [storageLoaded, setStorageLoaded] = useState(false);

    // initial loading
    useEffect(() => {
        loadCashtabState();
    }, [])

    // emit event if initial loading is over and sync with indexer if wallet was found in storage
    useEffect(() => {
        if (cashtabState.wallets.length > 0) {
            update(cashtabState);
        } else {
            setWalletLoading(false);
        }
    }, [hasInitialized, storageLoaded, cashtabState.wallets[0]?.name])

    // sync with indexer every 10s 
    useTimeout(() => {
        if (wallet) {
            update(cashtabState);            
        }
    }, 10000);

    const loadCashtabState = async () => {
        const wallets = await localforage.getItem("wallets");
        if (wallets) {
            console.log("Loading stored wallets");
            const newState = Object.assign(cashtabState, { wallets });
            setCashtabState(newState);            
        } else {
            console.log("No stored wallets available")
            setHasInitialized(true);
        }
        setStorageLoaded(true);
    };

    const createWallet = async (activate: boolean, mnemonicInput?: string) => {
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
            if (activate) {
                await updateCashtabState("wallets", [newWallet, ...cashtabState.wallets]);
            } else {
                await updateCashtabState("wallets", [...cashtabState.wallets, newWallet]);
            }
            EventBus.emit("WALLET_ADDED", "success");
        } else {
            throw new Error("Wallet already exists");
        }
    }

    const updateCashtabState = async (key: string, value: Wallet[]) => {
        setCashtabState({ ...cashtabState, [`${key}`]: value});
    
        setWalletLoading(true);
        await localforage.setItem(key, value);
        setWalletLoading(false);
    }

    const update = async (cashtabState: CashtabState) => {
        const activeWallet = cashtabState.wallets[0];
        if (!activeWallet) {
            throw new Error("No wallet found");
        }

        const address = activeWallet.Path1899.cashAddress;

        // get indexed data for wallet
        const utxos = await getUtxos(address);
        const previousUtxos = activeWallet.state.utxos;
        const utxosHaveChanged = !deepEqual(utxos, previousUtxos);
        if (utxosHaveChanged) {
            const slp = getSlp(utxos);
            const balances = getBalances(slp);
            const txHistory = await getTxHistory(address);
            const parsedTxHistory = parseTxHistory(txHistory, address);
            
            const newWalletState: WalletState = {
                balances,
                utxos,
                slp,
                parsedTxHistory,
            };
        
            activeWallet.state = newWalletState;

            const remainingWallets = cashtabState.wallets.slice(1);
            const newWallets = [activeWallet, ...remainingWallets];
            await updateCashtabState('wallets', newWallets);
            EventBus.emit("WALLET_UPDATED", "success");
        } else {
            setWalletLoading(false);
        }

        setWallet(activeWallet);           
        if (!hasInitialized) {
            setHasInitialized(true);
        }            

    }

    const activateWallet = async (walletToActivate: Wallet) => {
        const newStoredWallets = getWalletOrder(walletToActivate, cashtabState.wallets);   
        await updateCashtabState("wallets", newStoredWallets);
        EventBus.emit("WALLET_CHANGED", "success");
    }

    const removeWallet = async (walletToDelete: Wallet) => {
        const newStoredWallets = cashtabState.wallets.filter((wallet: Wallet) => wallet.name !== walletToDelete.name);
        await updateCashtabState("wallets", newStoredWallets);
        EventBus.emit("WALLET_DELETED", "success");
    }

    const renameWalletLocally = async (walletToRename: Wallet, newName: string) => {
        const newStoredWallets = cashtabState.wallets.map((wallet: Wallet) => {
            const isWalletToRename = wallet.name === walletToRename.name;
            if (isWalletToRename) {
                const renamedWallet = wallet;
                renamedWallet.name = newName;
                return renamedWallet;
            } else {
                return wallet;
            }
        });
        await updateCashtabState("wallets", newStoredWallets);
    }
    
    return (
        <WalletContext value={{
            wallet,
            cashtab: cashtabState,
            createWallet,
            activateWallet,
            removeWallet,
            renameWalletLocally,
            update,
            walletLoading,
            hasInitialized,
        }}>
            {children}
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