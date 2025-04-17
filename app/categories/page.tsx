"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { PencilIcon, Trash2Icon } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  type: "income" | "expense";
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<"income" | "expense">("income");
  const [error, setError] = useState("");

  const handleTypeChange = (value: string) => {
    if (value === "income" || value === "expense") {
      if (editId) {
        setEditType(value);
      } else {
        setType(value);
      }
    }
  };

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
    const cat = categories.find((c) => c._id === id);
    if (!cat) return;

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
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={editId ? handleUpdate : handleAdd}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <Select
                value={editId ? editType : type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="text"
                placeholder="Nome da categoria"
                value={editId ? editName : name}
                onChange={(e) =>
                  editId ? setEditName(e.target.value) : setName(e.target.value)
                }
                className="flex-1"
                required
              />

              <div className="flex gap-2">
                <Button type="submit" className="w-full sm:w-auto">
                  {editId ? "Salvar" : "Adicionar"}
                </Button>
                {editId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditId(null);
                      setEditName("");
                      setEditType("income");
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>

            {error && (
              <div className="text-destructive text-sm mb-4">{error}</div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat._id}>
                    <TableCell>
                      {cat.type === "income" ? "Receita" : "Despesa"}
                    </TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(cat._id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(cat._id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
