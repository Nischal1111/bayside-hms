import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { doctorId, rating, comment } = body;

    const patientResult = await query(
      'SELECT id FROM patients WHERE user_id = $1',
      [user.userId]
    );

    if (patientResult.rows.length === 0) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    await query(
      'INSERT INTO feedback (patient_id, doctor_id, rating, comment) VALUES ($1, $2, $3, $4)',
      [patientResult.rows[0].id, doctorId, rating, comment]
    );

    return NextResponse.json({ message: 'Feedback submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Submit feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
