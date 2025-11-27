import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(`
      SELECT p.*, u.email
      FROM patients p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json({ patients: result.rows });
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
