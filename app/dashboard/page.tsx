"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import ResumoFinanceiro from "@/components/dashboard/ResumoFinanceiro";
import FiltrosDashboard from "@/components/dashboard/FiltrosDashboard";
import NovaTransacao from "@/components/dashboard/NovaTransacao";
import ListaTransacoes from "@/components/dashboard/ListaTransacoes";
import GraficosDashboard from "@/components/dashboard/GraficosDashboard";
import type { ITransaction } from "@/models/Transaction";

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [category, setCategory] = useState("");
  const [editTx, setEditTx] = useState<ITransaction | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [descFilter, setDescFilter] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data: { name: string }[] = await res.json();
        setCategories(data.map((c) => c.name));
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      const params = new URLSearchParams({
        month: String(month),
        year: String(year),
        ...(category ? { category } : {}),
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(minValue ? { min: minValue } : {}),
        ...(maxValue ? { max: maxValue } : {}),
        ...(descFilter ? { desc: descFilter } : {}),
      });
      const res = await fetch(`/api/transactions?${params.toString()}`);
      if (res.ok) {
        const data: ITransaction[] = await res.json();
        setTransactions(data);
      }
      setLoading(false);
    }
    fetchTransactions();
  }, [month, year, category, typeFilter, minValue, maxValue, descFilter]);

  // Resumo financeiro
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  function handleAdd(newTx: ITransaction) {
    setTransactions((prev) => [newTx, ...prev]);
  }

  function handleEdit(tx: ITransaction) {
    setEditTx(tx);
  }

  function handleUpdate(updatedTx: ITransaction) {
    setTransactions((prev) =>
      prev.map((t) => (t._id === updatedTx._id ? updatedTx : t))
    );
    setEditTx(null);
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <ResumoFinanceiro income={income} expense={expense} balance={balance} />
        <GraficosDashboard transactions={transactions} />
        <FiltrosDashboard
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          category={category}
          setCategory={setCategory}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          minValue={minValue}
          setMinValue={setMinValue}
          maxValue={maxValue}
          setMaxValue={setMaxValue}
          descFilter={descFilter}
          setDescFilter={setDescFilter}
          categories={categories}
          currentYear={currentYear}
        />
        <NovaTransacao
          onAdd={handleAdd}
          editTx={editTx}
          onUpdate={handleUpdate}
          onCancelEdit={() => setEditTx(null)}
          categories={categories}
        />
        <ListaTransacoes
          loading={loading}
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AuthGuard>
  );
}
