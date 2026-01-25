"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import BudgetItemCard from "@/components/BudgetItemCard";
import { formatMoneyCAD } from "@/lib/mock/budgets";
import { getAllBudgets, deleteBudget } from "@/lib/budget.actions";

export default function BudgetsClient() {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    async function fetchBudgets() {
      const { budgets } = await getAllBudgets();
      setBudgets(budgets);
    }
    fetchBudgets();
  }, []);

  const monthTotal = useMemo(() => {
    return budgets.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  }, [budgets]);

  async function handleDelete(id) {
    await deleteBudget(id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl px-8 py-6">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-6">Budgets</h1>

        {/* This Month Budget summary (full-width like Current Balance card) */}
        <Card className="p-0 overflow-hidden border border-black/5 shadow-sm mb-6">
          <div className="p-6 bg-[#4f915f]/20">
            <p className="text-slate-600 font-medium">This Month Budget</p>
            <p className="text-4xl font-semibold text-slate-800 mt-2">
              {formatMoneyCAD(monthTotal)}
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {budgets.map((b, idx) => (
            <BudgetItemCard
              key={b.id}
              budget={b}
              index={idx}
              onDelete={handleDelete}
            />
          ))}

          <Link
            href="/budgets/add"
            className="min-h-45 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-4xl hover:border-green-500 hover:text-green-500 transition cursor-pointer p-6 w-full"
            aria-label="Add Budget"
          >
            +
          </Link>
        </div>
      </div>
    </section>
  );
}
