import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let result;
    if (status === 'pending') {
      result = await query(`
        SELECT d.*, u.email, u.status as user_status, s.name as specialization_name
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        LEFT JOIN specializations s ON d.specialization_id = s.id
        WHERE u.status = 'pending'
        ORDER BY d.created_at DESC
      `);
    } else {
      result = await query(`
        SELECT d.*, u.email, s.name as specialization_name
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        LEFT JOIN specializations s ON d.specialization_id = s.id
        WHERE u.status = 'active'
        ORDER BY d.created_at DESC
      `);
    }

    return NextResponse.json({ doctors: result.rows });
  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
