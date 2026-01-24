"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

export default function SavingGoalsBox({ goal, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function cardColor() {
    if (goal.progress < 40) return "bg-orange-400";
    if (goal.progress < 80) return "bg-yellow-400";
    return "bg-green-400";
  }

  return (
    <div
      className={`relative min-h-45 w-full p-5
                  rounded-2xl shadow text-white
                  flex flex-col justify-between ${cardColor()}`}
    >
      {/* Menu */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">{goal.purpose}</h3>
          <p className="text-sm opacity-90">{goal.progress}% complete</p>
        </div>

        <button
          className="p-1 hover:bg-white/20 rounded-lg transition cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute top-12 right-2 bg-white text-black rounded-lg shadow-lg text-sm z-10 min-w-30 border border-gray-200 overflow-hidden">
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
    </div>
  );
}
