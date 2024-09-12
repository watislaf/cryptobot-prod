import type { NextMiddleware } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';
import { FRONTEND_URL, generateRandomString } from '@arbitrage/env';

const secretToken = generateRandomString(20);
console.log(
  'Your secret page address is :',
  FRONTEND_URL + `/login?token=${secretToken}`
);
export const middleware: NextMiddleware = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  const token = url.searchParams.get('token');

  if (token !== secretToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ], // Match all routes except `/login`
};
