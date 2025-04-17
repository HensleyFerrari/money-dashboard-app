import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Installment from "@/models/Installment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectToDatabase();
  const installments = await Installment.find({
    userId: session.user.id,
  });
  return NextResponse.json(installments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectToDatabase();
  const data = await req.json();

  // Gerar as parcelas (payments)
  const payments = [];
  const startDate = new Date(data.startDate);
  const amount = Number(data.installmentAmount); // Garante que amount é número
  for (let i = 0; i < data.numberOfInstallments; i++) {
    const dueDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + i,
      startDate.getDate()
    );
    payments.push({
      dueDate,
      status: "pending",
      amount, // amount agora é número
    });
  }

  const installment = await Installment.create({
    ...data,
    userId: session.user.id,
    payments,
    installmentAmount: amount, // Garante que installmentAmount é número
  });
  return NextResponse.json(installment, { status: 201 });
}
