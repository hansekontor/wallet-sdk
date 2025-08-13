import { ECASH } from "../assets/networks";
import { BUX, UNKNOWN } from "../assets/tokens";
import type { JSX } from "react";

export interface SupportedToken {
  tokenId: string;
  ticker: string;
  name: string;
  uri: string;
  hash: string;
  decimals: number;
  version: number;
  vaultScriptHash: string;
  hasBaton: boolean;
  network: string;
  tokenIcon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  networkIcon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

export const UNKNOWN_TOKEN: SupportedToken = {
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

// The object of all supported tokens, keyed by tokenId
export const SUPPORTED_TOKENS: Record<string, SupportedToken> = {
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
  },
};

// Array of all tokens
export const SUPPORTED_TOKENS_LIST: SupportedToken[] = Object.values(SUPPORTED_TOKENS);

// Map for quick lookup by tokenId
export const SUPPORTED_TOKENS_MAP: Map<string, SupportedToken> = new Map(
  Object.entries(SUPPORTED_TOKENS)
);