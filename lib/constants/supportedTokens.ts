import { ECASH } from "../assets/networks";
import { BUX, UNKNOWN } from "../assets/tokens";

export const UNKNOWN_TOKEN = {
    tokenId: "",
    ticker: "UNKNOWN",
    name: "Unknown Token",
    uri: "",
    hash: "",
    decimals: 0,
    version: 0,
    vaultScriptHash: "",
    hasBaton: false,
    network: "UNKNOWN",
    tokenIcon: UNKNOWN,
    networkIcon: UNKNOWN,
};

export const SUPPORTED_TOKENS = {
    "52b12c03466936e7e3b2dcfcff847338c53c611ba8ab74dd8e4dadf7ded12cf6": {
        tokenId: "52b12c03466936e7e3b2dcfcff847338c53c611ba8ab74dd8e4dadf7ded12cf6",
        ticker: "BUX",
        name: "Badger Universal Token",
        uri: "https://bux.digital",
        hash: "",
        decimals: 4,
        version: 2,
        vaultScriptHash: "08d6edf91c7b93d18306d3b8244587e43f11df4b",
        hasBaton: false,
        network: "eCash",
        tokenIcon: BUX,
        networkIcon: ECASH,
    },
    "4075459e0ac841f234bc73fc4fe46fe5490be4ed98bc8ca3f9b898443a5a381a": {
        tokenId: "4075459e0ac841f234bc73fc4fe46fe5490be4ed98bc8ca3f9b898443a5a381a",
        ticker: "BUXs",
        name: "BUX (Sandbox)",
        uri: "",
        hash: "",
        decimals: 4,
        version: 2,
        vaultScriptHash: "16748bbeb9fa3f2bdeb0fc5f7e23dd9ad166ace6",
        hasBaton: false,
        network: "eCash",
        tokenIcon: BUX,
        networkIcon: ECASH,
    }
}

export const SUPPORTED_TOKENS_LIST = Object.values(SUPPORTED_TOKENS);

export const SUPPORTED_TOKENS_MAP = new Map(
    Object.entries(SUPPORTED_TOKENS)
);