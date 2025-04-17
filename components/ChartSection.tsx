"use client";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function ChartSection({
  transactions,
}: {
  transactions: any[];
}) {
  // Gráfico de pizza: despesas por categoria
  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t: any) => t.type === "expense")
      .forEach((t: any) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [transactions]);

  const pieData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: [
          "#f87171",
          "#fbbf24",
          "#34d399",
          "#60a5fa",
          "#a78bfa",
          "#f472b6",
          "#facc15",
          "#4ade80",
        ],
      },
    ],
  };

  // Gráfico de barras: receitas e despesas últimos 6 meses
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return `${d.getMonth() + 1}/${d.getFullYear()}`;
  });
  const incomeData = months.map((m) => {
    const [month, year] = m.split("/").map(Number);
    return transactions
      .filter(
        (t: any) =>
          t.type === "income" &&
          new Date(t.date).getMonth() + 1 === month &&
          new Date(t.date).getFullYear() === year
      )
      .reduce((acc: number, t: any) => acc + t.amount, 0);
  });
  const expenseData = months.map((m) => {
    const [month, year] = m.split("/").map(Number);
    return transactions
      .filter(
        (t: any) =>
          t.type === "expense" &&
          new Date(t.date).getMonth() + 1 === month &&
          new Date(t.date).getFullYear() === year
      )
      .reduce((acc: number, t: any) => acc + t.amount, 0);
  });
  const barData = {
    labels: months,
    datasets: [
      {
        label: "Receitas",
        data: incomeData,
        backgroundColor: "#34d399",
      },
      {
        label: "Despesas",
        data: expenseData,
        backgroundColor: "#f87171",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
      <div>
        <h3 className="font-semibold mb-2">Despesas por categoria</h3>
        <Pie data={pieData} />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Receitas vs Despesas (6 meses)</h3>
        <Bar data={barData} />
      </div>
    </div>
  );
}
