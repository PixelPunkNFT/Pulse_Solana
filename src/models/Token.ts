import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  mintAddress: string;
  name: string;
  symbol: string;
  createdAt: number;
  createdBy: string;
}

const TokenSchema = new Schema({
  mintAddress: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  createdBy: {
    type: String,
    required: true,
  }
});

// Verifica se il modello esiste già per evitare errori di ricompilazione
const TokenModel = mongoose.models.Token || mongoose.model<IToken>('Token', TokenSchema);

export default TokenModel;
