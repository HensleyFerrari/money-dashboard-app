"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Payment {
  status: "paid" | "pending";
  date?: string;
  amount: number;
}

interface Installment {
  _id: string;
  description: string;
  totalAmount: number;
  numberOfInstallments: number;
  startDate: string;
  category: string;
  payments: Payment[];
}

interface InstallmentForm {
  description: string;
  totalAmount: string;
  numberOfInstallments: string;
  startDate: string;
  category: string;
}

export default function InstallmentsPage() {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [form, setForm] = useState<InstallmentForm>({
    description: "",
    totalAmount: "",
    numberOfInstallments: "",
    startDate: "",
    category: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<InstallmentForm>({
    description: "",
    totalAmount: "",
    numberOfInstallments: "",
    startDate: "",
    category: "",
  });
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [error, setError] = useState("");

  async function fetchInstallments() {
    const res = await fetch("/api/installments");
    if (res.ok) setInstallments(await res.json());
  }

  useEffect(() => {
    fetchInstallments();
    // Buscar categorias ao carregar a página
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      if (res.ok) {
        setCategories(await res.json());
      }
    }
    fetchCategories();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const totalAmountNum = Number(form.totalAmount);
    const numberOfInstallmentsNum = Number(form.numberOfInstallments);
    if (!numberOfInstallmentsNum || numberOfInstallmentsNum < 1) {
      setError("O número de parcelas é obrigatório e deve ser maior que zero.");
      return;
    }
    const installmentAmount =
      numberOfInstallmentsNum > 0
        ? totalAmountNum / numberOfInstallmentsNum
        : 0;
    const res = await fetch("/api/installments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        totalAmount: totalAmountNum,
        numberOfInstallments: numberOfInstallmentsNum,
        installmentAmount,
      }),
    });
    if (res.ok) {
      setForm({
        description: "",
        totalAmount: "",
        numberOfInstallments: "",
        startDate: "",
        category: "",
      });
      fetchInstallments();
    } else {
      setError("Erro ao cadastrar parcelamento.");
    }
  }

  async function handleEdit(id: string) {
    const inst = installments.find((i) => i._id === id);
    if (!inst) return;

    setEditId(id);
    setEditForm({
      description: inst.description,
      totalAmount: inst.totalAmount.toString(),
      numberOfInstallments: inst.numberOfInstallments.toString(),
      startDate: inst.startDate ? inst.startDate.slice(0, 10) : "",
      category: inst.category,
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const totalAmountNum = Number(editForm.totalAmount);
    const numberOfInstallmentsNum = Number(editForm.numberOfInstallments);
    if (!numberOfInstallmentsNum || numberOfInstallmentsNum < 1) {
      setError("O número de parcelas é obrigatório e deve ser maior que zero.");
      return;
    }
    const installmentAmount =
      numberOfInstallmentsNum > 0
        ? totalAmountNum / numberOfInstallmentsNum
        : 0;
    const res = await fetch(`/api/installments/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        totalAmount: totalAmountNum,
        numberOfInstallments: numberOfInstallmentsNum,
        installmentAmount,
      }),
    });
    if (res.ok) {
      setEditId(null);
      setEditForm({
        description: "",
        totalAmount: "",
        numberOfInstallments: "",
        startDate: "",
        category: "",
      });
      fetchInstallments();
    } else {
      setError("Erro ao atualizar parcelamento.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remover parcelamento?")) return;
    const res = await fetch(`/api/installments/${id}`, { method: "DELETE" });
    if (res.ok) fetchInstallments();
  }

  async function handleMarkPaid(installmentId: string, paymentIdx: number) {
    const res = await fetch(`/api/installments/${installmentId}/pay`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIdx }),
    });
    if (res.ok) fetchInstallments();
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Parcelamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={editId ? handleUpdate : handleAdd}
              className="flex flex-wrap gap-4 mb-6"
            >
              <Input
                type="text"
                placeholder="Descrição"
                value={editId ? editForm.description : form.description}
                onChange={(e) =>
                  editId
                    ? setEditForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    : setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="flex-1 min-w-[200px]"
                required
              />
              <Input
                type="number"
                placeholder="Valor total"
                value={editId ? editForm.totalAmount : form.totalAmount}
                onChange={(e) =>
                  editId
                    ? setEditForm((f) => ({
                        ...f,
                        totalAmount: e.target.value,
                      }))
                    : setForm((f) => ({ ...f, totalAmount: e.target.value }))
                }
                className="w-full sm:w-36"
                required
                min="0.01"
                step="0.01"
              />
              <Input
                type="number"
                placeholder="Nº parcelas"
                value={
                  editId
                    ? editForm.numberOfInstallments
                    : form.numberOfInstallments
                }
                onChange={(e) =>
                  editId
                    ? setEditForm((f) => ({
                        ...f,
                        numberOfInstallments: e.target.value,
                      }))
                    : setForm((f) => ({
                        ...f,
                        numberOfInstallments: e.target.value,
                      }))
                }
                className="w-full sm:w-32"
                required
                min="1"
              />
              <Input
                type="date"
                value={editId ? editForm.startDate : form.startDate}
                onChange={(e) =>
                  editId
                    ? setEditForm((f) => ({ ...f, startDate: e.target.value }))
                    : setForm((f) => ({ ...f, startDate: e.target.value }))
                }
                className="w-full sm:w-auto"
                required
              />
              <Select
                value={editId ? editForm.category : form.category}
                onValueChange={(value) => {
                  if (editId) {
                    setEditForm((f) => ({ ...f, category: value }));
                  } else {
                    setForm((f) => ({ ...f, category: value }));
                  }
                }}
                required
              >
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button type="submit" className="flex-1 sm:flex-initial">
                  {editId ? "Salvar" : "Adicionar"}
                </Button>
                {editId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditId(null);
                      setEditForm({
                        description: "",
                        totalAmount: "",
                        numberOfInstallments: "",
                        startDate: "",
                        category: "",
                      });
                    }}
                    className="flex-1 sm:flex-initial"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
            {error && (
              <div className="text-destructive text-sm mb-4">{error}</div>
            )}
            <div className="rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left font-medium">Descrição</th>
                      <th className="p-3 text-left font-medium">Valor total</th>
                      <th className="p-3 text-left font-medium">Parcelas</th>
                      <th className="p-3 text-left font-medium">Categoria</th>
                      <th className="p-3 text-left font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((inst) => (
                      <tr key={inst._id} className="border-t">
                        <td className="p-3" colSpan={5}>
                          <div className="mb-2 font-semibold flex items-center gap-2 justify-between">
                            <span>
                              {inst.description} (R${" "}
                              {inst.totalAmount.toFixed(2)}) - {inst.category}
                            </span>
                            <span className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Editar"
                                onClick={() => handleEdit(inst._id)}
                              >
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Apagar"
                                onClick={() => handleDelete(inst._id)}
                              >
                                <Trash2Icon className="w-4 h-4" />
                              </Button>
                            </span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs border rounded">
                              <thead className="bg-muted/50">
                                <tr>
                                  <th className="p-2 text-left">Parcela</th>
                                  <th className="p-2 text-left">Valor</th>
                                  <th className="p-2 text-left">
                                    Data Prevista
                                  </th>
                                  <th className="p-2 text-left">Status</th>
                                  <th className="p-2 text-left">Ação</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inst.payments.map((p, idx) => {
                                  // Calcular data prevista da parcela
                                  const start = new Date(inst.startDate);
                                  const dueDate = new Date(
                                    start.getFullYear(),
                                    start.getMonth() + idx,
                                    start.getDate()
                                  );
                                  const dueDateStr = dueDate.toLocaleDateString(
                                    "pt-BR",
                                    { month: "2-digit", year: "numeric" }
                                  );
                                  return (
                                    <tr key={idx} className="border-t">
                                      <td className="p-2">
                                        {idx + 1} / {inst.numberOfInstallments}
                                      </td>
                                      <td className="p-2">
                                        R${" "}
                                        {typeof p.amount === "number"
                                          ? p.amount.toFixed(2)
                                          : "-"}
                                      </td>
                                      <td className="p-2">{dueDateStr}</td>
                                      <td className="p-2">
                                        {p.status === "paid" ? (
                                          <span className="text-green-600 font-medium flex items-center gap-1">
                                            <svg
                                              width="16"
                                              height="16"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              viewBox="0 0 24 24"
                                            >
                                              <path d="M5 13l4 4L19 7" />
                                            </svg>
                                            Paga
                                          </span>
                                        ) : (
                                          <span className="text-yellow-700 font-medium">
                                            Pendente
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-2">
                                        {p.status === "pending" && (
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            title="Marcar como paga"
                                            onClick={() =>
                                              handleMarkPaid(inst._id, idx)
                                            }
                                          >
                                            <svg
                                              width="18"
                                              height="18"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              viewBox="0 0 24 24"
                                            >
                                              <path d="M5 13l4 4L19 7" />
                                            </svg>
                                          </Button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
