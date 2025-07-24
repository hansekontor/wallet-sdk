// @ts-ignore
import bcash from '@hansekontor/checkout-components';
const { Mnemonic, HDPrivateKey, KeyRing } = bcash;
import cashaddr from 'ecashaddrjs';
import { WalletState, type Wallet, type Path } from '../types';


export const generateMnemonic = () => {
    const bip39Mnemonic = new Mnemonic({
        language: 'english'
    });

    return bip39Mnemonic;
}

export const deriveAccount = (masterHDNode: any, path: string): Path => {
    const node = masterHDNode.derivePath(path);
    const publicKey = node.toPublic().publicKey.toString('hex');
    const keyring = KeyRing.fromPrivate(node.privateKey, null);
    const cashAddress = keyring.getAddress('string');
    const decodedAddress = cashaddr.decode(cashAddress);
    const slpAddress = cashaddr.encode(
        'etoken',
        decodedAddress.type,
        decodedAddress.hash
    );
    const fundingWif = keyring.toSecret();
    const legacyAddress = keyring.getAddress("base58");

    return {
        publicKey,
        cashAddress,
        slpAddress,
        fundingWif,
        legacyAddress,
    };
}

export const buildWallet = (mnemonic: any) => {
    const masterHDNode = HDPrivateKey.fromPhrase(mnemonic.getPhrase());

    // Derive account path Path1899 from the master HD node
    const path = "m/44'/1899'/0'/0/0";
    // todo: test if await is required
    const Path1899 = deriveAccount(masterHDNode, path);

    // Extract a name from the cash address if it exists or use the existing name
    const name = Path1899.cashAddress.slice(12, 17);

    return {
        mnemonic: mnemonic,
        name,
        Path1899,
        state: new WalletState(),
    };
}

export const verifyWallet = (mnemonic: object, wallets: Wallet[] | []) => {
    // todo: test if wallet is not already in saved wallets
    if (wallets) {
        const walletFound = wallets.find(wallet => {
            const isEqualMnemonic = wallet.mnemonic.toString() === mnemonic.toString();
            return isEqualMnemonic;
        });
        const isNewWallet = walletFound ? false : true;

        return isNewWallet;
    } else {
        return true;
    }
}
