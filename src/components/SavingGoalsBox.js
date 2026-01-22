"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

export default function SavingGoalsBox({ goal, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function cardColor() {
    if (goal.progress < 40) return "bg-orange-400";
    if (goal.progress < 80) return "bg-yellow-400";
    return "bg-green-400";
  }

  return (
    <div
      className={`relative aspect-square max-w-[180px] w-full p-4
                  rounded-2xl shadow text-white
                  flex flex-col justify-between ${cardColor()}`}
    >
      {/* Menu */}
      <button
        className="absolute top-2 right-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <MoreVertical size={18} />
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute top-8 right-2 bg-white text-black rounded-lg shadow text-sm z-10">
          <Link
            href={`/saving-goals/${goal.id}/edit`}
            className="block px-3 py-1.5 hover:bg-gray-100"
          >
            Edit
          </Link>

          <button
            onClick={onDelete}
            className="block w-full px-3 py-1.5 text-red-600 hover:bg-gray-100 text-left"
          >
            Delete
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-1">
        <p className="text-2xl font-bold">{goal.progress}%</p>
        <p className="mt-2 text-xs text-center leading-tight">
          {goal.title}
        </p>
      </div>
    </div>
  );
}
