import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 });
    }

    if (!["patient", "doctor"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user exists
    const userCheck = await query(
      "SELECT id, role FROM users WHERE id = $1",
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userCheck.rows[0].role !== role) {
      return NextResponse.json({ error: "Role mismatch" }, { status: 400 });
    }

    // Prevent deleting admin users
    if (userCheck.rows[0].role === "admin") {
      return NextResponse.json({ error: "Cannot delete admin users" }, { status: 403 });
    }

    // Delete user profile (cascading will delete related records)
    if (role === "patient") {
      await query("DELETE FROM patients WHERE user_id = $1", [userId]);
    } else if (role === "doctor") {
      await query("DELETE FROM doctors WHERE user_id = $1", [userId]);
    }

    // Delete user account
    await query("DELETE FROM users WHERE id = $1", [userId]);

    return NextResponse.json(
      { message: `${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
