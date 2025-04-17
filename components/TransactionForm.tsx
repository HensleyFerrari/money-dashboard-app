"use client";
import { useState, useEffect } from "react";

export default function TransactionForm({
  onAdd,
  editTx,
  onUpdate,
  onCancelEdit,
  categories = [],
}: {
  onAdd: (tx: any) => void;
  editTx?: any;
  onUpdate?: (tx: any) => void;
  onCancelEdit?: () => void;
  categories?: string[];
}) {
  const isEdit = !!editTx;
  const [type, setType] = useState(editTx?.type || "income");
  const [description, setDescription] = useState(editTx?.description || "");
  const [amount, setAmount] = useState(editTx?.amount?.toString() || "");
  const [date, setDate] = useState(
    editTx?.date
      ? new Date(editTx.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [category, setCategory] = useState(editTx?.category || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editTx) {
      setType(editTx.type);
      setDescription(editTx.description);
      setAmount(editTx.amount?.toString() || "");
      setDate(
        editTx.date
          ? new Date(editTx.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setCategory(editTx.category);
    }
  }, [editTx]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (isEdit && editTx && onUpdate) {
      const res = await fetch(`/api/transactions/${editTx._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          description,
          amount: Number(amount),
          date,
          category,
        }),
      });
      if (res.ok) {
        const tx = await res.json();
        onUpdate(tx);
      } else {
        setError("Erro ao atualizar transação.");
      }
    } else {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          description,
          amount: Number(amount),
          date,
          category,
        }),
      });
      if (res.ok) {
        const tx = await res.json();
        onAdd(tx);
        setDescription("");
        setAmount("");
        setCategory("");
      } else {
        setError("Erro ao cadastrar transação.");
      }
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-2 items-end mb-4"
    >
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="income">Receita</option>
        <option value="expense">Despesa</option>
      </select>
      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 rounded"
        required
        min="0.01"
        step="0.01"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded"
        required
      >
        <option value="">Selecione a categoria</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-primary text-white rounded p-2 font-semibold min-w-[100px]"
        disabled={loading}
      >
        {loading
          ? isEdit
            ? "Salvando..."
            : "Salvando..."
          : isEdit
          ? "Salvar"
          : "Adicionar"}
      </button>
      {isEdit && onCancelEdit && (
        <button
          type="button"
          onClick={onCancelEdit}
          className="bg-gray-300 text-black rounded p-2 font-semibold min-w-[100px] ml-2"
        >
          Cancelar
        </button>
      )}
      {error && <div className="text-red-500 text-sm w-full">{error}</div>}
    </form>
  );
}
