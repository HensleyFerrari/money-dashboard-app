import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
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
  const tx = await Transaction.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    data,
    { new: true }
  );
  if (!tx)
    return NextResponse.json(
      { error: "Transação não encontrada" },
      { status: 404 }
    );
  return NextResponse.json(tx);
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
  const tx = await Transaction.findOneAndDelete({
    _id: params.id,
    userId: session.user.id,
  });
  if (!tx)
    return NextResponse.json(
      { error: "Transação não encontrada" },
      { status: 404 }
    );
  return NextResponse.json({ success: true });
}
