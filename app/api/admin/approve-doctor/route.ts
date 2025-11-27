import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId } = body;

    await query(
      'UPDATE users SET status = $1 WHERE id = $2',
      ['active', userId]
    );

    return NextResponse.json({ message: 'Doctor approved successfully' });
  } catch (error) {
    console.error('Approve doctor error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
