// @ts-ignore
import bcash from '@hansekontor/checkout-components';
const { Mnemonic } = bcash;

export const validateMnemonic = (mnemonic: string) => {
    let testOutput;
    try {
        testOutput = Mnemonic.fromPhrase(mnemonic);
        const isEqualMnemonic = testOutput.toString() === mnemonic;
        if (isEqualMnemonic) {
            return true;
        } else {
            return false;
        }
    } catch(err) {
        console.error(err);
        return false;
    }
}