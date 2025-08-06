export type Token = {
    rawBalance: number,
    balance: number,
    info: TokenInfo,
    tokenId: string,
    hasBaton: boolean
}

export type TokenInfo = {
    name: string,
    hash: string,
    ticker: string,
    decimals: number,
    tokenId: string,
    uri: string,
    vaultScriptHash: string,
    version: number
}

export class Tokens {
    supported: Token[];
    prod: Token;
    sandbox: Token;


    constructor() {
        this.supported = [
            {
                rawBalance: 0,
                balance: 0,
                info: {
                    "tokenId": "52b12c03466936e7e3b2dcfcff847338c53c611ba8ab74dd8e4dadf7ded12cf6",
                    "ticker": "BUX",
                    "name": "Badger Universal Token",
                    "uri": "https://bux.digital",
                    "hash": "",
                    "decimals": 4,
                    "version": 2,
                    "vaultScriptHash": "08d6edf91c7b93d18306d3b8244587e43f11df4b"
                },
                tokenId: "52b12c03466936e7e3b2dcfcff847338c53c611ba8ab74dd8e4dadf7ded12cf6",
                hasBaton: false
            },
            {
                rawBalance: 0,
                balance: 0,
                info: {
                    "tokenId": "4075459e0ac841f234bc73fc4fe46fe5490be4ed98bc8ca3f9b898443a5a381a",
                    "ticker": "BUXs",
                    "name": "BUX (Sandbox)",
                    "uri": "",
                    "hash": "",
                    "decimals": 4,
                    "version": 2,
                    "vaultScriptHash": "16748bbeb9fa3f2bdeb0fc5f7e23dd9ad166ace6"
                },
                tokenId: "4075459e0ac841f234bc73fc4fe46fe5490be4ed98bc8ca3f9b898443a5a381a",
                hasBaton: false
            }
        ]
        this.prod = this.supported[0];
        this.sandbox = this.supported[1];
    }
}

export default Tokens;