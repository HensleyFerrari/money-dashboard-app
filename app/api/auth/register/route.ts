import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Preencha todos os campos." },
      { status: 400 }
    );
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "E-mail já cadastrado." },
      { status: 409 }
    );
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = await User.create({ name, email, passwordHash });
  return NextResponse.json(
    { id: user._id, name: user.name, email: user.email },
    { status: 201 }
  );
}
