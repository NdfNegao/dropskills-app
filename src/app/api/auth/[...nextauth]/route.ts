import NextAuth from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';

// Export authOptions for use in other API routes
export { authOptions };

export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);



export async function GET(request: NextRequest, context: any) {
  return handler(request, context);
}

export async function POST(request: NextRequest, context: any) {
  return handler(request, context);
}