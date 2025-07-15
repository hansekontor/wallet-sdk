import { createContext, use, useState, type Context } from 'react';
import { validateMnemonic } from '../../utils/mnemonic';
import Loading from '../../components/Loading/DefaultLoading';

type Wallet = {
    placeholder: boolean
}

type App = {
    wallet: Wallet,
    walletUpdateAvailable: boolean, 
    validateMnemonic: Function, 
    updateWallet: Function, 
    changeWallet: Function, 
    createWallet: Function,
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

    const [loadingStatus, setLoadingStatus] = useState("");
    const [walletUpdateAvailable, setWalletUpdateAvailable] = useState(false);

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
    };

    /**
     * Creates new wallet randomly or by imported mnemonic, adds it to saved wallets and activates it. 
     * @param name
     * @param mnemonic 
     */
    const createWallet = async (name: string, mnemonic?: string) => {
        // if mnemonic import wallet
        // else create random wallet

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
        createWallet,
        send,
        receive, 
        bridge,
        withdraw,
        setLoadingStatus,   
    };

    return (
        <AppContext value={context}>
            {children}
            {loadingStatus && <Loading>{loadingStatus}</Loading>}
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