"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ChartSection from "@/components/ChartSection";
import { Calendar, Tag, DollarSign, ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
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

        <TooltipProvider>
          {/* Cards de resumo responsivos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DollarSign className="text-green-600 h-8 w-8" />
                    </TooltipTrigger>
                    <TooltipContent>Receitas</TooltipContent>
                  </Tooltip>
                  <CardTitle className="text-green-700 mt-2">
                    Receitas
                  </CardTitle>
                  <div className="text-2xl font-bold text-green-800 mt-1">
                    R$ {income.toFixed(2)}
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100/50">
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ArrowDown className="text-red-600 h-8 w-8" />
                    </TooltipTrigger>
                    <TooltipContent>Despesas</TooltipContent>
                  </Tooltip>
                  <CardTitle className="text-red-700 mt-2">Despesas</CardTitle>
                  <div className="text-2xl font-bold text-red-800 mt-1">
                    R$ {expense.toFixed(2)}
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ArrowUp className="text-blue-600 h-8 w-8" />
                    </TooltipTrigger>
                    <TooltipContent>Saldo</TooltipContent>
                  </Tooltip>
                  <CardTitle className="text-blue-700 mt-2">Saldo</CardTitle>
                  <div className="text-2xl font-bold text-blue-800 mt-1">
                    R$ {balance.toFixed(2)}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Gráficos</h2>
            <ChartSection transactions={transactions} />
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Grupo de Data */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Período
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={String(month)}
                          onValueChange={(v: string) => setMonth(Number(v))}
                        >
                          <SelectTrigger>
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Mês" />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(12)].map((_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent>Mês</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={String(year)}
                          onValueChange={(v: string) => setYear(Number(v))}
                        >
                          <SelectTrigger>
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Ano" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              currentYear - 1,
                              currentYear,
                              currentYear + 1,
                            ].map((y) => (
                              <SelectItem key={y} value={String(y)}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent>Ano</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Grupo de Classificação */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Classificação
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={category || "all"}
                          onValueChange={(v: string) =>
                            setCategory(v === "all" ? "" : v)
                          }
                        >
                          <SelectTrigger>
                            <Tag className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              Todas categorias
                            </SelectItem>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent>Categoria</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={typeFilter || "all"}
                          onValueChange={(v: string) =>
                            setTypeFilter(v === "all" ? "" : v)
                          }
                        >
                          <SelectTrigger>
                            <DollarSign className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos tipos</SelectItem>
                            <SelectItem value="income">Receita</SelectItem>
                            <SelectItem value="expense">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent>Tipo</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Grupo de Valores */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Valores
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          type="number"
                          placeholder="Valor mín."
                          value={minValue}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setMinValue(e.target.value)
                          }
                          min="0"
                          className="w-full"
                        />
                      </TooltipTrigger>
                      <TooltipContent>Valor mínimo</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          type="number"
                          placeholder="Valor máx."
                          value={maxValue}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setMaxValue(e.target.value)
                          }
                          min="0"
                          className="w-full"
                        />
                      </TooltipTrigger>
                      <TooltipContent>Valor máximo</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Campo de Busca */}
              <div className="md:col-span-2 lg:col-span-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      type="text"
                      placeholder="Pesquisar por descrição..."
                      value={descFilter}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDescFilter(e.target.value)
                      }
                      className="w-full"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Pesquisar transações</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Nova Transação</h2>
            <TransactionForm
              onAdd={handleAdd}
              editTx={editTx}
              onUpdate={handleUpdate}
              onCancelEdit={() => setEditTx(null)}
              categories={categories}
            />
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Transações do Mês</h2>
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">
                Carregando...
              </div>
            ) : (
              <TransactionList
                transactions={transactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </TooltipProvider>
      </div>
    </AuthGuard>
  );
}
