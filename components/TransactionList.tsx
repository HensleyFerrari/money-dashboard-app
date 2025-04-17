"use client";

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: any[];
  onEdit?: (tx: any) => void;
  onDelete?: (id: string) => void;
}) {
  if (!transactions.length) {
    return <div className="text-gray-500">Nenhuma transação encontrada.</div>;
  }
  return (
    <table className="w-full border mt-2 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Tipo</th>
          <th className="p-2">Descrição</th>
          <th className="p-2">Valor</th>
          <th className="p-2">Data</th>
          <th className="p-2">Categoria</th>
          <th className="p-2">Ações</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t._id}>
            <td
              className={
                t.type === "income" ? "text-green-600" : "text-red-600"
              }
            >
              {t.type === "income" ? "Receita" : "Despesa"}
            </td>
            <td>{t.description}</td>
            <td>R$ {Number(t.amount).toFixed(2)}</td>
            <td>{new Date(t.date).toLocaleDateString()}</td>
            <td>{t.category}</td>
            <td>
              {onEdit && (
                <button
                  onClick={() => onEdit(t)}
                  className="text-blue-600 underline mr-2"
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={async () => {
                    if (window.confirm("Remover transação?")) {
                      const res = await fetch(`/api/transactions/${t._id}`, {
                        method: "DELETE",
                      });
                      if (res.ok) onDelete(t._id);
                    }
                  }}
                  className="text-red-600 underline"
                >
                  Remover
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
