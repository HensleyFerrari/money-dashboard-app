"use client";
import { useState, useEffect } from "react";
import { ITransaction } from "@/models/Transaction";

// Helper to format number to "0,00" display string or empty for placeholder
const formatNumberToDisplay = (num: number | undefined): string => {
  if (num === undefined || num === null) return ""; // Return empty for placeholder
  return num.toFixed(2).replace(".", ",");
};

export default function TransactionForm({
  onAdd,
  editTx,
  onUpdate,
  onCancelEdit,
  categories = [],
}: {
  onAdd: (tx: ITransaction) => void;
  editTx?: ITransaction;
  onUpdate?: (tx: ITransaction) => void;
  onCancelEdit?: () => void;
  categories?: string[];
}) {
  const isEdit = !!editTx;
  const [type, setType] = useState(editTx?.type || "income");
  const [description, setDescription] = useState(editTx?.description || "");
  // Updated initial state for amount
  const [amount, setAmount] = useState<string>(() =>
    formatNumberToDisplay(editTx?.amount)
  );
  const [date, setDate] = useState(
    editTx?.date
      ? new Date(editTx.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [category, setCategory] = useState(editTx?.category || "");
  const [transactionType, setTransactionType] = useState(
    editTx?.transactionType || "" // Changed initial state to empty for placeholder
  );
  const [installment, setInstallment] = useState(
    editTx?.installment?.toString() || "1"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editTx) {
      setType(editTx.type || "income");
      setDescription(editTx.description || "");
      setAmount(formatNumberToDisplay(editTx.amount)); // Use helper for amount
      setDate(
        editTx.date
          ? new Date(editTx.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setCategory(editTx.category || "");
      setTransactionType(editTx.transactionType || ""); // Ensure placeholder logic
      setInstallment(editTx.installment?.toString() || "1");
    } else {
      // Reset form when editTx is null (new transaction or after cancel)
      setType("income");
      setDescription("");
      setAmount(""); // Reset amount for placeholder
      setDate(new Date().toISOString().slice(0, 10));
      setCategory("");
      setTransactionType(""); // Reset transactionType for placeholder
      setInstallment("1");
    }
  }, [editTx]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, ""); // Corrected regex from /\\D/g to /\D/g

    if (digits === "") {
      setAmount(""); // Allow clearing to show placeholder
      return;
    }

    // Limit total number of digits (e.g., up to 999,999.99 would be 8 digits)
    const MAX_DIGITS = 8;
    const D = digits.slice(0, MAX_DIGITS);

    let formattedValue: string;
    if (D.length === 1) {
      formattedValue = `0,0${D}`;
    } else if (D.length === 2) {
      formattedValue = `0,${D}`;
    } else {
      const integerPart = D.slice(0, -2);
      const decimalPart = D.slice(-2);
      const cleanedIntegerPart = Number(integerPart).toString(); // Removes leading zeros
      formattedValue = `${cleanedIntegerPart},${decimalPart}`;
    }
    setAmount(formattedValue);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Convert formatted amount string (e.g., "12,34") to number (e.g., 12.34)
    const numericAmount = Number(amount.replace(",", "."));

    // Basic validation: if amount is required to be > 0
    // if (numericAmount <= 0) {
    //   setError("O valor deve ser maior que zero.");
    //   setLoading(false);
    //   return;
    // }

    if (isEdit && editTx && onUpdate) {
      const res = await fetch(`/api/transactions/${editTx._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          description,
          amount: numericAmount, // Use parsed numeric amount
          date,
          category,
          transactionType,
          installment: Number(installment),
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
          amount: numericAmount, // Use parsed numeric amount
          date,
          category,
          transactionType,
          installment: Number(installment),
        }),
      });
      if (res.ok) {
        const tx = await res.json();
        onAdd(tx);
        setDescription("");
        setAmount("");
        setCategory("");
        setTransactionType(""); // Reset to empty for placeholder
        setInstallment("1");
      } else {
        setError("Erro ao cadastrar transação.");
      }
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end mb-4"
    >
      <div className="flex flex-col">
        <label htmlFor="type" className="mb-1 text-sm font-medium">
          Tipo
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="border p-2 rounded"
        >
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="description" className="mb-1 text-sm font-medium">
          Descrição
        </label>
        <input
          id="description"
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="amount" className="mb-1 text-sm font-medium">
          Valor
        </label>
        <input
          id="amount"
          type="text" // Changed from "number"
          placeholder="0,00" // Added placeholder
          value={amount} // Bind to formatted amount state
          onChange={handleAmountChange} // Use new handler
          className="border p-2 rounded"
          required // Field cannot be empty
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="date" className="mb-1 text-sm font-medium">
          Data
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="category" className="mb-1 text-sm font-medium">
          Categoria
        </label>
        <select
          id="category"
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
      </div>
      <div className="flex flex-col">
        <label htmlFor="transactionType" className="mb-1 text-sm font-medium">
          Tipo de Transação
        </label>
        <select
          id="transactionType"
          value={transactionType}
          onChange={(e) =>
            setTransactionType(e.target.value as "pix" | "debit" | "credit")
          }
          className="border p-2 rounded"
          required // Added required as it now has a placeholder
        >
          <option value="" disabled>
            Selecione o tipo
          </option>{" "}
          {/* Placeholder */}
          <option value="pix">Pix</option>
          <option value="debit">Débito</option>
          <option value="credit">Crédito</option>
        </select>
      </div>
      {transactionType === "credit" && ( // Conditionally render installment field
        <div className="flex flex-col">
          <label htmlFor="installment" className="mb-1 text-sm font-medium">
            Parcela
          </label>
          <input
            id="installment"
            type="number"
            placeholder="Parcela"
            value={installment}
            onChange={(e) => setInstallment(e.target.value)}
            className="border p-2 rounded"
            required={transactionType === "credit"} // Required only if visible
            min="1"
            step="1"
          />
        </div>
      )}
      <div className="flex flex-col md:col-span-2 lg:col-span-3">
        {" "}
        {/* Button div to span full width on some breakpoints */}
        <button
          type="submit"
          className="bg-primary text-white rounded p-2 font-semibold min-w-[100px] w-full md:w-auto" // Adjusted width
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
            className="bg-gray-300 text-black rounded p-2 font-semibold min-w-[100px] w-full md:w-auto mt-2 md:mt-0 md:ml-2" // Adjusted width and margin
          >
            Cancelar
          </button>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-sm w-full md:col-span-2 lg:col-span-3">
          {error}
        </div>
      )}
    </form>
  );
}
