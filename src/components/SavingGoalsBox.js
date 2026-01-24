"use client";

import { useState } from "react";
import { MoreVertical, X, Calendar, Target, DollarSign, FileText, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function SavingGoalsBox({ goal, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  function cardColor() {
    if (goal.progress < 40) return "bg-orange-400";
    if (goal.progress < 80) return "bg-yellow-400";
    return "bg-green-400";
  }
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days left
  const calculateDaysLeft = () => {
    if (!goal.targetDate) return "-";
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : "Expired";
  };

   // Handle box click (excluding menu button)
  const handleBoxClick = (e) => {
    // Don't trigger if clicking on the menu button or dropdown
    if (e.target.closest('button[class*="p-1"]') || 
        e.target.closest('[class*="absolute top-12"]')) {
      return;
    }
    setShowInfoDialog(true);
  };

  // Handle overlay click (close dialog when clicking outside)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowInfoDialog(false);
    }
  };


  return (
    <div
      className={`relative min-h-45 w-full p-5
                  rounded-2xl shadow text-white
                  flex flex-col justify-between ${cardColor()}
                cursor-pointer hover:opacity-95 transition-opacity
                `}
                onClick={handleBoxClick}
    >
       {/* Menu */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{goal.purpose}</h3>
            <p className="text-sm opacity-90">{goal.progress}% complete</p>
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

           {/* Add Amount Button */}
          <button
            onClick={() => {
              setMenuOpen(false);
              // Add amount logic will go here
            }}
            className="block w-full px-4 py-2.5 hover:bg-gray-100 text-left cursor-pointer border-t border-gray-200"
          >
            Add Amount
          </button>

          

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
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span className="font-medium">{goal.progress}%</span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-2.5">
          <div
            className="bg-white h-2.5 rounded-full"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
      </div>


  {/* Info Dialog - Made Wider */}
      {showInfoDialog && (
       <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick} // Close when clicking on overlay
        >
                 <div 
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
          >
                  {/* Dialog Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    goal.progress < 40
                      ? "bg-orange-100 text-orange-800"
                      : goal.progress < 80
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    <span className="text-xl font-bold">{goal.progress}%</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{goal.purpose}</h2>
                    <p className="text-gray-500">Goal Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoDialog(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="p-6 space-y-6">
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
                      goal.progress < 40
                        ? "bg-orange-500"
                        : goal.progress < 80
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Financial Details Grid - Wider layout */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Target size={18} />
                    <span className="font-medium">Target Amount</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    ${goal.targetAmount?.toLocaleString() || "0"}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <DollarSign size={18} />
                    <span className="font-medium">Saved Amount</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    ${(
                      ((goal.targetAmount || 0) * goal.progress) / 100
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <DollarSign size={18} />
                    <span className="font-medium">Remaining</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    ${(
                      (goal.targetAmount || 0) * (1 - goal.progress / 100)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              {/* Timeline and Status Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Target Date Section */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-200 rounded-lg">
                      <Calendar size={20} className="text-amber-700" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Target Date</div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatDate(goal.targetDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Clock size={16} className="text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      {calculateDaysLeft()} days {calculateDaysLeft() === "Expired" ? "ago" : "left"}
                    </span>
                  </div>
                </div>

                {/* Status Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-indigo-200 rounded-lg">
                      <FileText size={20} className="text-indigo-700" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Status</div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-1 ${
                        goal.status === "ACTIVE"
                          ? "bg-blue-200 text-blue-800"
                          : goal.status === "ACHIEVED"
                          ? "bg-green-200 text-green-800"
                          : goal.status === "PAUSED"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}>
                        {goal.status || "ACTIVE"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {goal.status === "ACTIVE" ? "✓ Currently saving towards goal" :
                     goal.status === "ACHIEVED" ? "🎉 Goal achieved! Congratulations!" :
                     goal.status === "PAUSED" ? "⏸️ Saving paused temporarily" :
                     "✗ Goal cancelled"}
                  </div>
                </div>
              </div>

              {/* Note if available */}
              {goal.note && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gray-200 rounded-lg">
                      <FileText size={20} className="text-gray-700" />
                    </div>
                    <div className="font-medium text-gray-700">Additional Notes</div>
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
                  className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}