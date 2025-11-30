import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Fetch all invoices with patient information
    const result = await query(
      `SELECT
        i.id,
        i.invoice_number,
        i.patient_id,
        i.appointment_id,
        i.total_amount,
        i.status,
        i.created_at,
        i.due_date,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        p.phone_number as patient_phone,
        p.email as patient_email
      FROM invoices i
      JOIN patients p ON i.patient_id = p.user_id
      ORDER BY i.created_at DESC`
    );

    return NextResponse.json({ invoices: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
