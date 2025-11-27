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
        return NextResponse.json({ records: [] });
      }

      result = await query(`
        SELECT
          mr.*,
          d.first_name || ' ' || d.last_name as doctor_name
        FROM medical_records mr
        LEFT JOIN doctors d ON mr.doctor_id = d.id
        WHERE mr.patient_id = $1
        ORDER BY mr.visit_date DESC
      `, [patientResult.rows[0].id]);
    } else if (user.role === 'doctor') {
      const doctorResult = await query(
        'SELECT id FROM doctors WHERE user_id = $1',
        [user.userId]
      );

      if (doctorResult.rows.length === 0) {
        return NextResponse.json({ records: [] });
      }

      result = await query(`
        SELECT
          mr.*,
          p.first_name || ' ' || p.last_name as patient_name
        FROM medical_records mr
        JOIN patients p ON mr.patient_id = p.id
        WHERE mr.doctor_id = $1
        ORDER BY mr.visit_date DESC
      `, [doctorResult.rows[0].id]);
    } else {
      result = await query(`
        SELECT
          mr.*,
          p.first_name || ' ' || p.last_name as patient_name,
          d.first_name || ' ' || d.last_name as doctor_name
        FROM medical_records mr
        JOIN patients p ON mr.patient_id = p.id
        LEFT JOIN doctors d ON mr.doctor_id = d.id
        ORDER BY mr.visit_date DESC
      `);
    }

    return NextResponse.json({ records: result.rows });
  } catch (error) {
    console.error('Get medical records error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { patientId, appointmentId, diagnosis, prescription, symptoms, notes } = body;

    const doctorResult = await query(
      'SELECT id FROM doctors WHERE user_id = $1',
      [user.userId]
    );

    if (doctorResult.rows.length === 0) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
    }

    const result = await query(
      `INSERT INTO medical_records (patient_id, doctor_id, appointment_id, diagnosis, prescription, symptoms, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [patientId, doctorResult.rows[0].id, appointmentId, diagnosis, prescription, symptoms, notes]
    );

    return NextResponse.json({
      message: 'Medical record created successfully',
      record: result.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Create medical record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
