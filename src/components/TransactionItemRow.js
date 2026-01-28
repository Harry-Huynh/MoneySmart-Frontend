import { formatMoneyCAD } from "@/lib/mock/budgets";
import React from "react";
import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";

export default function TransactionItemRow({ transaction }) {
  const isIncome = transaction.type === "INCOME";

  return (
    <div
      className={`w-full py-2 flex items-center justify-between border-b border-gray-100 gap-4 select-none`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${isIncome ? "bg-green-100" : "bg-red-100"}`}
      >
        {isIncome ? (
          <FiArrowUpRight className="text-green-700 text-xl" />
        ) : (
          <FiArrowDownLeft className="text-red-700" />
        )}
      </div>
      <div className="flex-1">
        <div className="text-gray-700 font-semibold">
          {transaction.category}
        </div>
        <div className="text-gray-400 text-xs font-semibold">
          {transaction.note}
        </div>
      </div>
      <span
        className={`text-gray-700 font-semibold ${isIncome ? "text-green-700" : "text-red-700"}`}
      >
        {(isIncome ? "+" : "-") + formatMoneyCAD(transaction.amount)}
      </span>
    </div>
  );
}
