export interface CashtabState {
    wallets: Wallet[] | [];
}
export type Wallet = {
    mnemonic: any;
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
    utxos: unknown[] | [];
    slp: Slp;
    parsedTxHistory: unknown[] | [];
}
export declare class WalletState implements WalletStateInterface {
    balances: Balances;
    utxos: unknown[] | [];
    slp: Slp;
    parsedTxHistory: unknown[] | [];
    constructor();
}
export type Slp = {
    tokens: Tokens;
    nonSlpUtxos: object[] | [];
    slpUtxos: object[] | [];
};
export type Balances = {
    totalBalance: number;
    totalBalanceInSatoshis: number;
};
export type Token = {
    rawBalance: number;
    balance: number;
    info: TokenInfo;
    tokenId: string;
};
export type TokenInfo = {
    name: string;
    hash: string;
    ticker: string;
    decimals: number;
    tokenId: string;
    uri: string;
    vaultScriptHash: string;
    version: number;
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
