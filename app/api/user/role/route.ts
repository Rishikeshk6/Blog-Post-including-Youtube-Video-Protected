import { NextResponse } from 'next/server';
import { checkIsAdmin } from '@/lib/adminAuth';

export async function GET() {
  const { isAdmin, email } = await checkIsAdmin();
  return NextResponse.json({ isAdmin, email });
}
