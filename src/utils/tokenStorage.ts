const CREATED_TOKENS_KEY = 'created_tokens';

export interface StoredToken {
  mintAddress: string;
  name: string;
  symbol: string;
  createdAt: number;
}

export function saveCreatedToken(token: StoredToken): void {
  try {
    const existingTokens = getCreatedTokens();
    existingTokens.push(token);
    localStorage.setItem(CREATED_TOKENS_KEY, JSON.stringify(existingTokens));
  } catch (error) {
    console.error('Error saving token to localStorage:', error);
  }
}

export function getCreatedTokens(): StoredToken[] {
  try {
    const tokens = localStorage.getItem(CREATED_TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : [];
  } catch (error) {
    console.error('Error reading tokens from localStorage:', error);
    return [];
  }
}

export function isCreatedToken(mintAddress: string): boolean {
  try {
    const tokens = getCreatedTokens();
    return tokens.some(token => token.mintAddress === mintAddress);
  } catch (error) {
    console.error('Error checking token in localStorage:', error);
    return false;
  }
}
