"use client";

import { useRouter, useSearchParams } from "next/navigation";
import BalanceCard from "@/components/BalanceCard";
import BudgetCard from "@/components/BudgetCard";
import SavingGoalsCard from "@/components/SavingGoalsCard";
import DashboardTransactionCard from "./DashboardTransactionCard";

export default function DashboardClient({ dashboardMockData, name }) {
  const dashboardBudgets = dashboardMockData.budgets.map((b) => ({
    id: b.id,
    name: b.purpose,
    amount: Number(b.amount || 0),
    usedAmount: Number(b.usedAmount || 0),
  }));

  const dashboardSavingGoals = dashboardMockData.goals.map((g) => ({
    id: g.id,
    name: g.purpose,
    currentAmount: Number(g.currentAmount || 0),
    targetAmount: Number(g.targetAmount || 0),
    targetDate: g.targetDate,
  }));

  const dashboardTransactions = dashboardMockData.recentTransactions
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      type: t.type,
      category: t.category,
      amount: Number(t.amount || 0),
      date: t.date,
    }));

  return (
    <div className="w-full px-6 py-6">
      {/* Welcome header */}
      <div className="flex flex-col items-start justify-start mb-4 gap-1">
        <p className="text-3xl font-semibold text-slate-700">
          Welcome back, <span className="text-[#4f915f]">{name}</span> 👋
        </p>
        <p className="text-14 lg:text-16 font-normal text-slate-600">
          Access and manage your finances with ease
        </p>
      </div>

      <h1 className="text-3xl font-semibold text-slate-800 mb-4">
        Current Balance
      </h1>

      <div className="mb-6">
        <BalanceCard balanceSummary={dashboardMockData.balance} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
        <BudgetCard budgetItems={dashboardBudgets} />
        <SavingGoalsCard
          href="/saving-goals"
          savingGoalItems={dashboardSavingGoals}
        />
        <DashboardTransactionCard transactionItems={dashboardTransactions} />
      </div>
    </div>
  );
}
