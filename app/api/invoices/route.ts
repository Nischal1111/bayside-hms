import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let result;

    if (user.role === 'patient') {
      const patientResult = await query(
        'SELECT id FROM patients WHERE user_id = $1',
        [user.userId]
      );

      if (patientResult.rows.length === 0) {
        return NextResponse.json({ invoices: [] });
      }

      result = await query(
        'SELECT * FROM invoices WHERE patient_id = $1 ORDER BY created_at DESC',
        [patientResult.rows[0].id]
      );
    } else {
      result = await query(`
        SELECT i.*, p.first_name || ' ' || p.last_name as patient_name
        FROM invoices i
        JOIN patients p ON i.patient_id = p.id
        ORDER BY i.created_at DESC
      `);
    }

    return NextResponse.json({ invoices: result.rows });
  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
