"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatMoneyCAD, percent } from "@/lib/mock/budgets";
import DeleteBudgetAlert from "@/components/DeleteBudgetAlert";

export default function BudgetItemCard({ budget, index = 0, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const p = percent(budget.spent, budget.amount);

  const colorByIndex = [
    "bg-orange-400",
    "bg-yellow-400",
    "bg-yellow-400",
    "bg-green-400",
  ];
  const bg = colorByIndex[index % colorByIndex.length];

  function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((v) => !v);
  }

  return (
    <Link href={`/budgets/${budget.id}/edit`} className="block">
      <Card
        className={[
          "relative w-[190px] h-[190px] rounded-2xl shadow-md overflow-visible",
          "text-white select-none",
          "cursor-pointer",
          bg,
        ].join(" ")}
      >
        {/* 3 dots - move up a bit */}
        <button
          type="button"
          className="absolute top-1.5 right-2.5 p-2.5 rounded-xl hover:bg-white/20 transition cursor-pointer"
          onClick={toggleMenu}
          aria-label="Budget options"
        >
          <MoreVertical size={22} />
        </button>

        {/* Dropdown (Delete only) - show to the RIGHT of the dots */}
        {menuOpen && (
          <div
            className="absolute top-11 right-2.5 z-20"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="bg-white text-slate-900 rounded-xl border border-black/10 shadow-lg overflow-hidden w-fit">
              <DeleteBudgetAlert
                budgetName={budget.purpose}
                onConfirm={() => onDelete(budget.id)}
                onOpenChange={(open) => {
                  // when dialog opens, close the dropdown so it doesn't block
                }}
              >
                <button
                  type="button"
                  className="
                    inline-block
                    px-4 py-2
                    text-left
                    cursor-pointer
                    rounded-md
                    text-slate-900
                    hover:bg-red-50 hover:text-red-600
                    active:bg-red-100
                    transition-colors duration-200
"

                >
                  Delete
                </button>
              </DeleteBudgetAlert>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="h-full w-full flex flex-col items-center justify-center px-4">
          <div className="text-3xl font-bold leading-none">{p}%</div>

          <div className="mt-3 text-sm font-medium text-center leading-tight">
            {budget.purpose}
          </div>

          <div className="mt-3 text-xs text-center opacity-95">
            {formatMoneyCAD(budget.spent)} / {formatMoneyCAD(budget.amount)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
