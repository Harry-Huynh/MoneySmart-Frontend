import { formatMoneyCAD } from "@/lib/mock/budgets";
import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { FiArrowDownLeft } from "react-icons/fi";

export default function TransactionSummaryCard({
  title,
  amount,
  summaryType = "currentBalance",
}) {
  const summaryTypes = {
    currentBalance: {
      textColor: "text-stone-700",
      bgColor: "bg-sky-50",
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-700",
      icon: FaArrowTrendUp,
    },
    Income: {
      textColor: "text-green-700",
      bgColor: "bg-emerald-50",
      iconBgColor: "bg-green-100",
      iconColor: "text-green-700",
      icon: FiArrowUpRight,
    },
    Expense: {
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      iconBgColor: "bg-red-100",
      iconColor: "text-red-700",
      icon: FiArrowDownLeft,
    },
  };

  const s = summaryTypes[summaryType] ?? summaryTypes.currentBalance;
  const Icon = s.icon;
  return (
    <div
      className={`w-full px-5 py-3 rounded-sm shadow-md flex gap-4 justify-between items-center ${s.bgColor} select-none`}
    >
      <div>
        <p className="text-lg text-stone-600">{title}</p>
        <p className={`text-2xl ${s.textColor} font-semibold`}>
          {formatMoneyCAD(amount)}
        </p>
      </div>
      <div
        className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${s.iconBgColor}`}
      >
        <Icon className={`text-2xl ${s.iconColor}`} />
      </div>
    </div>
  );
}
