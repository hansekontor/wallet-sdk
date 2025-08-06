import { Wallet } from '../context/Wallet/types';
export declare const useEcash: () => {
    getPostageObj: () => Promise<any>;
    getTokenPostage: (tokenId: string) => Promise<{
        address: any;
        weight: any;
        stamp: any;
    } | null | undefined>;
    calculatePostage: (inputCount: number, tokenRecipientCount: number, postageData: any) => number;
    getPostageAmount: (tokenId: string, wallet: Wallet, postageObj: any, amount?: number) => number;
    buildSendTx: (amount: number, wallet: Wallet, addresses: string[], tokenId: string, postageData: any, remainderAddress: string) => Promise<any>;
    broadcastTx: (hex: string) => Promise<any>;
    postPayment: any;
};
export default useEcash;
