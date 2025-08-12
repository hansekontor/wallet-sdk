import { createContext, use, useState, useEffect, type Context } from 'react';
import { validateMnemonic } from '../../utils/mnemonic';
import { useWallet } from '../Wallet';
import { type Wallet, type Token} from '../Wallet/types';
import CashtabState from '../Wallet/management';
import useEcash from '../../hooks/useEcash';
import EventBus from '../../utils/events';
// @ts-expect-error: bcash does not have TypeScript types available
import bcash from '@hansekontor/checkout-components';
const {
    TX,
    KeyRing, 
    Script, 
} = bcash;

export { Tokens } from '../Wallet/tokens';


/**
 * The context shape for the app.
 */
type App = {
  /** Current status of the wallet */
  status: string;

  /** Whether the wallet system has initialized */
  hasInitialized: boolean;

  /** The active wallet, or undefined if none */
  wallet: Wallet | undefined;

  /** Cashtab state */
  cashtab: CashtabState;

  /**
   * Validate a mnemonic phrase.
   * @param mnemonic The mnemonic string to validate.
   * @returns True if valid, false otherwise.
   */
  validateMnemonic: (mnemonic: string) => boolean;

  /**
   * Synchronizes the currently active wallet and updates transactions and balances.
   * @param forceUpdate Whether to force update the wallet.
   */
  updateWallet: (forceUpdate: boolean) => Promise<void>;

  /**
   * Changes the active wallet to the one with the specified wallet name.
   * @param name The wallet name to switch to.
   */
  changeWallet: (name: string) => Promise<void>;

  /**
   * Creates and adds a wallet, optionally from a mnemonic, and activates it.
   * @param activateWallet Whether to activate the wallet after adding.
   * @param mnemonic Optional mnemonic phrase to import the wallet.
   */
  addWallet: (activateWallet: boolean, mnemonic?: string) => Promise<void>;

  /**
   * Renames a wallet.
   * @param oldName Old wallet name.
   * @param newName New wallet name.
   */
  renameWallet: (oldName: string, newName: string) => Promise<void>;

  /**
   * Deletes a wallet by name.
   * @param name The name of the wallet to delete.
   */
  deleteWallet: (name: string) => Promise<void>;

  /**
   * Calculates the max amount that can be sent for a token after postage.
   * @param tokenId The token identifier.
   * @returns The max sendable amount.
   */
  getMaxSendAmount: (tokenId: string) => number;

  /**
   * Calculates postage amount for a token and amount.
   * @param amount The amount for postage calculation.
   * @param tokenId The token identifier.
   * @returns The postage amount.
   */
  calculatePostageAmount: (amount: number, tokenId: string) => number;

  /**
   * Sends tokens to specified addresses.
   * @param amount Amount to send.
   * @param addresses Array of recipient addresses.
   * @param tokenId Token identifier.
   * @param testOnly Whether to run as a test without broadcasting.
   * @returns Link to the transaction.
   */
  send: (amount: number, addresses: string[], tokenId: string, testOnly?: boolean) => Promise<string>;

  /** Placeholder function to bridge */
  bridge: () => void;

  /**
   * Withdraw tokens via giftcard or fiat.
   * @param amount Amount to withdraw.
   * @param type "giftcard" or "fiat"
   */
  withdraw: (amount: number, type: "giftcard" | "fiat") => void;
};
export const AppContext: Context<App> = createContext({} as App);

export const AppProvider = ({ children }: 
    { children: React.ReactElement}
) => {

    const { createWallet, cashtab, wallet, activateWallet, update, walletLoading, hasInitialized, removeWallet, renameWalletLocally } = useWallet();
    const { getPostageObj, getTokenPostage, getPostageAmount, buildSendTx, broadcastTx, postPayment } = useEcash();

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
            const postage = await getPostageObj();
            setPostageObj(postage);
        }

        if (!postageObj)
            getPostageForMaxAmount();
    }, [])

    /**
     * Synchronizes the currently active wallet and updates transactions and balances.
     */
    const updateWallet = async (forceUpdate: boolean) => {
        update(cashtab, forceUpdate);
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
    const send = async (amount: number, addresses: string[], tokenId: string, testOnly: boolean = false) => {
        if (!wallet) {
            throw new Error("No wallet found");
        }

        const hasToken = wallet.state.slp.tokens.find((token: Token) => token.tokenId === tokenId) ? true : false;
        if (!hasToken) {
            throw new Error("Unknown token");
        }

        setStatus("SENDING_TOKENS");

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
                const transactionIds = paymentAck.payment.transactions.map((t: Buffer) =>
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
     * @param tokenId 
     * @returns 
     */
    const getMaxSendAmount = (tokenId: string) => {
        if (!wallet)
            throw new Error("No wallet available");

        const postageAmount = getPostageAmount(tokenId, wallet, postageObj);
        const tokenEntry = wallet.state.slp.tokens.find((token: Token) => token.tokenId === tokenId);
        if (!tokenEntry)
            throw new Error("Unknown token");
        const tokenBalance = tokenEntry.balance;
        const maxSendAmount = tokenBalance - postageAmount;

        return maxSendAmount;
    }
    /**
     * Calculates the postage amount for a given token
     * @param amount 
     * @param tokenId 
     * @returns 
     */
    const calculatePostageAmount = (amount: number, tokenId: string) => {
        if (!wallet) 
            throw new Error("No wallet available");

        const postageAmount = getPostageAmount(tokenId, wallet, postageObj, amount);

        return postageAmount;
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
        calculatePostageAmount,
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

/**
 * Hook to access the App context.
 * Must be used within an AppProvider.
 * 
 * @throws Will throw an error if used outside of AppProvider.
 * @returns The current app context object with wallet and state management functions.
 */
export const useApp = () => {
    const context = use(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }

    return context;
}