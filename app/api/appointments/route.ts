import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
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
      // Get patient's appointments
      const patientResult = await query(
        'SELECT id FROM patients WHERE user_id = $1',
        [user.userId]
      );

      if (patientResult.rows.length === 0) {
        return NextResponse.json({ appointments: [] });
      }

      result = await query(`
        SELECT
          a.*,
          CONCAT(d.first_name, ' ', d.last_name) as doctor_name,
          s.name as specialization
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN specializations s ON d.specialization_id = s.id
        WHERE a.patient_id = $1
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `, [patientResult.rows[0].id]);
    } else if (user.role === 'doctor') {
      // Get doctor's appointments
      const doctorResult = await query(
        'SELECT id FROM doctors WHERE user_id = $1',
        [user.userId]
      );

      if (doctorResult.rows.length === 0) {
        return NextResponse.json({ appointments: [] });
      }

      result = await query(`
        SELECT
          a.*,
          CONCAT(p.first_name, ' ', p.last_name) as patient_name,
          p.phone_number as patient_phone
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.doctor_id = $1
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `, [doctorResult.rows[0].id]);
    } else {
      // Admin gets all appointments
      result = await query(`
        SELECT
          a.*,
          CONCAT(p.first_name, ' ', p.last_name) as patient_name,
          CONCAT(d.first_name, ' ', d.last_name) as doctor_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `);
    }

    return NextResponse.json({ appointments: result.rows });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { doctorId, date, time, reason } = body;

    // Get patient ID
    const patientResult = await query(
      'SELECT id FROM patients WHERE user_id = $1',
      [user.userId]
    );

    if (patientResult.rows.length === 0) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    const patientId = patientResult.rows[0].id;

    // Check if slot is available
    const existingAppt = await query(
      'SELECT id FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3',
      [doctorId, date, time]
    );

    if (existingAppt.rows.length > 0) {
      return NextResponse.json({ error: 'This time slot is not available' }, { status: 409 });
    }

    // Create appointment
    const appointmentId = randomUUID();
    await query(
      `INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [appointmentId, patientId, doctorId, date, time, reason]
    );

    const result = await query(
      'SELECT * FROM appointments WHERE id = $1',
      [appointmentId]
    );

    return NextResponse.json({
      message: 'Appointment booked successfully',
      appointment: result.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
