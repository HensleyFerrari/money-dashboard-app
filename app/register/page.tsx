"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      setSuccess("Cadastro realizado! Faça login.");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao cadastrar.");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="bg-primary text-white rounded p-2 font-semibold"
        >
          Cadastrar
        </button>
      </form>
      <p className="mt-4 text-sm">
        Já tem conta?{" "}
        <a href="/login" className="text-blue-600 underline">
          Entrar
        </a>
      </p>
    </div>
  );
}
