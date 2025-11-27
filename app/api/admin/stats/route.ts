import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patientsCount = await query('SELECT COUNT(*) as count FROM patients');
    const doctorsCount = await query('SELECT COUNT(*) as count FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.status = \'active\'');
    const appointmentsCount = await query('SELECT COUNT(*) as count FROM appointments');
    const pendingCount = await query('SELECT COUNT(*) as count FROM users WHERE status = \'pending\'');

    return NextResponse.json({
      stats: {
        totalPatients: parseInt(patientsCount.rows[0].count),
        totalDoctors: parseInt(doctorsCount.rows[0].count),
        totalAppointments: parseInt(appointmentsCount.rows[0].count),
        pendingApprovals: parseInt(pendingCount.rows[0].count),
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
