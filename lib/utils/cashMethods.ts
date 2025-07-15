import { type Wallet, type State } from '../context/Wallet/types';

export const getWalletState = (wallet: Wallet): State => {
    if (!wallet || !wallet.state) {
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