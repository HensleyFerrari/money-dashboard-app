import { ITransaction } from "@/models/Transaction";
import React from "react";
import ChartSection from "@/components/ChartSection";

type Props = {
  transactions: ITransaction[];
};

export default function GraficosDashboard({ transactions }: Props) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Gráficos</h2>
      <ChartSection transactions={transactions} />
    </div>
  );
}
