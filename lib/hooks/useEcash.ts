// @ts-ignore
import bcash from '@hansekontor/checkout-components';
const { Coin, MTX, Input, Script } = bcash;
import BigNumber from 'bignumber.js';
import cashaddr from 'ecashaddrjs';
// @ts-ignore
import { U64 } from 'n64';
// @ts-ignore
import { postPayment } from '../utils/b70'

import { type Wallet } from '../context/Wallet/types';

// todo: replace currency object
const currency = {
    etokenSats: 546,
    defaultFee: 1.01,
}

export const useEcash = () => {

    const buildSendTx = async (amount: number, wallet: Wallet, addresses: string[], tokenId: string, postageData: any, remainderAddress: string) => {        
        // prepare utxos
        const slp = wallet.state.slp;
        const nonSlpCoins = slp.nonSlpUtxos.map((utxo: any) => 
            Coin.fromJSON(utxo)
        );

        const tokenUtxos: any[] = slp.slpUtxos.filter(
            (utxo: any) => {
                if (
                    utxo && 
                    utxo.slp.tokenId === tokenId && 
                    utxo.slp.type !== "BATON"
                ) {
                    return true;
                }
            }
        );

        if (tokenUtxos.length === 0) {
            throw new Error("No MUSD could be found");
        }

        // prepare tokens
        const tokens = slp.tokens;
        let tokenEntry: any = {};
        switch(tokenId) {
            case (tokens.prod.tokenId):
                tokenEntry = tokens.prod;
                break;
            case (tokens.sandbox.tokenId):
                tokenEntry = tokens.sandbox;
                break;
        };

        if (!tokenEntry) {
            throw new Error("Unknown token");
        }
        const tokenInfo = tokenEntry.info;
        
        // construct transaction
        const tx = new MTX();

        let finalTokenAmountSent = new BigNumber(0);
        // todo? handle multiple token outputs?
        let postageAmount = new BigNumber(0);
        let tokenAmountBeingSentToAddress = new BigNumber(amount).times(10 ** tokenInfo.decimals);
        let totalTokenOutputAmount = tokenAmountBeingSentToAddress;

        const tokenCoins = [];
        for (let i = 0; i < tokenUtxos.length; i++) {
            // add utxo
            const tokenCoin = Coin.fromJSON(tokenUtxos[i]);
            tokenCoins.push(tokenCoin);

            // get token value of utxo
            const addedTokenValue = new BigNumber(tokenUtxos[i].slp.value);
            finalTokenAmountSent = finalTokenAmountSent.plus(addedTokenValue);

            // get required postage amount
            const utxoCount = tokenCoins.length;
            const postageBaseAmount = calculatePostage(utxoCount, 1, postageData);
            postageAmount = new BigNumber(postageBaseAmount);
            totalTokenOutputAmount = tokenAmountBeingSentToAddress.plus(postageAmount);

            // break condition
            const hasEnoughTokens = totalTokenOutputAmount.lte(finalTokenAmountSent);
            if (hasEnoughTokens) {
                break;
            }
        }

        const tokenAmountArray = [ tokenAmountBeingSentToAddress.toString() ];
        // add postage to outputs
        if (postageAmount.gt(0)) {
            tokenAmountArray.push(postageAmount.toString());
        }
        // add change to outputs
        const tokenChangeAmount = finalTokenAmountSent.minus(totalTokenOutputAmount);
        if (tokenChangeAmount.gt(0)) {
            tokenAmountArray.push(tokenChangeAmount.toString());
        }

        // add SEND OP_RETURN
        const sendOpReturn = buildSendOpReturn(tokenId, tokenAmountArray);
        tx.addOutput(sendOpReturn, 0);

        // send dust representing tokens being sent
        // todo: add optional multiple outputs
        const decodedTokenReceiverAddress = cashaddr.decode(addresses[0]);
        const cleanTokenReceiverAddress = cashaddr.encode(
            "ecash",
            decodedTokenReceiverAddress.type, 
            decodedTokenReceiverAddress.hash
        );

        // add destination output
        tx.addOutput(
            cleanTokenReceiverAddress, 
            currency.etokenSats
        );

        // add postage output
        if (postageAmount.gt(0)) {
            const decodedPostageAddress = cashaddr.decode(postageData.address);
            const cleanPostageAddress = cashaddr.encode(
                "ecash", 
                decodedPostageAddress.type, 
                decodedPostageAddress.hash
            );
            tx.addOutput(cleanPostageAddress, currency.etokenSats);
        }

        // send token change
        if (tokenChangeAmount.gt(0)) {
            tx.addOutput(remainderAddress, currency.etokenSats);
        }

        // add postage or gas input
        if (postageData) {
            for (let i = 0; i < tokenCoins.length; i++) {
                tx.addCoin(tokenCoins[i]);
            }
        } else {
            const fundingOptions = { 
                inputs: tokenCoins.map(coin => Input.fromCoin(coin).prevout),
                changeAddress: remainderAddress,
                rate: currency.defaultFee * 1000
            };
            await tx.fund([...tokenCoins, nonSlpCoins], fundingOptions);
        }

        return tx;
    }

    const broadcastTx = async (hex: string) => {
        const url = `${import.meta.env.VITE_INDEXER_URL}/broadcast`;
        const method = "POST";
        const body = JSON.stringify({ tx: hex});

        const result = await fetch(url, { method, body });
        const resultJson = await result.json();

        return resultJson;

    }

    const calculatePostage = (inputCount: number, tokenRecipientCount: number, postageObj: any) => {
        // add outputs stamp + change + tokenOutputs
        const sendAmountArray = ["1", "1"];
        for (let i = 0; i < tokenRecipientCount; i++) {
            sendAmountArray.push("1");
        }

        // build SEND OP_RETURN
        const sendOpReturn = buildSendOpReturn(
            Buffer.alloc(32).toString('hex'),
            sendAmountArray
        );

        // get byte count
        let byteCount = getByteCount(
            { P2PKH: inputCount },
            { P2PKH: sendAmountArray.length }
        );
        byteCount += 8 + 1 + sendOpReturn.length;
        byteCount += 546 * (sendAmountArray.length - inputCount);

        // get required stamps
        let stampsNeeded = Math.ceil(byteCount / postageObj.weight);
        if (stampsNeeded < 1) {
            stampsNeeded = 1;
        }

        // return final postage
        const postage = postageObj.stamp.rate * stampsNeeded;
        return postage;
    }

    const buildSendOpReturn = (tokenId: string, sendQuantityArray: any) => {
        const version = 2;
        const sendOpReturn = new Script()
                .pushSym('return')
                .pushData(Buffer.concat([
                    Buffer.from('SLP', 'ascii'),
                    Buffer.alloc(1)
                ]))
                .pushPush(Buffer.alloc(1, version))
                .pushData(Buffer.from('SEND', 'ascii'))
                .pushData(Buffer.from(tokenId, 'hex'))
                for (let i = 0; i < sendQuantityArray.length; i++) {
                    const sendQuantity = sendQuantityArray[i]
                    sendOpReturn.pushData(U64.fromString(sendQuantity).toBE(Buffer))
                }
        return sendOpReturn.compile();
    }

    const getByteCount = (inputs: any, outputs: any) => {
        // from https://github.com/bitcoinjs/bitcoinjs-lib/issues/921#issuecomment-354394004
        let totalWeight = 0
        let hasWitness = false
        // assumes compressed pubkeys in all cases.
        const inputTypes: { [key: string]: number } = {
            "MULTISIG-P2SH": 49 * 4,
            "MULTISIG-P2WSH": 6 + 41 * 4,
            "MULTISIG-P2SH-P2WSH": 6 + 76 * 4,
            P2PKH: 148 * 4,
            P2WPKH: 108 + 41 * 4,
            "P2SH-P2WPKH": 108 + 64 * 4            
        };
        const outputTypes: { [key: string]: number } = {
            P2SH: 32 * 4,
            P2PKH: 34 * 4,
            P2WPKH: 31 * 4,
            P2WSH: 43 * 4            
        };
        
        const types = {
            inputs: inputTypes,
            outputs: outputTypes
        };
    
        Object.keys(inputs).forEach(function(key) {
          if (key.slice(0, 8) === "MULTISIG") {
            // ex. "MULTISIG-P2SH:2-3" would mean 2 of 3 P2SH MULTISIG
            const keyParts = key.split(":")
            if (keyParts.length !== 2) throw new Error(`invalid input: ${key}`)
            const newKey = keyParts[0]
            const mAndN = keyParts[1].split("-").map(function(item) {
              return parseInt(item)
            })
    
            totalWeight += types.inputs[newKey] * inputs[key]
            const multiplyer = newKey === "MULTISIG-P2SH" ? 4 : 1
            totalWeight += (73 * mAndN[0] + 34 * mAndN[1]) * multiplyer
          } else {
            totalWeight += types.inputs[key] * inputs[key]
          }
          if (key.indexOf("W") >= 0) hasWitness = true
        })
    
        Object.keys(outputs).forEach(function(key) {
          totalWeight += types.outputs[key] * outputs[key]
        })
    
        if (hasWitness) totalWeight += 2
    
        totalWeight += 10 * 4
    
        return Math.ceil(totalWeight / 4)
    }

    const getPostage = async (tokenId: string) => {
        try {
            const postageUrl = import.meta.env.VITE_POSTAGE_URL;
            const result = await fetch(postageUrl);
            const postageObj = await result.json();
            const stamp = postageObj.stamps.find(
                (s: any) => s.tokenId === tokenId
            );
            if (stamp) {
                const postage = {
                    address: postageObj.address,
                    weight: postageObj.weight,
                    stamp
                };

                return postage;
            }
        } catch(err) {
            console.error(err);
        }
        
        return null;
    }

    return {
        getPostage,
        buildSendTx,
        broadcastTx,
        postPayment,
    };
}

export default useEcash;