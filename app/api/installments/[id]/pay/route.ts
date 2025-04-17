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
  const { paymentIdx } = await req.json();
  const inst = await Installment.findOne({
    _id: params.id,
    userId: session.user.id,
  });
  if (!inst)
    return NextResponse.json(
      { error: "Parcelamento não encontrado" },
      { status: 404 }
    );
  if (
    !inst.payments[paymentIdx] ||
    inst.payments[paymentIdx].status === "paid"
  ) {
    return NextResponse.json(
      { error: "Parcela inválida ou já paga" },
      { status: 400 }
    );
  }
  inst.payments[paymentIdx].status = "paid";
  inst.payments[paymentIdx].paidDate = new Date();
  await inst.save();
  return NextResponse.json(inst);
}
