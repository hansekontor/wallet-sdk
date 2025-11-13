# wallet-sdk
## Purpose
This React component library written in TypeScript allows to wrap a web-app into a `WalletContext`and either use it as a plain wallet or as another application with embedded wallet functionality.
## Installation
```
npm install @hansekontor/wallet-sdk
```
## States and Variables
| Name           | Type                | Description                                                                     |
|----------------|---------------------|---------------------------------------------------------------------------------|
| status         | string              | Current status of the wallet.                                                   |
| hasInitialized | boolean             | Whether the wallet has initialized (created new wallet or retrieved from cache) |
| wallet         | object \| undefined | The active wallet.                                                              |
| cashtab        | object              | The Cashtab State (taken from cashtab wallet)                                   |
| contacts       | object              | List of contacts stored in local storage.                                       |
## Functions
| Name                   | Parameters                                                                 | Return Type   | Description                                                                                                  |
|------------------------|----------------------------------------------------------------------------|---------------|--------------------------------------------------------------------------------------------------------------|
| validateMnemonic       | (mnemonic: string)                                                         | boolean       | Validates a mnemonic seed phrase.                                                                            |
| updateWallet           | (forceUpdate: boolean)                                                     | Promise<void> | Synchronizes the currently active wallet and its transactions.                                               |
| changeWallet           | (name: string)                                                             | Promise<void> | Switches the active wallet to the one with the specified name.                                               |
| addWallet              | (activateWallet: boolean, mnemonic?: string)                               | Promise<void> | Creates a new wallet randomly or by imported mnemonic, adds it to saved wallets and optionally activates it. |
| renameWallet           | (oldName: string, newName: string)                                         | Promise<void> | Renames a wallet and updates the local storage.                                                              |
| deleteWallet           | (name: string)                                                             | Promise<void> | Deletes a wallet from stored wallets.                                                                        |
| getMaxSendAmount       | (tokenId: string)                                                          | number        | Calculates the maximum token amount to be sent after applying postage.                                       |
| calculatePostageAmount | (amount: number, tokenId: string)                                          | number        | Calculates postage amount.                                                                                   |
| send                   | (amount: number, addresses: string[], tokenId: string, testOnly?: boolean) | Promise<void> | Sends tokens to specified output addresses.                                                                  |
| addContact             | (contact: Contact)                                                         | Promise<void> | Adds a single contact to the list.                                                                           |
| bulkAddContacts        | (newContacts: Contact[])                                                   | Promise<void> | Adds multiple contacts to the list in bulk.                                                                  |
| removeContact          | (id: string)                                                               | Promise<void> | Removes a contact by its id.                                                                                 |
| editContact            | (updatedContact: Contact)                                                  | Promise<void> | Edits an existing contact.                                                                                   |