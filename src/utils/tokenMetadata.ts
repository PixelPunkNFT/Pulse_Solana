import { 
  PublicKey, 
  SystemProgram, 
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  uri: string;
}

const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export function findMetadataPda(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return pda;
}

export function createMetadataInstruction(
  metadata: TokenMetadata,
  mint: PublicKey,
  payer: PublicKey
): TransactionInstruction {
  const metadataPDA = findMetadataPda(mint);

  // Create the data buffer for the instruction
  const buffer = Buffer.alloc(2000);
  let offset = 0;

  // Instruction discriminator for CreateMetadataAccountV3
  buffer.writeUInt8(33, offset); // CreateMetadataAccountV3 discriminator
  offset += 1;

  // Title length and data
  buffer.writeUInt32LE(metadata.name.length, offset);
  offset += 4;
  buffer.write(metadata.name, offset);
  offset += metadata.name.length;

  // Symbol length and data
  buffer.writeUInt32LE(metadata.symbol.length, offset);
  offset += 4;
  buffer.write(metadata.symbol, offset);
  offset += metadata.symbol.length;

  // URI length and data
  buffer.writeUInt32LE(metadata.uri.length, offset);
  offset += 4;
  buffer.write(metadata.uri, offset);
  offset += metadata.uri.length;

  // Seller fee basis points (0 for tokens)
  buffer.writeUInt16LE(0, offset);
  offset += 2;

  // Collection Parent
  buffer.writeUInt8(0, offset); // Option<Pubkey> None
  offset += 1;

  // Creators
  buffer.writeUInt8(0, offset); // Option<Vec<Creator>> None
  offset += 1;

  // Uses
  buffer.writeUInt8(0, offset); // Option<Uses> None
  offset += 1;

  // Collection Details
  buffer.writeUInt8(0, offset); // Option<Collection> None
  offset += 1;

  // Programmable Config
  buffer.writeUInt8(0, offset); // Option<ProgrammableConfig> None
  offset += 1;

  const dataBuffer = buffer.slice(0, offset);

  console.log('Creating metadata instruction:', {
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    mint: mint.toString(),
    pda: metadataPDA.toString(),
    bufferLength: dataBuffer.length
  });

  return new TransactionInstruction({
    keys: [
      {
        pubkey: metadataPDA,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: mint,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: payer,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: payer,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_METADATA_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      }
    ],
    programId: TOKEN_METADATA_PROGRAM_ID,
    data: dataBuffer,
  });
}
