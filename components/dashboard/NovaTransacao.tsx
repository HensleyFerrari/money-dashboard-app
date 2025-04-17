import { ITransaction } from "@/models/Transaction";
import React from "react";
import TransactionForm from "@/components/TransactionForm";

type Props = {
  onAdd: (tx: ITransaction) => void;
  editTx: ITransaction | null;
  onUpdate: (tx: ITransaction) => void;
  onCancelEdit: () => void;
  categories: string[];
};

export default function NovaTransacao({
  onAdd,
  editTx,
  onUpdate,
  onCancelEdit,
  categories,
}: Props) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Nova Transação</h2>
      <TransactionForm
        onAdd={onAdd}
        editTx={editTx}
        onUpdate={onUpdate}
        onCancelEdit={onCancelEdit}
        categories={categories}
      />
    </div>
  );
}
