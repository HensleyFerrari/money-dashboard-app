"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("E-mail ou senha inválidos.");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <button
          type="submit"
          className="bg-primary text-white rounded p-2 font-semibold"
        >
          Entrar
        </button>
      </form>
      <p className="mt-4 text-sm">
        Não tem conta?{" "}
        <a href="/register" className="text-blue-600 underline">
          Cadastre-se
        </a>
      </p>
    </div>
  );
}
