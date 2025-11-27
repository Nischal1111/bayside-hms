import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get additional user info based on role
    let profile = null;

    if (user.role === 'patient') {
      const result = await query(
        'SELECT * FROM patients WHERE user_id = $1',
        [user.userId]
      );
      profile = result.rows[0];
    } else if (user.role === 'doctor') {
      const result = await query(
        `SELECT d.*, s.name as specialization_name
         FROM doctors d
         LEFT JOIN specializations s ON d.specialization_id = s.id
         WHERE d.user_id = $1`,
        [user.userId]
      );
      profile = result.rows[0];
    } else if (user.role === 'admin') {
      const result = await query(
        'SELECT * FROM admins WHERE user_id = $1',
        [user.userId]
      );
      profile = result.rows[0];
    }

    return NextResponse.json({
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
        profile,
      },
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
