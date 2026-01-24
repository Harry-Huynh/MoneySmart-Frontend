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

  // if (loading) {
  //   if (loading) return <p className="p-6">Loading...</p>;
  // }
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
          {budgets.map((b) => (
            <BudgetItemCard key={b.id} budget={b} onDelete={handleDelete} />
          ))}

          {/* Add tile giống SavingGoals */}
          <Link
            href="/budgets/add"
            className="aspect-square max-w-45 w-full rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-3xl hover:border-green-500 hover:text-green-500 transition"
            aria-label="Add Budget"
          >
            +
          </Link>
        </div>
      </div>
    </section>
  );
}
