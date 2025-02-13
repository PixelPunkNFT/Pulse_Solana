export interface StoredToken {
  mintAddress: string;
  name: string;
  symbol: string;
  createdAt: number;
  createdBy: string;
}

export async function saveCreatedToken(token: Omit<StoredToken, 'createdAt'>): Promise<void> {
  try {
    console.log('Attempting to save token:', token);
    console.log('Making POST request to /api/tokens');
    const response = await fetch('/api/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.error || `Failed to save token: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Token saved successfully:', result);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
}

export async function getCreatedTokens(walletAddress: string): Promise<StoredToken[]> {
  try {
    const response = await fetch(`/api/tokens?wallet=${walletAddress}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tokens');
    }
    const data = await response.json();
    // Assicuriamoci che data sia un array
    if (!Array.isArray(data)) {
      console.error('Received non-array data from API:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
}

export async function isCreatedToken(mintAddress: string, walletAddress: string): Promise<boolean> {
  try {
    const tokens = await getCreatedTokens(walletAddress);
    return tokens.some(token => token.mintAddress === mintAddress);
  } catch (error) {
    console.error('Error checking token:', error);
    return false;
  }
}
