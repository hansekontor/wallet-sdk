import {
  SUPPORTED_TOKENS_MAP,
  UNKNOWN_TOKEN,
  type SupportedToken,
} from "../constants/supportedTokens";

/**
 * Safely retrieves a token object by its token ID.
 *
 * Looks up the given `tokenId` in `SUPPORTED_TOKENS_MAP`.
 * If the token is not found, returns the `UNKNOWN_TOKEN` object as a fallback.
 *
 * @param tokenId - The unique token ID to look up.
 * @returns The `SupportedToken` object corresponding to the ID, or `UNKNOWN_TOKEN` if not found.
 *
 * @example
 * const token = getToken("52b12c03466936e7e3b2dcfcff847338c53c611ba8ab74dd8e4dadf7ded12cf6");
 * console.log(token.ticker); // "BUX"
 *
 * const unknown = getToken("nonexistent-id");
 * console.log(unknown.name); // "Unknown Token"
 */
export function getToken(tokenId: string): SupportedToken {
  return SUPPORTED_TOKENS_MAP.get(tokenId) || UNKNOWN_TOKEN;
}
