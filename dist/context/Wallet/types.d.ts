export interface CashtabState {
    wallets: Wallet[] | [];
}
export type Wallet = {
    mnemonic: string;
    name: string;
    Path1899: Path;
    state: WalletState;
};
export type Path = {
    publicKey: string;
    cashAddress: string;
    slpAddress: string;
    fundingWif: string;
    legacyAddress: string;
};
export interface WalletStateInterface {
    balances: Balances;
    utxos: any[] | [];
    slpBalancesAndUtxos: SlpBalancesAndUtxos;
    parsedTxHistory: any[] | [];
}
export declare class WalletState implements WalletStateInterface {
    balances: Balances;
    utxos: any[] | [];
    slpBalancesAndUtxos: SlpBalancesAndUtxos;
    parsedTxHistory: any[] | [];
    constructor();
}
export type SlpBalancesAndUtxos = {
    tokens: Tokens;
    nonSlpUtxos: object[] | [];
    slpUtxos: object[] | [];
};
export type Balances = {
    totalBalance: number;
    totalBalanceInSatoshis: number;
};
export type Token = {
    balance: any;
    info: any;
    tokenId: string;
};
interface TokensInterface {
    prod: Token;
    sandbox: Token;
}
export declare class Tokens implements TokensInterface {
    prod: Token;
    sandbox: Token;
    constructor();
}
export {};
