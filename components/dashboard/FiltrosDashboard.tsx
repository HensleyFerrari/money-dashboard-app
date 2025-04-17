import React from "react";
import { Calendar, Tag, DollarSign } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Props = {
  month: number;
  setMonth: (v: number) => void;
  year: number;
  setYear: (v: number) => void;
  category: string;
  setCategory: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  minValue: string;
  setMinValue: (v: string) => void;
  maxValue: string;
  setMaxValue: (v: string) => void;
  descFilter: string;
  setDescFilter: (v: string) => void;
  categories: string[];
  currentYear: number;
};

export default function FiltrosDashboard({
  month,
  setMonth,
  year,
  setYear,
  category,
  setCategory,
  typeFilter,
  setTypeFilter,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
  descFilter,
  setDescFilter,
  categories,
  currentYear,
}: Props) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Grupo de Data */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Período
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select
                    value={String(month)}
                    onValueChange={(v: string) => setMonth(Number(v))}
                  >
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>Mês</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select
                    value={String(year)}
                    onValueChange={(v: string) => setYear(Number(v))}
                  >
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {[currentYear - 1, currentYear, currentYear + 1].map(
                        (y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>Ano</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        {/* Grupo de Classificação */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Classificação
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select
                    value={category || "all"}
                    onValueChange={(v: string) =>
                      setCategory(v === "all" ? "" : v)
                    }
                  >
                    <SelectTrigger>
                      <Tag className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas categorias</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>Categoria</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select
                    value={typeFilter || "all"}
                    onValueChange={(v: string) =>
                      setTypeFilter(v === "all" ? "" : v)
                    }
                  >
                    <SelectTrigger>
                      <DollarSign className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos tipos</SelectItem>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>Tipo</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        {/* Grupo de Valores */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Valores
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    type="number"
                    placeholder="Valor mín."
                    value={minValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setMinValue(e.target.value)
                    }
                    min="0"
                    className="w-full"
                  />
                </TooltipTrigger>
                <TooltipContent>Valor mínimo</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    type="number"
                    placeholder="Valor máx."
                    value={maxValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setMaxValue(e.target.value)
                    }
                    min="0"
                    className="w-full"
                  />
                </TooltipTrigger>
                <TooltipContent>Valor máximo</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        {/* Campo de Busca */}
        <div className="md:col-span-2 lg:col-span-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                type="text"
                placeholder="Pesquisar por descrição..."
                value={descFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDescFilter(e.target.value)
                }
                className="w-full"
              />
            </TooltipTrigger>
            <TooltipContent>Pesquisar transações</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
