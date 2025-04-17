import { ITransaction } from "@/models/Transaction";
import React from "react";
import TransactionList from "@/components/TransactionList";

type Props = {
  loading: boolean;
  transactions: ITransaction[];
  onEdit: (tx: ITransaction) => void;
  onDelete: (id: string) => void;
};

export default function ListaTransacoes({
  loading,
  transactions,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Transações do Mês</h2>
      {loading ? (
        <div className="text-center py-4 text-muted-foreground">
          Carregando...
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
