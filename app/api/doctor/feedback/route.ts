import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctorResult = await query(
      'SELECT id FROM doctors WHERE user_id = $1',
      [user.userId]
    );

    if (doctorResult.rows.length === 0) {
      return NextResponse.json({ feedback: [] });
    }

    const result = await query(`
      SELECT f.*, CONCAT(p.first_name, ' ', p.last_name) as patient_name
      FROM feedback f
      JOIN patients p ON f.patient_id = p.id
      WHERE f.doctor_id = $1
      ORDER BY f.created_at DESC
    `, [doctorResult.rows[0].id]);

    return NextResponse.json({ feedback: result.rows });
  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
