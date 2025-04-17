"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/login" })}
      variant="ghost"
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span>Sair</span>
    </Button>
  );
}
