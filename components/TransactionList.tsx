"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  onEdit?: (tx: Transaction) => void;
  onDelete?: (id: string) => void;
}) {
  if (!transactions.length) {
    return (
      <div className="text-muted-foreground text-center p-4">
        Nenhuma transação encontrada.
      </div>
    );
  }

  return (
    <Card className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="w-[120px]">Valor</TableHead>
            <TableHead className="w-[120px]">Data</TableHead>
            <TableHead className="w-[150px]">Categoria</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t._id}>
              <TableCell
                className={
                  t.type === "income" ? "text-green-600" : "text-red-600"
                }
              >
                {t.type === "income" ? "Receita" : "Despesa"}
              </TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell>R$ {Number(t.amount).toFixed(2)}</TableCell>
              <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
              <TableCell>{t.category}</TableCell>
              <TableCell className="flex justify-end gap-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(t)}
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      if (window.confirm("Remover transação?")) {
                        const res = await fetch(`/api/transactions/${t._id}`, {
                          method: "DELETE",
                        });
                        if (res.ok) onDelete(t._id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700"
                    title="Remover"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
