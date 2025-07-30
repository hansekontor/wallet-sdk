import { Slp, Balances, Tokens } from '../types';
export declare const getUtxos: (address: string) => Promise<any>;
export declare const getBalances: (slp: Slp) => Balances;
export declare const getSlp: (utxos: any[]) => {
    tokens: Tokens;
    nonSlpUtxos: any[];
    slpUtxos: any[];
};
export declare const getTxHistory: (address: string) => Promise<any>;
export declare const parseTxHistory: (txHistory: any[]) => any[];
