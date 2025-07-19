import { createContext, use, useState, type Context } from 'react';
import { validateMnemonic } from '../../utils/mnemonic';
import Loading from '../../components/Loading/DefaultLoading';
import { useWallet } from '../Wallet';

type Wallet = {
    placeholder: boolean
}

type App = {
    wallet: Wallet,
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

    const { createWallet } = useWallet();

    const [loadingStatus, setLoadingStatus] = useState("");
    // const [walletUpdateAvailable, setWalletUpdateAvailable] = useState(false);
    const [walletUpdateAvailable, ] = useState(false);

    const wallet = {
        placeholder: true
    };

    /**
     * Synchronizes the currently active wallet and updates transactions and balances.
     */
    const updateWallet = async () => {

    };

    /**
     * Changes the active wallet to the one with the specified wallet name.
     * @param name 
     */
    const changeWallet = (name: string) => {
        // find wallet 
        // activate wallet / change wallet order
        console.log("name", name);
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
    const send = async (amount: number, addresses: string[], testOnly: boolean = false) => {
        console.log(amount, addresses, testOnly);
        // manage utxos and change
        // build transaction
        // sign transaction
        // broadcast transaction
        // return something
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