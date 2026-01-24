"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatMoneyCAD, percent } from "@/lib/mock/budgets";
import DeleteBudgetAlert from "@/components/DeleteBudgetAlert";

export default function BudgetItemCard({ budget, index = 0, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <Card
        className={`relative w-full min-h-45 p-5 rounded-2xl shadow-md overflow-visible flex flex-col justify-between text-white cursor-pointer ${bg}`}
        onClick={() => setOpenDetails(true)}
      >
        <div className="flex items-start justify-between gap-2">
          {/* Header */}
          <div>
            <h3 className="text-xl font-bold leading-tight">{budget.purpose}</h3>
            <p className="text-sm opacity-90">{p}% used</p>
          </div>
        </div>
        
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
            className="absolute top-10 right-3 bg-white text-black rounded-lg shadow-lg text-sm z-10 min-w-36 border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/budgets/${budget.id}/edit`}
              className="block w-full px-4 py-2.5 hover:bg-gray-100 text-left"
              onClick={closeMenu}
            >
              Edit
            </Link>

            <DeleteBudgetAlert
              budgetName={budget.purpose}
              onConfirm={async () => {
                closeMenu();
                await onDelete?.(budget.id);
              }}
              onOpenChange={(open) => {
                if (open) setTimeout(closeMenu, 10000);
              }}
            >
              <button
                  type="button"
                  className="
                    block w-full px-4 py-2.5 text-red-600 hover:bg-red-50 text-left border-t border-gray-200 cursor-pointer"
                >
                  Delete
                </button>
              </DeleteBudgetAlert>
          </div>
        )}

        {/* Content */}
        {/* Bottom progress area (like Saving Goals) */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm opacity-95">
            <span>Progress</span>

            <span className="text-xs opacity-90">
              {formatMoneyCAD(budget.spent)} / {formatMoneyCAD(budget.amount)}
            </span>

            <span>{p}%</span>
          </div>

          <div className="mt-2 w-full bg-white/30 rounded-full h-2.5">
            <div
              className="bg-white h-2.5 rounded-full"
              style={{ width: `${p}%` }}
            />
          </div>
        </div>

      </Card>
      {/* Details dialog (read-only) */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Budget Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <strong>Purpose:</strong> {budget.purpose}
            </p>
            <p>
              <strong>Amount:</strong> {formatMoneyCAD(budget.amount)}
            </p>
            <p>
              <strong>Spent:</strong> {formatMoneyCAD(budget.spent)}
            </p>
            {"thresholdAmount" in budget && budget.thresholdAmount !== "" && budget.thresholdAmount != null ? (
              <p>
                <strong>Threshold Amount:</strong>{" "}
                {formatMoneyCAD(budget.thresholdAmount)}
              </p>
            ) : null}
            {"startDate" in budget && budget.startDate ? (
              <p>
                <strong>Start Date:</strong> {String(budget.startDate).slice(0, 10)}
              </p>
            ) : null}
            {"note" in budget && budget.note ? (
              <p>
                <strong>Note:</strong> {budget.note}
              </p>
            ) : null}
            <p>
              <strong>Usage:</strong> {p}%
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
