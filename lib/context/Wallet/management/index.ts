import { type Wallet } from '../types';

export const activateWallet = () => {

}

export const activateNewWallet = () => {

}

export const addNewSavedWallet = () => {

}

export const deleteWallet = () => {

}

export const getActiveWallet = () => {

}

export const getSavedWallet = () => {

}

export const getWallet = () => {

}

export const getWalletDetails = () => {

}

export const getWalletOnStartup = () => {

}

export const renameWallet = () => {

}

// Copyright (c) 2024 The Bitcoin developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

/**
 * cashtabState.js
 * cashtabState should be a class, so that we can ensure the default cashtabState
 * is always a new one
 */

// import CashtabSettings from 'config/CashtabSettings';
// import CashtabCache from 'config/CashtabCache';
// import { CashtabWallet } from 'wallet';


interface CashtabStateInterface {
    wallets: Wallet[];
}

class CashtabState implements CashtabStateInterface {
    wallets: Wallet[];
    constructor(
        wallets = [],
    ) {
        this.wallets = wallets;
    }
}

export default CashtabState;
