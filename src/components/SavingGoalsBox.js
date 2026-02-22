"use client";

import { useState } from "react";
import {
  MoreVertical,
  Calendar,
  Target,
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatCurrencyCAD } from "@/lib/utils";
import { returnDayInPreferredFormat } from "@/lib/utils";

export default function SavingGoalsBox({
  goal,
  onDelete,
  preferredDateFormat,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const rawPercent =
    goal?.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  const progressBar = Math.min(Math.max(rawPercent, 0), 100); // keep bar capped at 100

  const exceededAmount = Math.max(
    (goal.currentAmount || 0) - (goal.targetAmount || 0),
    0,
  );
  const percentColor =
    rawPercent >= 100
      ? "bg-emerald-600"
      : rawPercent >= 80
        ? "bg-lime-500"
        : rawPercent >= 50
          ? "bg-amber-500"
          : "bg-orange-500";

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return returnDayInPreferredFormat(dateString, preferredDateFormat);
  };

  // Calculate days left
  const calculateDaysLeft = () => {
    if (!goal?.targetDate) return null;

    const [y, m, d] = goal.targetDate.split("T")[0].split("-").map(Number);
    const target = new Date(y, m - 1, d);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : "Expired";
  };

  return (
    <div
      className={`relative min-h-45 w-full p-5
                  rounded-2xl shadow text-white
                  flex flex-col justify-between ${percentColor}
                cursor-pointer hover:opacity-95 transition-opacity
                `}
      onClick={() => setShowInfoDialog(true)}
    >
      {/* Menu */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">{goal.purpose}</h3>
          <p className="text-sm opacity-90">
            {rawPercent.toFixed(2)}% complete
          </p>
        </div>

        <button
          className="p-1 hover:bg-white/20 rounded-lg transition cursor-pointer z-10"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering box click
            setMenuOpen(!menuOpen);
          }}
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <div
          className="absolute top-12 right-2 bg-white text-black rounded-lg shadow-lg text-sm z-20 min-w-30 border border-gray-200 overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Prevent triggering box click
        >
          <Link
            href={`/saving-goals/${goal.id}/edit`}
            onClick={() => setMenuOpen(false)}
            className="block w-full px-4 py-2.5 hover:bg-gray-100 text-left"
          >
            Edit
          </Link>

          <button
            onClick={() => {
              onDelete();
              setMenuOpen(false);
            }}
            className="block w-full px-4 py-2.5 text-red-600 hover:bg-gray-100 text-left rounded-b-lg border-t border-gray-200 cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-sm opacity-95">
          <span>Progress</span>

          <span className="text-xs opacity-90 tabular-nums">
            {formatCurrencyCAD(goal.currentAmount)} /{" "}
            {formatCurrencyCAD(goal.targetAmount)}
          </span>
        </div>

        {exceededAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
              Exceeded {formatCurrencyCAD(exceededAmount)}
            </span>
          </div>
        )}

        <div className="w-full bg-white/30 rounded-full h-2.5">
          <div
            className="bg-white h-2.5 rounded-full"
            style={{ width: `${progressBar}%` }}
          />
        </div>
      </div>
      {/* Info Dialog - Made Wider */}
      {showInfoDialog && (
        <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
          <DialogContent
            showCloseButton={false}
            className="p-0 rounded-2xl shadow-xl max-w-2xl! w-full max-h-[92vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header - Fixed with better layout */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Percentage Circle - Now with dynamic sizing */}
                  <div
                    className={`shrink-0 w-20 h-16 rounded-full flex flex-col items-center justify-center
  ${
    rawPercent >= 100
      ? "bg-emerald-100 text-emerald-800"
      : rawPercent >= 80
        ? "bg-lime-100 text-lime-800"
        : rawPercent >= 50
          ? "bg-amber-100 text-amber-800"
          : "bg-orange-100 text-orange-800"
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

                  {/* Title Section - Now with truncation */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
                      {goal.purpose}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Goal Details</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="p-6 pt-0 space-y-6">
              {/* Progress Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Progress Overview
                  </h3>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      rawPercent >= 100
                        ? "bg-emerald-500"
                        : rawPercent >= 80
                          ? "bg-lime-500"
                          : rawPercent >= 50
                            ? "bg-amber-500"
                            : "bg-orange-500"
                    }`}
                    style={{ width: `${progressBar}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    {formatCurrencyCAD(goal.currentAmount)} saved
                    {exceededAmount > 0 && (
                      <span className="text-emerald-700 font-semibold">
                        (Exceeded {formatCurrencyCAD(exceededAmount)})
                      </span>
                    )}
                  </span>
                  <span>{formatCurrencyCAD(goal.targetAmount)} target</span>
                </div>
              </div>

              {/* Financial Details Grid - Wider layout */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Target size={18} />
                    <span className="font-medium">Target Amount</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {formatCurrencyCAD(
                      goal.targetAmount?.toLocaleString() || Number("0"),
                    )}
                  </div>
                </div>

                <div className="bg-linear-to-br from-green-50 to-green-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <DollarSign size={18} />
                    <span className="font-medium">Saved Amount</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrencyCAD(
                      goal.currentAmount?.toLocaleString() || Number("0"),
                    )}
                  </div>
                </div>

                <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <DollarSign size={18} />
                    <span className="font-medium">Remaining</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {formatCurrencyCAD(
                      Math.max(
                        (goal.targetAmount || 0) - (goal.currentAmount || 0),
                        0,
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline Section - Full width since status removed */}
              <div className="grid grid-cols-1 gap-6">
                {/* Target Date Section - Now full width */}
                <div className="bg-linear-to-br from-amber-50 to-amber-100 p-5 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-200 rounded-lg">
                      <Calendar size={20} className="text-amber-700" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">
                        Target Date
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatDate(goal.targetDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Clock size={16} className="text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      {calculateDaysLeft()} days{" "}
                      {calculateDaysLeft() === "Expired" ? "ago" : "left"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Note if available */}
              {goal.note && (
                <div className="bg-linear-to-br from-gray-50 to-gray-100 p-5 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gray-200 rounded-lg">
                      <FileText size={20} className="text-gray-700" />
                    </div>
                    <div className="font-medium text-gray-700">
                      Additional Notes
                    </div>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap bg-white/50 p-4 rounded-lg border border-gray-200">
                    {goal.note}
                  </div>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowInfoDialog(false)}
                  className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
