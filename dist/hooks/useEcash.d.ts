import { Wallet } from '../context/Wallet/types';
export declare const useEcash: () => {
    getPostage: (tokenId: string) => Promise<{
        address: any;
        weight: any;
        stamp: any;
    } | null>;
    buildSendTx: (amount: number, wallet: Wallet, addresses: string[], tokenId: string, postageData: any, remainderAddress: string) => Promise<any>;
    broadcastTx: (hex: string) => Promise<any>;
    postPayment: any;
};
export default useEcash;
