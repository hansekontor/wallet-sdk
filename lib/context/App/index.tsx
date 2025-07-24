import { createContext, use, useState, type Context } from 'react';
import { validateMnemonic } from '../../utils/mnemonic';
import Loading from '../../components/Loading/DefaultLoading';
import { useWallet } from '../Wallet';
import { type Wallet } from '../Wallet/types';
import CashtabState from '../Wallet/management';
import useEcash from '../../hooks/useEcash';
// @ts-ignore
import bcash from '@hansekontor/checkout-components';
const {
    TX,
    KeyRing, 
    Script, 
} = bcash;


type App = {
    wallet: Wallet | undefined,
    cashtab: CashtabState,
    walletUpdateAvailable: boolean, 
    validateMnemonic: Function, 
    updateWallet: Function, 
    changeWallet: Function, 
    addWallet: Function,
    send: Function, 
    receive: object,
    bridge: Function,
    withdraw: Function,
    setLoadingStatus: Function
}
export const AppContext: Context<App> = createContext({} as App);

export const AppProvider = ({ children }: 
    { children: React.ReactElement}
) => {

    const { createWallet, cashtab, wallet, activateWallet, update } = useWallet();
    const { getPostage, buildSendTx, broadcastTx, postPayment } = useEcash();

    const [loadingStatus, setLoadingStatus] = useState("");
    // const [walletUpdateAvailable, setWalletUpdateAvailable] = useState(false);
    const [walletUpdateAvailable, ] = useState(false);

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
        const isValidWalletInput = name.length === 5;
        if (isValidWalletInput) {
            // find wallet 
            const newWallet = cashtab.wallets.find((wallet: Wallet) => wallet.name === name);
            if (newWallet) {
                // activate wallet / change wallet order
                await activateWallet(newWallet);
            } else {
                throw new Error("Wallet not found")
            }

        } else {
            throw new Error("Invalid wallet name");
        }
    };

    /**
     * Creates new wallet randomly or by imported mnemonic, adds it to saved wallets and activates it. 
     * @param mnemonic 
     */
    const addWallet = async (mnemonic?: string) => {
        // if valid mnemonic is specified, import wallet
        // else create new random wallet
        console.log("addWallet mnemonic", mnemonic);
        if (mnemonic) {
            console.log("addWallet import wallet");
            const isValidMnemonic = validateMnemonic(mnemonic);
            if (isValidMnemonic) {
                createWallet(mnemonic);
            }
        } else {
            console.log("addWallet create new wallet");
            createWallet();
        }

        // add to saved wallet
        // activate wallet
        // notification

        // update wallet
    };

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

        console.log(amount, addresses, testOnly);
        const tokens = wallet.state.slpBalancesAndUtxos.tokens;
        const tokenId = sandbox ? tokens.sandbox.tokenId : tokens.prod.tokenId;

        // get postage for MUSD
        const postage = await getPostage(tokenId);

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
            // todo: remove hard coded url
            const postageUrl = "https://pay.badger.cash/postage?currency=etoken";
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
            }
        }

        // todo: remove hardcoded explorer link
        const link = `https://explorer.e.cash/tx/${txidStr}`;
        return link
    };

    /**
     * Contains receiving data.
     */
    const receive = {

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

    const context: App = {
        wallet, 
        cashtab,
        walletUpdateAvailable, 
        validateMnemonic, 
        updateWallet, 
        changeWallet,
        addWallet,
        send,
        receive, 
        bridge,
        withdraw,
        setLoadingStatus,   
    };

    return (
        <AppContext value={context}>
            {children}
            {loadingStatus.length > 0 && <Loading>{loadingStatus}</Loading>}
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