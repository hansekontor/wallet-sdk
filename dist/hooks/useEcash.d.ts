import { Wallet } from '../context/Wallet/types';
export declare const useEcash: () => {
    getPostage: () => Promise<any>;
    getTokenPostage: (tokenId: string) => Promise<{
        address: any;
        weight: any;
        stamp: any;
    } | null | undefined>;
    getMaxPostageAmount: (sandbox: boolean, wallet: Wallet, postageObj: any) => number;
    buildSendTx: (amount: number, wallet: Wallet, addresses: string[], tokenId: string, postageData: any, remainderAddress: string) => Promise<any>;
    broadcastTx: (hex: string) => Promise<any>;
    postPayment: any;
};
export default useEcash;
