"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import { MdSaveAlt } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import TransactionSummaryCard from "@/components/TransactionSummaryBox";
import TransactionSegmentedFilter from "@/components/TransactionSegmentedFilter";
import TransactionItemRow from "@/components/TransactionItemRow";
import { groupByDay } from "@/lib/utils";
import {
  getAllTransactions,
  deleteTransaction,
} from "@/lib/transaction.actions";

export default function TransactionsPage() {
  const [filter, setFilter] = useState("All"); // State for the Segmented Filter
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getAllTransactions(null);
      setAllTransactions(res.transactions || []);
    }

    fetchData().catch(console.error);
  }, []);

  const summary = useMemo(() => {
    const income = allTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const expense = allTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const currentBalance = income - expense;

    return { income, expense, currentBalance };
  }, [allTransactions]);

  // Cards needed for 3 summary boxes
  const cards = [
    {
      title: "Current Balance",
      amount: summary.currentBalance,
      summaryType: "All",
    },
    {
      title: "Total Income",
      amount: summary.income,
      summaryType: "Income",
    },
    {
      title: "Total Expense",
      amount: -summary.expense,
      summaryType: "Expense",
    },
  ];

  const visibleTransactions = useMemo(() => {
    if (filter === "All") return allTransactions;
    if (filter === "Income")
      return allTransactions.filter((t) => t.type === "INCOME");
    if (filter === "Expense")
      return allTransactions.filter((t) => t.type === "EXPENSE");
    return allTransactions;
  }, [allTransactions, filter]);

  // Group by date label
  const groupedByLabel = useMemo(() => {
    const sorted = [...visibleTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    return groupByDay(sorted);
  }, [visibleTransactions]);

  // Delete transaction
  async function handleDeleteTransaction(id) {
    await deleteTransaction(id);
    setAllTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex flex-col gap-2">
        <div className="w-full px-8 py-6 flex flex-wrap justify-between items-center">
          <div className="">
            <h1 className="text-2xl font-bold mb-1">Transactions</h1>
            <p className="text-sml text-gray-500">
              Manage and review your transactions
            </p>
          </div>
          <div className="w-full grid grid-cols-2 gap-4 mt-2 md:mt-0 md:w-auto">
            <button className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-200 font-medium transition cursor-pointer flex items-center justify-center gap-2">
              <MdSaveAlt size={18} /> Export
            </button>
            <Link
              href="/transactions/add"
              className="px-3 py-2 border border-green-300 text-green-700 rounded-lg bg-white hover:bg-green-100 hover:text-stone-700 font-medium transition cursor-pointer flex items-center justify-center gap-2"
            >
              <FaPlus size={18} /> Add Transaction
            </Link>
          </div>
        </div>
        <div className="w-full px-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <TransactionSummaryCard
              key={c.title}
              title={c.title}
              amount={c.amount}
              summaryType={c.summaryType}
            />
          ))}
        </div>
        <TransactionSegmentedFilter value={filter} onChange={setFilter} />

        <div className="w-full px-3 pb-5">
          {groupedByLabel.length === 0 ? (
            <div className="mx-5 mt-4 px-6 py-10 text-center bg-gray-50 rounded-xl border border-dashed">
              <p className="text-gray-500 text-sm">No transactions found.</p>
            </div>
          ) : (
            groupedByLabel.map(([label, txs]) => (
              <div key={label} className="px-6 select-none">
                <p className="text-gray-500 text-sm pt-5 pb-2">{label}</p>
                {txs.map((tx) => (
                  <TransactionItemRow
                    key={tx.id}
                    transaction={tx}
                    onDelete={handleDeleteTransaction}
                  />
                ))}
              </div>
            ))
          )}
          {}
        </div>
      </div>
    </section>
  );
}
