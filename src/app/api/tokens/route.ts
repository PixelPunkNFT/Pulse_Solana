import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Token from '../../../models/Token';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('wallet');

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  try {
    console.log('Connecting to database for GET request...');
    await dbConnect();
    console.log('Connected to database, fetching tokens...');
    console.log('Searching for tokens with createdBy:', walletAddress);
    const tokens = await Token.find({ createdBy: walletAddress }).lean();
    console.log('Raw tokens from database:', tokens);
    console.log('Tokens type:', typeof tokens);
    console.log('Is Array:', Array.isArray(tokens));
    
    // Assicuriamoci che tokens sia un array
    const safeTokens = Array.isArray(tokens) ? tokens : [];
    console.log('Safe tokens to return:', safeTokens);
    
    return NextResponse.json(safeTokens);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received POST request to /api/tokens');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { mintAddress, name, symbol, createdBy } = body;

    if (!mintAddress || !name || !symbol || !createdBy) {
      console.error('Missing required fields:', { mintAddress, name, symbol, createdBy });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log('Creating token in database...');
    const token = await Token.create({
      mintAddress,
      name,
      symbol,
      createdBy,
      createdAt: Date.now()
    });
    console.log('Token created in database:', token);

    return NextResponse.json(token, { status: 201 });
  } catch (error) {
    console.error('Detailed error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (error instanceof Error && error.message.includes('E11000')) {
      return NextResponse.json(
        { error: 'Token with this mint address already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create token' },
      { status: 500 }
    );
  }
}
