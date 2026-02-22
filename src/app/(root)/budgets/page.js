"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

import BudgetItemCard from "@/components/BudgetItemCard";
import MonthNavigation from "@/components/MonthNavigation";
import BudgetSummaryBox from "@/components/BudgetSummaryBox";
import { getBudgetByMonthAndYear, deleteBudget } from "@/lib/budget.actions";
import { getMyProfile } from "@/lib/user.actions";

export default function BudgetsClient() {
  const [budgets, setBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date());
  const [preferredDateFormat, setPreferredDateFormat] = useState("YYYY-MM-DD");

  useEffect(() => {
    async function fetchBudgets() {
      const { budgets } = await getBudgetByMonthAndYear(
        selectedMonth.getMonth(),
        selectedMonth.getFullYear(),
      );
      setBudgets(budgets);
    }
    fetchBudgets();
  }, [selectedMonth]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();
        setPreferredDateFormat(profile?.dateFormat ?? "YYYY-MM-DD");
      } catch {
        setPreferredDateFormat("YYYY-MM-DD");
      }
    }
    fetchProfile();
  }, []);

  // Prev / Next month
  function onPrevMonth() {
    setSelectedMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  }

  function onNextMonth() {
    setSelectedMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  }

  const summary = useMemo(() => {
    const totalBudget = budgets.reduce(
      (sum, b) => sum + Number(b?.amount || 0),
      0,
    );

    const totalSpent = budgets.reduce((sum, b) => {
      const spent = b?.spent ?? b?.usedAmount ?? 0;
      return sum + Number(spent || 0);
    }, 0);

    const remaining = totalBudget - totalSpent;

    return { totalBudget, totalSpent, remaining };
  }, [budgets]);

  async function handleDelete(id) {
    await deleteBudget(id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl px-8 py-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Budget</h1>
            <p className="text-stone-500 mt-1">
              Set and track your spending limits
            </p>
          </div>

          <Link
            href="/budgets/add"
            className="px-3 py-2 border border-green-300 text-green-700 rounded-lg bg-white hover:bg-green-100 hover:text-stone-700 font-medium transition cursor-pointer flex items-center justify-center gap-2"
          >
            <FaPlus />
            <span className="font-medium">Add Budget</span>
          </Link>
        </div>

        {/* Month Navigation: < January 2026 > */}
        <div className="mt-6">
          <MonthNavigation
            selectedMonth={selectedMonth}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
          />
        </div>

        <div className="w-full px-0 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BudgetSummaryBox
              title="Total Budget"
              amount={summary.totalBudget}
              type="budget"
            />
            <BudgetSummaryBox
              title="Total Spent"
              amount={summary.totalSpent}
              type="spent"
            />
            <BudgetSummaryBox
              title="Remaining"
              amount={summary.remaining}
              type="remaining"
            />
          </div>
        </div>

        {/* List budgets*/}
        <div className="mt-8">
          {budgets.length === 0 ? (
            <div className="text-center py-14 rounded-2xl border border-dashed border-stone-200">
              <p className="text-stone-600 font-medium">
                No budgets for{" "}
                {selectedMonth.toLocaleDateString("en-CA", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-stone-500 mt-1">
                Click <span className="font-semibold">Add Budget</span> to
                create one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((b, index) => (
                <BudgetItemCard
                  key={b.id}
                  budget={b}
                  index={index}
                  onDelete={handleDelete}
                  preferredDateFormat={preferredDateFormat}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
