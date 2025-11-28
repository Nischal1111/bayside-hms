import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
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
    const { role } = body;

    if (!role || !["patient", "doctor"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (role === "patient") {
      return await addPatient(body);
    } else {
      return await addDoctor(body);
    }
  } catch (error: any) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add user" },
      { status: 500 }
    );
  }
}

async function addPatient(data: any) {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    emergencyContact,
  } = data;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phoneNumber ||
    !dateOfBirth ||
    !gender ||
    !bloodGroup ||
    !address ||
    !emergencyContact
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  // Validate password length
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existingUser = await query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const userResult = await query(
    "INSERT INTO users (email, password_hash, role, status) VALUES ($1, $2, $3, $4) RETURNING id",
    [email, passwordHash, "patient", "active"]
  );

  const userId = userResult.rows[0].id;

  // Create patient profile
  await query(
    `INSERT INTO patients
    (user_id, first_name, last_name, phone_number, date_of_birth, gender, blood_group, address, emergency_contact)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      userId,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
    ]
  );

  return NextResponse.json(
    { message: "Patient created successfully", userId },
    { status: 201 }
  );
}

async function addDoctor(data: any) {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    licenseNumber,
    specializationId,
  } = data;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phoneNumber ||
    !licenseNumber ||
    !specializationId
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  // Validate password length
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existingUser = await query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  // Check if license number already exists
  const existingLicense = await query(
    "SELECT id FROM doctors WHERE license_number = $1",
    [licenseNumber]
  );

  if (existingLicense.rows.length > 0) {
    return NextResponse.json(
      { error: "License number already registered" },
      { status: 409 }
    );
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user with active status (admin-created doctors are auto-approved)
  const userResult = await query(
    "INSERT INTO users (email, password_hash, role, status) VALUES ($1, $2, $3, $4) RETURNING id",
    [email, passwordHash, "doctor", "active"]
  );

  const userId = userResult.rows[0].id;

  // Create doctor profile
  await query(
    `INSERT INTO doctors
    (user_id, first_name, last_name, phone_number, license_number, specialization_id)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, firstName, lastName, phoneNumber, licenseNumber, specializationId]
  );

  return NextResponse.json(
    { message: "Doctor created successfully and activated", userId },
    { status: 201 }
  );
}
