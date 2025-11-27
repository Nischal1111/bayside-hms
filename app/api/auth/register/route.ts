import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      dateOfBirth,
      specialization,
      licenseNumber,
    } = body;

    // Validate required fields
    if (!email || !password || !role || !firstName || !lastName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['patient', 'doctor', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userResult = await query(
      'INSERT INTO users (email, password_hash, role, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, passwordHash, role, role === 'doctor' ? 'pending' : 'active']
    );

    const userId = userResult.rows[0].id;

    // Create role-specific profile
    if (role === 'patient') {
      await query(
        `INSERT INTO patients (user_id, first_name, last_name, phone_number, address, gender, date_of_birth)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, firstName, lastName, phoneNumber, address, gender, dateOfBirth]
      );
    } else if (role === 'doctor') {
      await query(
        `INSERT INTO doctors (user_id, first_name, last_name, phone_number, specialization_id, license_number)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, firstName, lastName, phoneNumber, specialization || null, licenseNumber]
      );
    } else if (role === 'admin') {
      await query(
        `INSERT INTO admins (user_id, first_name, last_name, phone_number)
         VALUES ($1, $2, $3, $4)`,
        [userId, firstName, lastName, phoneNumber]
      );
    }

    // Generate token
    const token = await generateToken({
      userId,
      email,
      role: role as any,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      message: role === 'doctor' ? 'Registration successful. Awaiting admin approval.' : 'Registration successful',
      user: {
        id: userId,
        email,
        role,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
