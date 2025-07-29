import { SlpBalancesAndUtxos, Balances, Tokens } from '../types';
export declare const getUtxos: (address: string) => Promise<any>;
export declare const getBalances: (slpBalancesAndUtxos: SlpBalancesAndUtxos) => Balances;
export declare const getSlpBalancesAndUtxos: (utxos: any[]) => {
    tokens: Tokens;
    nonSlpUtxos: any[];
    slpUtxos: any[];
};
export declare const getTxHistory: (address: string) => Promise<any>;
export declare const parseTxHistory: (txHistory: any[]) => any[];
