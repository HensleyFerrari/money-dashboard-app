import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CategoryModel from "@/models/Category";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// GET: Lista todas as categorias do usuário
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectToDatabase();
  const categories = await CategoryModel.find({ userId: session.user.id });
  return NextResponse.json(categories);
}

// POST: Cria uma nova categoria personalizada
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectToDatabase();
  const data = await req.json();
  const category = await CategoryModel.create({
    ...data,
    userId: session.user.id,
  });
  return NextResponse.json(category, { status: 201 });
}

// PATCH e DELETE podem ser implementados para edição/remoção de categorias
