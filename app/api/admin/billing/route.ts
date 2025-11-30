import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const queue = await query(`
      SELECT
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.reason_for_visit,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(d.first_name, ' ', d.last_name) as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN invoices i ON i.appointment_id = a.id
      WHERE a.status = 'completed' AND i.id IS NULL
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `);

    return NextResponse.json({ queue: queue.rows });
  } catch (error) {
    console.error('Billing queue error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      appointmentId,
      totalAmount,
      paidAmount = 0,
      discountAmount = 0,
      taxAmount = 0,
      dueDate,
      items,
    } = body;

    if (!appointmentId || typeof totalAmount !== 'number' || Number.isNaN(totalAmount)) {
      return NextResponse.json({ error: 'Invalid billing payload' }, { status: 400 });
    }

    const appointmentResult = await query(
      `SELECT id, patient_id, status FROM appointments WHERE id = $1`,
      [appointmentId]
    );

    if (appointmentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (appointmentResult.rows[0].status !== 'completed') {
      return NextResponse.json({ error: 'Appointment is not completed yet' }, { status: 400 });
    }

    const existingInvoice = await query(
      'SELECT id FROM invoices WHERE appointment_id = $1',
      [appointmentId]
    );

    if (existingInvoice.rows.length > 0) {
      return NextResponse.json({ error: 'Invoice already exists for this appointment' }, { status: 400 });
    }

    const invoiceId = randomUUID();
    const invoiceNumber = `INV-${Date.now()}`;
    const computedStatus = paidAmount >= totalAmount ? 'paid' : 'pending';

    await query(
      `INSERT INTO invoices (id, patient_id, appointment_id, invoice_number, total_amount, paid_amount, discount_amount, tax_amount, status, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        invoiceId,
        appointmentResult.rows[0].patient_id,
        appointmentId,
        invoiceNumber,
        totalAmount,
        paidAmount,
        discountAmount,
        taxAmount,
        computedStatus,
        dueDate || null,
      ]
    );

    if (Array.isArray(items)) {
      for (const rawItem of items) {
        if (!rawItem || !rawItem.description) {
          continue;
        }
        const unitPrice = typeof rawItem.unitPrice === 'number' ? rawItem.unitPrice : 0;
        if (Number.isNaN(unitPrice) || unitPrice <= 0) {
          continue;
        }
        const quantity = rawItem.quantity && rawItem.quantity > 0 ? rawItem.quantity : 1;
        const itemId = randomUUID();
        await query(
          `INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            itemId,
            invoiceId,
            rawItem.description,
            quantity,
            unitPrice,
            quantity * unitPrice,
          ]
        );
      }
    }

    const createdInvoice = await query(
      `SELECT i.*, CONCAT(p.first_name, ' ', p.last_name) as patient_name
       FROM invoices i
       JOIN patients p ON i.patient_id = p.id
       WHERE i.id = $1`,
      [invoiceId]
    );

    return NextResponse.json({
      message: 'Invoice created successfully',
      invoice: createdInvoice.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


