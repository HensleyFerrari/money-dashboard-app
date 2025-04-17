import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowDown, ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

type Props = {
  income: number;
  expense: number;
  balance: number;
};

export default function ResumoFinanceiro({ income, expense, balance }: Props) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <DollarSign className="text-green-600 h-8 w-8" />
                </TooltipTrigger>
                <TooltipContent>Receitas</TooltipContent>
              </Tooltip>
              <CardTitle className="text-green-700 mt-2">Receitas</CardTitle>
              <div className="text-2xl font-bold text-green-800 mt-1">
                R$ {income.toFixed(2)}
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100/50">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <ArrowDown className="text-red-600 h-8 w-8" />
                </TooltipTrigger>
                <TooltipContent>Despesas</TooltipContent>
              </Tooltip>
              <CardTitle className="text-red-700 mt-2">Despesas</CardTitle>
              <div className="text-2xl font-bold text-red-800 mt-1">
                R$ {expense.toFixed(2)}
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <ArrowUp className="text-blue-600 h-8 w-8" />
                </TooltipTrigger>
                <TooltipContent>Saldo</TooltipContent>
              </Tooltip>
              <CardTitle className="text-blue-700 mt-2">Saldo</CardTitle>
              <div className="text-2xl font-bold text-blue-800 mt-1">
                R$ {balance.toFixed(2)}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </TooltipProvider>
  );
}
