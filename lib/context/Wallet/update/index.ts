import BigNumber from 'bignumber.js';
import { type Slp, type Balances, Tokens } from '../types';

const indexerUrl = import.meta.env.VITE_INDEXER_URL;

export const getUtxos = async (address: string) => {
    const result = await fetch(`${indexerUrl}/coin/address/${address}?slp=true`);
    const utxos = await result.json();

    return utxos;
}

export const getBalances = (slp: Slp): Balances => {
    const totalBalanceInSatoshis = slp.nonSlpUtxos.reduce(
        (previousBalance: number, utxo: any) => previousBalance + utxo.value, 0
    );
    const totalBalance = fromSmallestDenomination(totalBalanceInSatoshis);

    const balances = {
        totalBalance,
        totalBalanceInSatoshis,
    };

    return balances;
}

export const getSlp = (utxos: any[]) => {
    const nonSlpUtxos = utxos.filter((utxo: any) => 
        !utxo.slp || (utxo.slp && utxo.slp.value == "0")
    );

    const slpUtxos = utxos.filter((utxo: any) => 
        utxo.slp && (utxo.slp.value != "0" || utxo.slp.type == "MINT")
    );

    const tokens = new Tokens();

    for (let i = 0; i < slpUtxos.length; i++) {
        const slpUtxo = slpUtxos[i];
        const tokenId = slpUtxo.slp.tokenId;
        const isProdMUSD = tokenId === tokens.prod.tokenId;
        const isSandboxMUSD = tokenId === tokens.sandbox.tokenId;
        const isMUSD = isProdMUSD || isSandboxMUSD;
        if (isMUSD) {
            const hasBaton = slpUtxo.slp.type === "BATON";

            if (!hasBaton) {
                if (isProdMUSD) {
                    const newBigNumberBalance = new BigNumber(tokens.prod.rawBalance).plus(slpUtxo.slp.value); 
                    tokens.prod.rawBalance = newBigNumberBalance.toNumber();                        
                } else {
                    const newBigNumberBalance = new BigNumber(tokens.sandbox.rawBalance).plus(slpUtxo.slp.value);
                    tokens.sandbox.rawBalance = newBigNumberBalance.toNumber();  
                }
            }
        } 
    }

    tokens.prod.balance = new BigNumber(tokens.prod.rawBalance).dividedBy(10**tokens.prod.info.decimals).toNumber();
    tokens.sandbox.balance = new BigNumber(tokens.sandbox.rawBalance).dividedBy(10**tokens.sandbox.info.decimals).toNumber();

    const slp = {
        tokens,
        nonSlpUtxos,
        slpUtxos,
    };

    return slp;
}

export const getTxHistory = async (address: string) => {
    const url = `${indexerUrl}/tx/address/${address}?slp=true`;
    const result = await fetch(url);
    const txHistory = await result.json();

    return txHistory;
}

export const parseTxHistory = (txHistory: any[]) => {
    const parsedTxHistory = txHistory;

    return parsedTxHistory;
}

const fromSmallestDenomination = (amount: number) => {
    // todo: move hardcoded decimals
    const cashDecimals = 2;
    const amountBig = new BigNumber(amount);
    const multiplier = new BigNumber(10 ** (-1 * cashDecimals));
    const amountInBaseUnits = amountBig.times(multiplier);
    return amountInBaseUnits.toNumber();
}