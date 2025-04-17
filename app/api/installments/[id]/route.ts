import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Installment from "@/models/Installment";
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
  const inst = await Installment.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    data,
    { new: true }
  );
  if (!inst)
    return NextResponse.json(
      { error: "Parcelamento não encontrado" },
      { status: 404 }
    );
  return NextResponse.json(inst);
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
  const inst = await Installment.findOneAndDelete({
    _id: params.id,
    userId: session.user.id,
  });
  if (!inst)
    return NextResponse.json(
      { error: "Parcelamento não encontrado" },
      { status: 404 }
    );
  return NextResponse.json({ success: true });
}
