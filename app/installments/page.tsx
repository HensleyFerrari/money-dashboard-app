"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";

export default function InstallmentsPage() {
  const [installments, setInstallments] = useState([]);
  const [form, setForm] = useState({
    description: "",
    totalAmount: "",
    numberOfInstallments: "",
    startDate: "",
    category: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    description: "",
    totalAmount: "",
    numberOfInstallments: "",
    startDate: "",
    category: "",
  });
  const [error, setError] = useState("");

  async function fetchInstallments() {
    const res = await fetch("/api/installments");
    if (res.ok) setInstallments(await res.json());
  }

  useEffect(() => {
    fetchInstallments();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/installments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        totalAmount: Number(form.totalAmount),
        numberOfInstallments: Number(form.numberOfInstallments),
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
    const inst = installments.find((i: any) => i._id === id);
    setEditId(id);
    setEditForm({
      description: inst.description,
      totalAmount: inst.totalAmount,
      numberOfInstallments: inst.numberOfInstallments,
      startDate: inst.startDate ? inst.startDate.slice(0, 10) : "",
      category: inst.category,
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/installments/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        totalAmount: Number(editForm.totalAmount),
        numberOfInstallments: Number(editForm.numberOfInstallments),
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
      <div className="max-w-2xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold mb-6">Parcelamentos</h1>
        <form
          onSubmit={editId ? handleUpdate : handleAdd}
          className="flex flex-wrap gap-2 mb-4"
        >
          <input
            type="text"
            placeholder="Descrição"
            value={editId ? editForm.description : form.description}
            onChange={(e) =>
              editId
                ? setEditForm((f) => ({ ...f, description: e.target.value }))
                : setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Valor total"
            value={editId ? editForm.totalAmount : form.totalAmount}
            onChange={(e) =>
              editId
                ? setEditForm((f) => ({ ...f, totalAmount: e.target.value }))
                : setForm((f) => ({ ...f, totalAmount: e.target.value }))
            }
            className="border p-2 rounded"
            required
            min="0.01"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Nº parcelas"
            value={
              editId ? editForm.numberOfInstallments : form.numberOfInstallments
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
            className="border p-2 rounded"
            required
            min="1"
          />
          <input
            type="date"
            value={editId ? editForm.startDate : form.startDate}
            onChange={(e) =>
              editId
                ? setEditForm((f) => ({ ...f, startDate: e.target.value }))
                : setForm((f) => ({ ...f, startDate: e.target.value }))
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Categoria"
            value={editId ? editForm.category : form.category}
            onChange={(e) =>
              editId
                ? setEditForm((f) => ({ ...f, category: e.target.value }))
                : setForm((f) => ({ ...f, category: e.target.value }))
            }
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-primary text-white rounded p-2 font-semibold min-w-[100px]"
          >
            {editId ? "Salvar" : "Adicionar"}
          </button>
          {editId && (
            <button
              type="button"
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
              className="bg-gray-300 text-black rounded p-2 font-semibold min-w-[100px]"
            >
              Cancelar
            </button>
          )}
        </form>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Descrição</th>
              <th className="p-2">Valor total</th>
              <th className="p-2">Parcelas</th>
              <th className="p-2">Categoria</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {installments.map((inst: any) => (
              <tr key={inst._id}>
                <td>{inst.description}</td>
                <td>R$ {Number(inst.totalAmount).toFixed(2)}</td>
                <td>
                  {inst.payments.map((p: any, idx: number) => (
                    <span
                      key={idx}
                      className={
                        "inline-block px-2 py-1 m-0.5 rounded text-xs " +
                        (p.status === "paid"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-100 text-yellow-800")
                      }
                    >
                      {idx + 1}: {p.status === "paid" ? "Paga" : "Pendente"}{" "}
                      {p.status === "pending" && (
                        <button
                          className="ml-1 underline text-blue-600"
                          onClick={() => handleMarkPaid(inst._id, idx)}
                        >
                          Marcar paga
                        </button>
                      )}
                    </span>
                  ))}
                </td>
                <td>{inst.category}</td>
                <td>
                  <button
                    onClick={() => handleEdit(inst._id)}
                    className="text-blue-600 underline mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(inst._id)}
                    className="text-red-600 underline"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthGuard>
  );
}
