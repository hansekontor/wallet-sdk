import { createContext, use, useState, useEffect, type Context } from 'react';
import { validateMnemonic } from '../../utils/mnemonic';
import { useWallet } from '../Wallet';
import { type Wallet } from '../Wallet/types';
import CashtabState from '../Wallet/management';
import useEcash from '../../hooks/useEcash';
import EventBus from '../../utils/events';
// @ts-ignore
import bcash from '@hansekontor/checkout-components';
const {
    TX,
    KeyRing, 
    Script, 
} = bcash;


type App = {
    status: string,
    hasInitialized: boolean,
    wallet: Wallet | undefined,
    cashtab: CashtabState,
    validateMnemonic: Function, 
    updateWallet: Function, 
    changeWallet: Function, 
    renameWallet: Function,
    addWallet: Function,
    deleteWallet: Function,
    getMaxSendAmount: Function,
    send: Function, 
    bridge: Function,
    withdraw: Function,
}
export const AppContext: Context<App> = createContext({} as App);

export const AppProvider = ({ children }: 
    { children: React.ReactElement}
) => {

    const { createWallet, cashtab, wallet, activateWallet, update, walletLoading, hasInitialized, removeWallet, renameWalletLocally } = useWallet();
    const { getPostage, getTokenPostage, getMaxPostageAmount, buildSendTx, broadcastTx, postPayment } = useEcash();

    const [status, setStatus] = useState<string>("WALLET_INIT");
    const [postageObj, setPostageObj] = useState(null);

    // handle wallet loading status
    useEffect(() => {
        const isIdle = hasInitialized && !walletLoading;
        if (isIdle) {
            setStatus("WALLET_IDLE");
        } else {
            if (hasInitialized) {
                if (status !== "WALLET_LOADING") {
                    setStatus("WALLET_LOADING");
                }
            }
        }
    }, [hasInitialized, walletLoading])

    // get postage data
    useEffect(() => {
        const getPostageForMaxAmount = async () => {
            const postage = await getPostage();
            setPostageObj(postage);
        }

        if (!postageObj)
            getPostageForMaxAmount();
    }, [])

    /**
     * Synchronizes the currently active wallet and updates transactions and balances.
     */
    const updateWallet = async () => {
        update(cashtab);
    };

    /**
     * Changes the active wallet to the one with the specified wallet name.
     * @param name 
     */
    const changeWallet = async (name: string) => {        
        // find wallet 
        const newWallet = cashtab.wallets.find((wallet: Wallet) => wallet.name === name);
        if (newWallet) {
            // activate wallet / change wallet order
            await activateWallet(newWallet);
        } else {
            throw new Error("Wallet not found")
        }
    };

    /**
     * Creates new wallet randomly or by imported mnemonic, adds it to saved wallets and activates it. 
     * @param mnemonic 
     */
    const addWallet = async (activateWallet: boolean, mnemonic?: string) => {
        // if valid mnemonic is specified, import wallet
        // else create new random wallet
        if (mnemonic) {
            const isValidMnemonic = validateMnemonic(mnemonic);
            if (isValidMnemonic) {
                createWallet(activateWallet, mnemonic);
            } else {
                throw new Error("Invalid mnemonic")
            }
        } else {
            createWallet(activateWallet);
        }

        // add to saved wallet
        // activate wallet
        // notification

        // update wallet
    };

    /**
     * Changes the name of a wallet and updates the storage
     * @param oldName 
     * @param newName 
     */
    const renameWallet = async (oldName: string, newName: string) => {
        const hasValidLength = newName.length <= 40;
        if (!hasValidLength) {
            throw new Error("New name is too long (>40)");
        }

        const walletToRename = cashtab.wallets.find((wallet: Wallet) => wallet.name === oldName);
        if (walletToRename) {
            await renameWalletLocally(walletToRename, newName);
        } else {
            throw new Error("No wallet found with name"+oldName);
        }
    }

    /**
     * Deletes a wallet from stored wallets.
     * @param name 
     */
    const deleteWallet = async (name: string) => {
        // find wallet 
        const walletToDelete = cashtab.wallets.find((wallet: Wallet) => wallet.name === name);
        if (walletToDelete) {
            await removeWallet(walletToDelete);
        } else {
            throw new Error("Wallet not found")
        }
    }

    /**
     * Sends MUSD to specifed output addresses.
     * @param amount 
     * @param addresses 
     * @param testOnly 
     */
    const send = async (amount: number, addresses: string[], sandbox: boolean, testOnly: boolean = false) => {
        if (!wallet?.Path1899) {
            throw new Error("No wallet found");
        }

        setStatus("SENDING_TOKENS");

        const tokens = wallet.state.slp.tokens;
        const tokenId = sandbox ? tokens.sandbox.tokenId : tokens.prod.tokenId;

        // get postage for MUSD
        const postage = await getTokenPostage(tokenId);

        // build transaction
        const remainderAddress = wallet.Path1899.cashAddress;
        const tx = await buildSendTx(amount, wallet, addresses, tokenId, postage, remainderAddress);

        // sign transaction
        const keyRingArray = KeyRing.fromSecret(wallet.Path1899.fundingWif);
        const hashTypes = Script.hashType;
        const sighashType = postage ?
            hashTypes.ALL | hashTypes.ANYONECANPAY | hashTypes.SIGHASH_FORKID 
            : hashTypes.ALL | hashTypes.SIGHASH_FORKID;
        tx.sign(keyRingArray, sighashType);

        // get output raw hex
        let txidStr;
        const rawTx = tx.toRaw();
        const hex = rawTx.toString('hex');
        console.log("hex", hex);

        // broadcast transaction
        if (postage) {
            const postageUrl = import.meta.env.VITE_POSTAGE_URL;
            const paymentObj = {
                merchantData: Buffer.alloc(0),
                transactions: [rawTx],
                refundTo:[{
                    script: Script.fromAddress(remainderAddress).toRaw(),
                    value: 0
                }],
                memo: ''
            };               
            const type = "etoken";

            const paymentAck = await postPayment(
                postageUrl, 
                paymentObj,
                type
            );
            if (paymentAck.payment) {
                const transactionIds = paymentAck.payment.transactions.map((t:any) =>
                    TX.fromRaw(t).txid()
                );
                txidStr = transactionIds[0];
                console.log("MUSD txid", txidStr);
            }
        } else {
            let broadcast = { success: true };
            if (!testOnly) {
                broadcast = await broadcastTx(hex);
            } 
            txidStr = tx.txid().toString('hex');

            if (broadcast.success) {
                console.log("MUSD txid", txidStr);
                EventBus.emit("TOKENS_SENT", "success");
            }
        }

        const link = `${import.meta.env.VITE_EXPLORER_URL}/tx/${txidStr}`;
        return link
    };

    const bridge = () => {

    };

    /**
     * Faciliates a BURN transaction for MUSD and cashes out via selected type.
     * @param amount 
     * @param type 
     */
    const withdraw = (amount: number, type: "giftcard" | "fiat") => {
        console.log(amount, type);
        // build burn tx
        // sign burn tx
        // broadcast burn tx
        // use burn tx for cashout
    };

    /**
     * Calculates the maximum amount to be send after applying the required postage rate.
     * @param sandbox 
     * @returns 
     */
    const getMaxSendAmount = (sandbox: boolean = false) => {
        if (!wallet)
            throw new Error("No wallet available");

        const postageAmount = getMaxPostageAmount(sandbox, wallet, postageObj);
        const tokens = wallet.state.slp.tokens;
        const tokenBalance = sandbox ? tokens.sandbox.balance : tokens.prod.balance;
        const maxSendAmount = tokenBalance - postageAmount;

        return maxSendAmount;
    }

    const context: App = {
        status,
        hasInitialized,
        wallet, 
        cashtab,
        validateMnemonic, 
        updateWallet, 
        changeWallet,
        renameWallet,
        addWallet,
        deleteWallet,
        getMaxSendAmount,
        send,
        bridge,
        withdraw,
    };

    return (
        <AppContext value={context}>
            {children}
        </AppContext>
    )
}

export const useApp = () => {
    const context = use(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }

    return context;
}