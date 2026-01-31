"use client";

import { FaRegMoneyBillAlt, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatMoneyCAD } from "@/lib/mock/budgets";

function getStyle(type) {
  // style giống transactions (3 màu nhẹ + icon tròn)
  if (type === "budget") {
    return {
      wrapper: "bg-sky-50",
      iconWrap: "bg-sky-100 text-sky-700",
      Icon: FaRegMoneyBillAlt,
      amountClass: "text-stone-900",
    };
  }

  if (type === "spent") {
    return {
      wrapper: "bg-rose-50",
      iconWrap: "bg-rose-100 text-rose-700",
      Icon: FaArrowDown,
      amountClass: "text-rose-700",
    };
  }

  // remaining
  return {
    wrapper: "bg-emerald-50",
    iconWrap: "bg-emerald-100 text-emerald-700",
    Icon: FaArrowUp,
    amountClass: "text-emerald-700",
  };
}

export default function BudgetSummaryBox({ title, amount, type = "budget" }) {
  const { wrapper, iconWrap, Icon, amountClass } = getStyle(type);

  return (
    <div
      className={`${wrapper} rounded-xl px-5 py-4 shadow-sm border border-black/5 flex items-center justify-between`}
    >
      <div>
        <p className="text-stone-600 text-sm mb-1">{title}</p>
        <p className={`text-2xl font-bold ${amountClass}`}>
          {formatMoneyCAD(amount)}
        </p>
      </div>

      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconWrap}`}>
        <Icon size={22} />
      </div>
    </div>
  );
}
