export interface CashtabState {
    wallets: Wallet[] | [],
}

export type Wallet = {
    mnemonic: any,
    name: string, 
    Path1899: Path,
    state: WalletState
}

export type Path = {
    publicKey: string, 
    cashAddress: string, 
    slpAddress: string, 
    fundingWif: string
    legacyAddress: string
}

export interface WalletStateInterface {
    balances: Balances,
    utxos: unknown[] | [],
    slp: Slp,
    parsedTxHistory: unknown[] | [],
}

export class WalletState implements WalletStateInterface {
    balances: Balances;
    utxos: unknown[] | [];
    slp: Slp;
    parsedTxHistory: unknown[] | [];
    
    constructor() {
        this.balances = {
            totalBalance: 0,
            totalBalanceInSatoshis: 0
        };
        this.utxos = [];
        this.parsedTxHistory = [];
        this.slp = {
            tokens: new Tokens(),
            slpUtxos: [],
            nonSlpUtxos: []
        }
    }

}

export type Slp = {
    tokens: Tokens,
    nonSlpUtxos: object[] | [],
    slpUtxos: object[] | []
}

export type Balances = {
    totalBalance: number, 
    totalBalanceInSatoshis: number
}

export type Token = {
    rawBalance: number,
    balance: number,
    info: TokenInfo,
    tokenId: string,
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

interface TokensInterface {
    prod: Token,
    sandbox: Token
};

export class Tokens implements TokensInterface {
    prod: Token;
    sandbox: Token;

    constructor() {
        this.prod = {
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
            tokenId: "52b12c03466936e7e3b2dcfcff847338c53c611ba8ab74dd8e4dadf7ded12cf6"
        };

        this.sandbox = {
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
            tokenId: "4075459e0ac841f234bc73fc4fe46fe5490be4ed98bc8ca3f9b898443a5a381a"
        };
    }
}

export type ParsedTx = {
    txid: string;
    height: number;
    blocktime: number;
    confirmations: number;
    outgoing: boolean;
    type: "SEND" | "MINT" | "BURN";
    sender: string;
    recipients: string[];
    sandbox: boolean;
    amountSent: number;
    amountReceived: number;
}