import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { 
  createBurnCheckedInstruction, 
  createSetAuthorityInstruction, 
  createFreezeAccountInstruction, 
  createThawAccountInstruction, 
  getAccount, 
  getMint, 
  TOKEN_PROGRAM_ID, 
  AuthorityType,
  getAssociatedTokenAddress
} from '@solana/spl-token';
import { TokenData } from '../types/token';
import { getCreatedTokens } from './tokenStorage';

interface PinataPin {
  metadata: {
    name: string;
  };
  ipfs_pin_hash: string;
}

async function getPinataMetadata(name: string): Promise<Record<string, unknown> | null> {
  try {
    // Costruisci il nome del file metadata come fatto in uploadMetadataJson
    const metadataName = `${name.toLowerCase()}-metadata.json`;
    
    // Query Pinata per ottenere il metadata
    const response = await fetch('https://api.pinata.cloud/data/pinList', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Pinata');
    }

    const data = await response.json();
    
    // Cerca il file metadata.json corrispondente
    const metadataPin = data.rows.find((pin: PinataPin) => 
      pin.metadata.name === metadataName
    );

    if (!metadataPin) {
      console.log('Metadata not found on Pinata:', metadataName);
      return null;
    }

    // Recupera il contenuto del metadata.json
    const metadataUrl = `https://harlequin-informal-hawk-522.mypinata.cloud/ipfs/${metadataPin.ipfs_pin_hash}`;
    const metadataResponse = await fetch(metadataUrl);
    
    if (!metadataResponse.ok) {
      throw new Error('Failed to fetch metadata content');
    }

    const metadata = await metadataResponse.json();
    console.log('Found metadata on Pinata:', metadata);
    return metadata;

  } catch (error) {
    console.error('Error fetching from Pinata:', error);
    return null;
  }
}

export async function burnToken(
  connection: Connection,
  mintAddress: string,
  ownerPublicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<string> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    
    // Get associated token account
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPubkey,
      ownerPublicKey
    );

    // Get token account info to get the current balance
    const tokenAccount = await getAccount(connection, associatedTokenAddress);
    const mintInfo = await getMint(connection, mintPubkey);
    
    // Create burn transaction
    const transaction = new Transaction().add(
      createBurnCheckedInstruction(
        associatedTokenAddress,
        mintPubkey,
        ownerPublicKey,
        BigInt(tokenAccount.amount.toString()), // Burn the entire balance
        mintInfo.decimals,
        []
      )
    );

    // Sign and send transaction
    transaction.feePayer = ownerPublicKey;
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    
    const signedTx = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    });

    return signature;
  } catch (error) {
    console.error('Error burning token:', error);
    throw error;
  }
}

export async function removeMintAuthority(
  connection: Connection,
  mintAddress: string,
  ownerPublicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<string> {
  try {
    const mintPubkey = new PublicKey(mintAddress);

    // Create transaction to set mint authority to null
    const transaction = new Transaction().add(
      createSetAuthorityInstruction(
        mintPubkey,
        ownerPublicKey,
        AuthorityType.MintTokens,
        null,
        []
      )
    );

    // Sign and send transaction
    transaction.feePayer = ownerPublicKey;
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    
    const signedTx = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    });

    return signature;
  } catch (error) {
    console.error('Error removing mint authority:', error);
    throw error;
  }
}

export async function toggleFreezeAccount(
  connection: Connection,
  mintAddress: string,
  accountToFreeze: string,
  ownerPublicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  freeze: boolean
): Promise<string> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    const accountPubkey = new PublicKey(accountToFreeze);

    // Get mint info to verify freeze authority
    const mintInfo = await getMint(connection, mintPubkey);
    if (!mintInfo.freezeAuthority || mintInfo.freezeAuthority.toString() !== ownerPublicKey.toString()) {
      throw new Error('You do not have freeze authority for this token');
    }

    // Create freeze/thaw transaction
    const transaction = new Transaction().add(
      freeze
        ? createFreezeAccountInstruction(
            accountPubkey,
            mintPubkey,
            ownerPublicKey,
            []
          )
        : createThawAccountInstruction(
            accountPubkey,
            mintPubkey,
            ownerPublicKey,
            []
          )
    );

    // Sign and send transaction
    transaction.feePayer = ownerPublicKey;
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    
    const signedTx = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    });

    return signature;
  } catch (error) {
    console.error('Error toggling freeze state:', error);
    throw error;
  }
}

export async function getTokenData(
  connection: Connection,
  mintAddress: string,
  ownerPublicKey: PublicKey
): Promise<TokenData | null> {
  try {
    console.log('Getting token data for:', mintAddress);
    const mintPubkey = new PublicKey(mintAddress);
    const mintInfo = await getMint(connection, mintPubkey);
    
    // Get associated token account to check balance
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPubkey,
      ownerPublicKey
    );
    
    try {
      const tokenAccount = await getAccount(connection, associatedTokenAddress);
      // Se il saldo è 0, restituisci null
      if (tokenAccount.amount === BigInt(0)) {
        return null;
      }

      // Get stored token info
      const createdTokens = await getCreatedTokens(ownerPublicKey.toString());
      const storedToken = createdTokens.find(token => token.mintAddress === mintAddress);

      let imageUrl = '';
      
      // Se abbiamo il nome del token, proviamo a recuperare il metadata da Pinata
      if (storedToken?.name) {
        const metadata = await getPinataMetadata(storedToken.name);
        if (metadata && 'image' in metadata && typeof metadata.image === 'string') {
          imageUrl = metadata.image;
          console.log('Found image URL in Pinata metadata:', imageUrl);
        }
      }
      
      return {
        mintAddress: mintAddress,
        name: storedToken?.name || `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
        symbol: storedToken?.symbol || 'TOKEN',
        imageUrl: imageUrl,
        supply: Number(mintInfo.supply),
        decimals: mintInfo.decimals,
        isFrozen: tokenAccount.isFrozen,
        hasAuthority: mintInfo.mintAuthority !== null,
      };
    } catch (error) {
      console.error('Error getting token account:', error);
      return null;
    }
  } catch (error) {
    console.error('Error getting token data:', error);
    return null;
  }
}

export async function getUserTokens(
  connection: Connection,
  ownerPublicKey: PublicKey
): Promise<TokenData[]> {
  try {
    // Get list of created tokens
    console.log('Getting created tokens for wallet:', ownerPublicKey.toString());
    const createdTokens = await getCreatedTokens(ownerPublicKey.toString());
    console.log('Received created tokens:', createdTokens);
    
    if (!Array.isArray(createdTokens)) {
      console.error('createdTokens is not an array:', createdTokens);
      return [];
    }
    
    const createdTokenAddresses = new Set(createdTokens.map(token => token.mintAddress));
    console.log('Created token addresses:', Array.from(createdTokenAddresses));

    console.log('Fetching token accounts from Solana...');
    const response = await connection.getParsedTokenAccountsByOwner(
      ownerPublicKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    console.log('Received token accounts:', response.value.length);

    console.log('Filtering and mapping token accounts...');
    const tokens = response.value
      .filter(accountInfo => 
        // Filtra solo i token con saldo maggiore di 0 e che sono stati creati da questa app
        accountInfo.account.data.parsed.info.tokenAmount.uiAmount > 0 &&
        createdTokenAddresses.has(accountInfo.account.data.parsed.info.mint)
      )
      .map(accountInfo => ({
        mintAddress: accountInfo.account.data.parsed.info.mint,
        amount: accountInfo.account.data.parsed.info.tokenAmount.uiAmount,
        decimals: accountInfo.account.data.parsed.info.tokenAmount.decimals,
      }));

    // Get additional data for each token
    const tokenDataPromises = tokens.map(token => 
      getTokenData(connection, token.mintAddress, ownerPublicKey)
    );
    const tokenData = await Promise.all(tokenDataPromises);

    // Filtra eventuali token null (burnati o non esistenti)
    return tokenData.filter((token): token is TokenData => token !== null);
  } catch (error) {
    console.error('Error getting user tokens:', error);
    throw error;
  }
}
