import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  createInitializeMintInstruction, 
  MINT_SIZE, 
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction, 
  createMintToInstruction 
} from '@solana/spl-token';
import { createMetadataInstruction, TokenMetadata } from './tokenMetadata';
import { saveCreatedToken } from './tokenStorage';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 secondo

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkConnection(connection: Connection): Promise<boolean> {
  try {
    const version = await connection.getVersion();
    return true;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
}

export async function createToken(
  connection: Connection,
  payer: PublicKey,
  name: string,
  symbol: string,
  metadataUrl: string,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  totalSupply: number = 1000000000, // Default to 1 billion if not specified
  retryCount = 0
): Promise<{ mintAddress: string; signature: string }> {
  try {
    console.log('Starting token creation process...');
    
    // Verifica la connessione prima di procedere
    const isConnected = await checkConnection(connection);
    if (!isConnected) {
      throw new Error('Failed to connect to Solana network');
    }
    console.log('Network connection verified');

    // Crea la transazione per il pagamento
    const feeTransaction = new Transaction();
    const feeAmount = Number(process.env.NEXT_PUBLIC_TOKEN_CREATE_FEE) * LAMPORTS_PER_SOL;
    const feeReceiverWallet = new PublicKey(process.env.NEXT_PUBLIC_FEE_RECEIVER_WALLET!);

    // Aggiungi l'istruzione di trasferimento SOL
    feeTransaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: feeReceiverWallet,
        lamports: feeAmount,
      })
    );

    // Ottieni il blockhash per la transazione di pagamento
    const { blockhash: feeBlockhash, lastValidBlockHeight: feeLastValidBlockHeight } = 
      await connection.getLatestBlockhash('finalized');
    feeTransaction.recentBlockhash = feeBlockhash;
    feeTransaction.feePayer = payer;

    // Firma e invia la transazione di pagamento
    console.log('Getting fee transaction signed by wallet...');
    const signedFeeTransaction = await signTransaction(feeTransaction);
    
    console.log('Sending fee transaction...');
    const feeSignature = await connection.sendRawTransaction(signedFeeTransaction.serialize());
    
    console.log('Waiting for fee transaction confirmation...');
    const feeConfirmation = await connection.confirmTransaction({
      blockhash: feeBlockhash,
      lastValidBlockHeight: feeLastValidBlockHeight,
      signature: feeSignature
    }, 'confirmed');

    if (feeConfirmation.value.err) {
      throw new Error('Fee transaction failed');
    }

    // Procedi con la creazione del token
    const mintKeypair = Keypair.generate();
    console.log('Generated mint keypair:', mintKeypair.publicKey.toString());

    // Get rent exempt amount
    console.log('Calculating rent exempt amount...');
    const rentExemptLamports = await getMinimumBalanceForRentExemptMint(connection);
    console.log('Rent exempt amount:', rentExemptLamports);

    // Get associated token address
    console.log('Getting associated token address...');
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      payer
    );
    console.log('Associated token address:', associatedTokenAddress.toString());

    // Create transaction
    const transaction = new Transaction();

    // Add create account instruction
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports: rentExemptLamports,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    // Add initialize mint instruction
    transaction.add(
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9, // 9 decimals like SOL
        payer,
        payer,
      )
    );

    // Add create associated token account instruction
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer,
        associatedTokenAddress,
        payer,
        mintKeypair.publicKey
      )
    );

    // Add mint tokens instruction with custom total supply
    transaction.add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedTokenAddress,
        payer,
        totalSupply * (10 ** 9) // Convert to smallest units considering 9 decimals
      )
    );

    // Create metadata instruction
    const metadata: TokenMetadata = {
      name,
      symbol,
      description: `${name} token on Solana`,
      uri: metadataUrl
    };

    console.log('Adding metadata instruction...');
    const metadataInstruction = createMetadataInstruction(
      metadata,
      mintKeypair.publicKey,
      payer
    );

    // Add metadata instruction to transaction
    transaction.add(metadataInstruction);

    // Set recent blockhash and fee payer
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    // Partially sign with mint keypair
    transaction.partialSign(mintKeypair);

    try {
      console.log('Getting transaction signed by wallet...');
      const signedTransaction = await signTransaction(transaction);

      console.log('Sending transaction...');
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: true,
        preflightCommitment: 'processed',
        maxRetries: 3,
      });

      console.log('Waiting for transaction confirmation...');
      const confirmation = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }

      // Save created token to localStorage
      saveCreatedToken({
        mintAddress: mintKeypair.publicKey.toString(),
        name,
        symbol,
        createdAt: Date.now()
      });

      console.log('Token created successfully:', {
        mintAddress: mintKeypair.publicKey.toString(),
        signature,
        metadata: {
          name,
          symbol,
          uri: metadataUrl
        }
      });

      return {
        mintAddress: mintKeypair.publicKey.toString(),
        signature,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('User rejected')) {
        throw new Error('Transazione rifiutata dall\'utente. Per favore approva la transazione nel wallet.');
      }
      throw error;
    }
  } catch (err) {
    console.error('Error in createToken:', err);

    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      await delay(RETRY_DELAY);
      return createToken(connection, payer, name, symbol, metadataUrl, signTransaction, totalSupply, retryCount + 1);
    }

    // Se l'errore persiste dopo tutti i tentativi, lo rilanciamo
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    throw new Error(`Failed to create token after ${MAX_RETRIES} attempts: ${errorMessage}`);
  }
}
