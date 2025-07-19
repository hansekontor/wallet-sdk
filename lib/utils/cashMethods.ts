import { type Wallet, type WalletState } from '../context/Wallet/types';

export const getWalletState = (wallet?: Wallet): WalletState => {
    if (!wallet) {
        return {
            balances: { totalBalance: 0, totalBalanceInSatoshis: 0 },
            tokenBalance: 0,
            tokens: [],
            slpBalancesAndUtxos: {},
            parsedTxHistory: [],
            utxos: [],
        };
    }

    return wallet.state;
};