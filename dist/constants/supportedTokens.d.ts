import { JSX } from 'react';
/**
 * Represents a token supported by the application.
 */
export interface SupportedToken {
    /** Unique identifier for the token. */
    tokenId: string;
    /** Token ticker symbol (e.g., "MUSD"). */
    ticker: string;
    /** Full human-readable name of the token. */
    name: string;
    /** Token website or metadata URI. */
    uri: string;
    /** Optional hash of the token metadata. */
    hash: string;
    /** Number of decimal places the token supports. */
    decimals: number;
    /** Version of the token standard or contract. */
    version: number;
    /** Script hash used in vault or token logic. */
    vaultScriptHash: string;
    /** Whether the token has a baton (for minting). */
    hasBaton: boolean;
    /** Network identifier the token belongs to (e.g., "eCash"). */
    network: string;
    /** React component rendering the token's icon. */
    TokenIcon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    /** React component rendering the network's icon. */
    NetworkIcon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}
export declare const UNKNOWN_TOKEN: SupportedToken;
export declare const SUPPORTED_TOKENS: Record<string, SupportedToken>;
export declare const SUPPORTED_TOKENS_LIST: SupportedToken[];
export declare const SUPPORTED_TOKENS_MAP: Map<string, SupportedToken>;
