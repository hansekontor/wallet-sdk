export { type Token, type TokenInfo } from './tokens';
import { type Token } from './tokens';

export interface CashtabState {
    wallets: Wallet[] | [],
}

export type Mnemonic = {
  bits: number;
  entropy: Uint8Array;
  language: string;
  phrase: string;
};

export type Wallet = {
    mnemonic: Mnemonic,
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
    parsedTxHistory: ParsedTx[] | [],
}

export class WalletState implements WalletStateInterface {
    balances: Balances;
    utxos: unknown[] | [];
    slp: Slp;
    parsedTxHistory: ParsedTx[] | [];

    constructor() {
        this.balances = {
            totalBalance: 0,
            totalBalanceInSatoshis: 0
        };
        this.utxos = [];
        this.parsedTxHistory = [];
        this.slp = {
            tokens: [],
            slpUtxos: [],
            nonSlpUtxos: []
        }
    }

}

export type Slp = {
    tokens: Token[],
    nonSlpUtxos: unknown[] | [],
    slpUtxos: unknown[] | []
}

export type Balances = {
    totalBalance: number, 
    totalBalanceInSatoshis: number
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
    tokenId: string;
    amountSent: number;
    amountReceived: number;
}