"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreVertical,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatMoneyCAD, percent } from "@/lib/mock/budgets";
import DeleteBudgetAlert from "@/components/DeleteBudgetAlert";
import { returnDayInPreferredFormat } from "@/lib/utils";


export default function BudgetItemCard({ budget, index = 0, onDelete, preferredDateFormat }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const rawPercent =
  budget.amount > 0 ? (budget.usedAmount / budget.amount) * 100 : 0;

const fillPercent = Math.min(rawPercent, 100);

const overspent = Math.max(budget.usedAmount - budget.amount, 0);


  // Calculate days left if endDate exists
  const calculateDaysLeft = () => {
    if (!budget.endDate) return null;
    const endDate = new Date(budget.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft();

  function getBudgetColor(percent) {
  if (percent >= 100) return "bg-red-500";        
  if (percent >= 90)  return "bg-orange-600";     
  if (percent >= 70)  return "bg-orange-400";     
  if (percent >= 50)  return "bg-yellow-400";    
  if (percent >= 30)  return "bg-lime-400";       
  return "bg-green-500";                          
}
  
const bg = getBudgetColor(rawPercent);
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
            <h3 className="text-xl font-bold leading-tight">
              {budget.purpose}
            </h3>
            <p className="text-sm opacity-90">{rawPercent.toFixed(2)}% used</p>
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
            className="absolute top-12 right-2 bg-white text-black rounded-lg shadow-lg text-sm z-10 min-w-30 border border-gray-200 overflow-hidden"
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
                className="block w-full px-4 py-2.5 text-red-600 hover:bg-gray-100 text-left rounded-b-lg border-t border-gray-200 cursor-pointer"
              >
                Delete
              </button>
            </DeleteBudgetAlert>
          </div>
        )}

        {/* Content */}
        {/* Bottom progress area (like Saving Goals) */}
        <div className="mt-6 space-y-2">
  <div className="flex items-center justify-between text-sm opacity-95">
    <span>Progress</span>

    <span className="text-xs opacity-90 tabular-nums">
      {formatMoneyCAD(budget.usedAmount)} / {formatMoneyCAD(budget.amount)}
    </span>
  </div>

  {overspent > 0 && (
    <div className="flex items-center justify-between">
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
        Overspent {formatMoneyCAD(overspent)}
      </span>
    </div>
  )}

  <div className="w-full bg-white/30 rounded-full h-2.5">
    <div
      className="bg-white h-2.5 rounded-full"
      style={{ width: `${fillPercent}%` }}
    />
  </div>
</div>
      </Card>

      {/* Details dialog (read-only) */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent
          showCloseButton={false}
          className="p-0 rounded-2xl shadow-xl max-w-2xl! w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Percent Circle */}
<div
  className={`shrink-0 w-20 h-16 rounded-full flex flex-col items-center justify-center
  ${
    rawPercent >= 100 ? "bg-red-100 text-red-800"
    : rawPercent >= 90 ? "bg-orange-100 text-orange-800"
    : rawPercent >= 70 ? "bg-orange-100 text-orange-700"
    : rawPercent >= 50 ? "bg-yellow-100 text-yellow-800"
    : rawPercent >= 30 ? "bg-lime-100 text-lime-800"
    : "bg-green-100 text-green-800"
  }`}
>
  <span className="text-lg font-bold leading-none">
    {rawPercent.toFixed(0)}%
  </span>

  {rawPercent > 100 && (
    <span className="text-[13px] font-semibold opacity-80">
      +{(rawPercent - 100).toFixed(0)}%
    </span>
  )}
</div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
                    {budget.purpose}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Budget Details</p>
                </div>
              </div>
            </div>
          </div>

          {/* Body (scroll) */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Progress */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <TrendingUp size={18} />
                Progress Overview
              </h3>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
  className={`h-3 rounded-full ${rawPercent >= 100 ? "bg-red-500" : rawPercent >= 80 ? "bg-orange-500" : "bg-green-500"}`}
  style={{ width: `${fillPercent}%` }}
/>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-2">
  {formatMoneyCAD(budget.usedAmount)} spent
  {overspent > 0 && (
    <span className="text-xs font-semibold text-red-500">
      (Overspent {formatMoneyCAD(overspent)})
    </span>
  )}
</span>
                <span>{formatMoneyCAD(budget.amount)} total</span>
              </div>
            </div>

            {/* Main grid like your generated budget image */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <DollarSign size={18} />
                  <span className="font-medium">Budget Amount</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 tabular-nums">
                  {formatMoneyCAD(budget.amount)}
                </div>
              </div>

              <div className="bg-linear-to-br from-amber-50 to-amber-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <DollarSign size={18} />
                  <span className="font-medium">Threshold</span>
                </div>
                <div className="text-2xl font-bold text-amber-700 tabular-nums">
                  {"thresholdAmount" in budget &&
                  budget.thresholdAmount !== "" &&
                  budget.thresholdAmount != null
                    ? formatMoneyCAD(budget.thresholdAmount)
                    : "—"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-linear-to-br from-purple-50 to-purple-100 p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-200 rounded-lg">
                    <Calendar size={20} className="text-purple-700" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Start Date</div>
                    <div className="text-lg font-bold text-gray-800">
                     {"startDate" in budget && budget.startDate
  ? returnDayInPreferredFormat(budget.startDate, preferredDateFormat)
  : "Not set"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-200 rounded-lg">
                    <Calendar size={20} className="text-indigo-700" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">End Date</div>
                    <div className="text-lg font-bold text-gray-800">
                      {"endDate" in budget && budget.endDate
  ? returnDayInPreferredFormat(budget.endDate, preferredDateFormat)
  : "Not set"}
                    </div>
                    {daysLeft !== null && budget.endDate && (
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={16} className="text-indigo-600" />
                        <span
                          className={`text-sm font-medium ${daysLeft <= 0 ? "text-red-600" : "text-indigo-700"}`}
                        >
                          {daysLeft <= 0
                            ? "Expired"
                            : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-linear-to-br from-gray-50 to-gray-100 p-5 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <FileText size={20} className="text-gray-700" />
                </div>
                <div className="font-medium text-gray-700">
                  Additional Notes
                </div>
              </div>

              <div className="text-gray-700 whitespace-pre-wrap bg-white/70 p-4 rounded-lg border border-gray-200">
                {"note" in budget && budget.note ? budget.note : "—"}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setOpenDetails(false)}
                className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
