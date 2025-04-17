"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tag, DollarSign } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/categories", label: "Categorias", icon: Tag },
    { href: "/installments", label: "Parcelados", icon: DollarSign },
  ];

  return (
    <nav className="flex items-center justify-center gap-4 p-4 bg-card border-b">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
              ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
