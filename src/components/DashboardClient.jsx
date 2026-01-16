"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import BalanceCard from "@/components/balanceCard";
import BudgetCard from "@/components/budgetCard";
import SavingGoalsCard from "@/components/savingGoalsCard";
import TransactionItem from "@/components/transactionItem";
import AddFundsModal from "@/components/AddFundsModal";

export default function DashboardClient({ dashboardMockData, userName }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAddFundsModalOpen = useMemo(() => {
    return searchParams.get("addFunds") === "1";
  }, [searchParams]);

  const openAddFundsModal = useCallback(() => {
    router.push("/dashboard?addFunds=1", { scroll: false });
  }, [router]);

  const closeAddFundsModal = useCallback(() => {
    router.push("/dashboard", { scroll: false });
  }, [router]);

  const handleDepositSubmit = useCallback(
    async (amountText) => {
      // Do later: call backend API: POST /deposit e.g
      // now: just close modal (UI demo)
      closeAddFundsModal();
    },
    [closeAddFundsModal]
  );

  return (
    <div className="w-full px-6 py-6">
      {/* Welcome header */}
      <div className="flex items-center justify-end mb-6">
        <p className="text-2xl font-semibold text-slate-700">
          Welcome back, <span className="text-slate-800">{userName}</span> 👋
        </p>
      </div>

      <h1 className="text-3xl font-semibold text-slate-800 mb-4">
        Current Balance
      </h1>

      <div className="mb-6">
        <BalanceCard
          balanceSummary={dashboardMockData.balance}
          onAddFundsClick={openAddFundsModal}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
        <BudgetCard budgetItems={dashboardMockData.budgets} />
        <SavingGoalsCard savingGoalItems={dashboardMockData.goals} />
      </div>

      <h2 className="text-xl font-semibold text-slate-700 mb-4">
        Recent Transactions
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {(dashboardMockData.recentTransactions || []).map(
          (singleTransaction) => (
            <TransactionItem
              key={singleTransaction.name}
              transactionItem={singleTransaction}
            />
          )
        )}
      </div>

      <AddFundsModal
        isOpen={isAddFundsModalOpen}
        onRequestClose={closeAddFundsModal}
        onSubmitDeposit={handleDepositSubmit}
      />
    </div>
  );
}
