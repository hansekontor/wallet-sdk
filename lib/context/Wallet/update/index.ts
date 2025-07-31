import BigNumber from 'bignumber.js';
import { type Slp, type Balances, type ParsedTx, Tokens } from '../types';

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

export const parseTxHistory = (txHistory: any[], address: string) => {
    const parsedTxHistory = [];
    const tokens = new Tokens();

    for (let i = 0; i < txHistory.length; i++) {
        const tx = txHistory[i];

        // skip tx if no relevant token was used
        const relevantTokenIds = [tokens.prod.tokenId, tokens.sandbox.tokenId];
        const hasRelevantToken = relevantTokenIds.includes(tx.slpToken?.tokenId);
        if (!hasRelevantToken) {
            continue;
        }

        const parsedTx = parseTx(tx, address);
        parsedTxHistory.push(parsedTx);
    }

    return parsedTxHistory;
}

const parseTx = (tx: any, address: string) => {
    const parsedTx = {} as ParsedTx;

    parsedTx.txid = tx.hash;
    parsedTx.height = tx.height;

    parsedTx.blocktime = tx.time;
    parsedTx.confirmations = tx.confirmations;

    const tokens = new Tokens();
    const isSandbox = tx.slpToken.tokenId === tokens.sandbox.tokenId;
    parsedTx.sandbox = isSandbox;

    parsedTx.amountSent = 0; 
    parsedTx.amountReceived = 0;

    parsedTx.sender = tx.inputs[0].coin.address;

    // check if tx is outgoing
    let outgoing = false;
    for (const input of tx.inputs) {
        const isOwnAddress = address === input.coin.address;
        if (isOwnAddress) {
            outgoing = true;
            break;
        }
    }
    parsedTx.outgoing = outgoing;
 
    // get SLP tx type
    const firstSlpOutput = tx.outputs.find((output: any) => output.slp);
    const type = firstSlpOutput.slp.type;
    parsedTx.type = type;

    // collect all recipients
    const recipients = [];
    for (const output of tx.outputs) {
        if (output.slp) {
            recipients.push(output.address);
        }
    }
    parsedTx.recipients = recipients;

    const totalSent = tx.inputs.filter((input: any) => 
            input.coin.slp &&
            address === input.coin.address &&
            type != "MINT"
        )
        .reduce((previous: any, current: any) => previous.plus(current.coin.slp.value), new BigNumber(0));

    const totalReceived = tx.outputs.filter((output: any) =>
            output.slp &&
            address === output.address &&
            output.slp.type != "BATON"
        )
        .reduce((previous: any, current: any) => previous.plus(current.slp.value), new BigNumber(0));

    const divisor = 10 ** parseInt(tx.slpToken.decimals);

    if (totalSent.gte(totalReceived)) {
        const rawDelta = totalSent.minus(totalReceived);
        const delta = rawDelta.div(divisor);
        parsedTx.amountSent = delta.toNumber();
    } else {
        const rawDelta = totalReceived.minus(totalSent);
        const delta = rawDelta.div(divisor);
        parsedTx.amountReceived = delta.toNumber();
    }

    return parsedTx;
}

const fromSmallestDenomination = (amount: number) => {
    // todo: move hardcoded decimals
    const cashDecimals = 2;
    const amountBig = new BigNumber(amount);
    const multiplier = new BigNumber(10 ** (-1 * cashDecimals));
    const amountInBaseUnits = amountBig.times(multiplier);
    return amountInBaseUnits.toNumber();
}