export type Token = {
    rawBalance: number;
    balance: number;
    info: TokenInfo;
    tokenId: string;
    hasBaton: boolean;
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
export declare class Tokens {
    supported: Token[];
    prod: Token;
    sandbox: Token;
    constructor();
}
export default Tokens;
