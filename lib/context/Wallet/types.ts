import BigNumber from "bignumber.js"

export interface CashtabState {
    wallets: Wallet[] | [],
}

export type Wallet = {
    mnemonic: string, 
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
    utxos: any[] | [],
    slpBalancesAndUtxos: SlpBalancesAndUtxos,
    parsedTxHistory: any[] | [],
}

export class WalletState implements WalletStateInterface {
    balances: Balances;
    utxos: any[] | [];
    slpBalancesAndUtxos: SlpBalancesAndUtxos;
    parsedTxHistory: any[] | [];
    
    constructor() {
        this.balances = {
            totalBalance: 0,
            totalBalanceInSatoshis: 0
        };
        this.utxos = [];
        this.parsedTxHistory = [];
        this.slpBalancesAndUtxos = {
            tokens: new Tokens(),
            slpUtxos: [],
            nonSlpUtxos: []
        }
    }

}

export type SlpBalancesAndUtxos = {
    tokens: Tokens,
    nonSlpUtxos: object[] | [],
    slpUtxos: object[] | []
}

export type Balances = {
    totalBalance: number, 
    totalBalanceInSatoshis: number
}

export type Token = {
    balance: any,
    info: any,
    tokenId: string,
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
            balance: new BigNumber(0),
            info: {},
            tokenId: ""
        };

        this.sandbox = {
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