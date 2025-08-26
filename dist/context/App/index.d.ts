import { Context } from 'react';
import { Wallet } from '../Wallet/types';
import { default as CashtabState } from '../Wallet/management';
import { Contact } from '../../hooks/useContacts';
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
     * @param name The name of the wallet to switch to.
     */
    changeWallet: (name: string) => Promise<void>;
    /**
     * Creates a new wallet randomly or by imported mnemonic, adds it to saved wallets and activates it.
     * @param activateWallet Whether to activate the wallet after adding.
     * @param mnemonic Optional mnemonic phrase to import a wallet.
     */
    addWallet: (activateWallet: boolean, mnemonic?: string) => Promise<void>;
    /**
     * Renames a wallet and updates the storage.
     * @param oldName Old wallet name.
     * @param newName New wallet name.
     */
    renameWallet: (oldName: string, newName: string) => Promise<void>;
    /**
     * Deletes a wallet from stored wallets.
     * @param name The name of the wallet to delete.
     */
    deleteWallet: (name: string) => Promise<void>;
    /**
     * Calculates the max token amount to be sent after applying postage.
     * @param tokenId Token ID.
     * @returns The max sendable token amount.
     */
    getMaxSendAmount: (tokenId: string) => number;
    /**
     * Calculates postage amount.
     * @param amount The formatted token amount.
     * @param tokenId Token ID.
     * @returns The postage amount.
     */
    calculatePostageAmount: (amount: number, tokenId: string) => number;
    /**
     * Sends tokens to specified output addresses.
     * @param amount Formatted token amount to send.
     * @param addresses Array of recipient addresses.
     * @param tokenId Token ID.
     * @param testOnly Whether to omit broadcasting the transaction.
     * @returns Explorer link to the transaction.
     */
    send: (amount: number, addresses: string[], tokenId: string, testOnly?: boolean) => Promise<string>;
    /** Placeholder function to bridge */
    bridge: () => void;
    /**
     * Builds and broadcast BURN transaction and uses it for cashout.
     * @param amount Formatted token amount to withdraw.
     * @param type "giftcard" or "fiat"
     */
    withdraw: (amount: number, type: "giftcard" | "fiat") => void;
    /**
     * List of contacts stored in local storage.
     */
    contacts: Contact[];
    /**
     * Adds a single contact to the list.
     * Generates a unique ID for the contact.
     *
     * @param contact - The contact object to add.
     */
    addContact: (contact: Contact) => Promise<void>;
    /**
     * Adds multiple contacts to the list in bulk.
     * Generates unique IDs for each contact.
     *
     * @param newContacts - Array of contacts to add.
     */
    bulkAddContacts: (newContacts: Contact[]) => Promise<void>;
    /**
     * Removes a contact by its ID.
     *
     * @param id - The ID of the contact to remove.
     */
    removeContact: (id: string) => Promise<void>;
    /**
     * Edits an existing contact.
     * Matches contact by ID and updates its information.
     *
     * @param updatedContact - The contact object with updated data.
     */
    editContact: (updatedContact: Contact) => Promise<void>;
};
export declare const AppContext: Context<App>;
export declare const AppProvider: ({ children }: {
    children: React.ReactElement;
}) => import("react/jsx-runtime").JSX.Element;
/**
 * Hook to access the App context.
 * Must be used within an AppProvider.
 *
 * @throws Will throw an error if used outside of AppProvider.
 * @returns The current app context object with wallet and state management functions.
 */
export declare const useApp: () => App;
