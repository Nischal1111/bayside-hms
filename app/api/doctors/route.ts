import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT
        d.id, d.first_name, d.last_name, d.phone_number,
        d.consultation_fee, d.bio,
        s.name as specialization_name
      FROM doctors d
      LEFT JOIN specializations s ON d.specialization_id = s.id
      JOIN users u ON d.user_id = u.id
      WHERE u.status = 'active'
      ORDER BY d.first_name, d.last_name
    `);

    return NextResponse.json({
      doctors: result.rows,
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
