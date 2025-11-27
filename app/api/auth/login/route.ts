import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const result = await query(
      'SELECT id, email, password_hash, role, status FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is not active. Please contact administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
