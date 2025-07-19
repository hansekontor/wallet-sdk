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

export type WalletState = {
    balances: Balances,
    tokenBalance: number,
    utxos: object[] | [],
    tokens: object[] | [],
    slpBalancesAndUtxos: SlpBalancesAndUtxos | {},
    parsedTxHistory: object[] | [],
}

type SlpBalancesAndUtxos = {
    tokens: object[] | [],
    nonSlpUtxos: object[] | [],
    slpUtxos: object[] | []
}

type Balances = {
    totalBalance: number, 
    totalBalanceInSatoshis: number
}