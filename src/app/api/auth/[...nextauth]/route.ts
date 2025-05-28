import NextAuth from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export async function GET(request: NextRequest, context: any) {
  return handler(request, context);
}

export async function POST(request: NextRequest, context: any) {
  return handler(request, context);
} 