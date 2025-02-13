import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ottieni l'header Origin dalla richiesta
  const origin = request.headers.get('origin') || '';

  // Crea la risposta
  const response = NextResponse.next();

  // Aggiungi gli headers CORS
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  console.log(`API Request: ${request.method} ${request.url}`);

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
