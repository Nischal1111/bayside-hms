import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      'SELECT id, name, description FROM specializations ORDER BY name'
    );

    return NextResponse.json({
      specializations: result.rows,
    });
  } catch (error) {
    console.error('Get specializations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
