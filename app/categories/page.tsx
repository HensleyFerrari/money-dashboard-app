"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("income");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("income");
  const [error, setError] = useState("");

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    if (res.ok) {
      setCategories(await res.json());
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });
    if (res.ok) {
      setName("");
      setType("income");
      fetchCategories();
    } else {
      setError("Erro ao criar categoria.");
    }
  }

  async function handleEdit(id: string) {
    const cat = categories.find((c: any) => c._id === id);
    setEditId(id);
    setEditName(cat.name);
    setEditType(cat.type);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/categories/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, type: editType }),
    });
    if (res.ok) {
      setEditId(null);
      setEditName("");
      setEditType("income");
      fetchCategories();
    } else {
      setError("Erro ao atualizar categoria.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remover categoria?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) fetchCategories();
  }

  return (
    <AuthGuard>
      <div className="max-w-lg mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold mb-6">Categorias</h1>
        <form
          onSubmit={editId ? handleUpdate : handleAdd}
          className="flex gap-2 mb-4"
        >
          <select
            value={editId ? editType : type}
            onChange={(e) =>
              editId ? setEditType(e.target.value) : setType(e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
          <input
            type="text"
            placeholder="Nome da categoria"
            value={editId ? editName : name}
            onChange={(e) =>
              editId ? setEditName(e.target.value) : setName(e.target.value)
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
                setEditName("");
                setEditType("income");
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
              <th className="p-2">Tipo</th>
              <th className="p-2">Nome</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat._id}>
                <td>{cat.type === "income" ? "Receita" : "Despesa"}</td>
                <td>{cat.name}</td>
                <td>
                  <button
                    onClick={() => handleEdit(cat._id)}
                    className="text-blue-600 underline mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
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
