import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectToDatabase();
  const data = await req.json();
  const cat = await Category.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    data,
    { new: true }
  );
  if (!cat)
    return NextResponse.json(
      { error: "Categoria não encontrada" },
      { status: 404 }
    );
  return NextResponse.json(cat);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectToDatabase();
  const cat = await Category.findOneAndDelete({
    _id: params.id,
    userId: session.user.id,
  });
  if (!cat)
    return NextResponse.json(
      { error: "Categoria não encontrada" },
      { status: 404 }
    );
  return NextResponse.json({ success: true });
}
