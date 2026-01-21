"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

import Link from "next/link";

export default function SavingGoalCard({ goal, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function cardColor() {
    if (goal.progress < 40) return "bg-orange-400";
    if (goal.progress < 80) return "bg-yellow-400";
    return "bg-green-400";
  }

  return (
    <div className={`relative p-6 rounded-xl shadow-md text-white ${cardColor()}`}>
      <button
        className="absolute top-3 right-3"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <MoreVertical />
      </button>

      {menuOpen && (
        <div className="absolute top-10 right-3 bg-white text-black rounded shadow text-sm z-10">
        
            <Link href={`/saving-goals/${goal.id}/edit`}
            className="rounded-xl  border-gray-300 flex items-center justify-center hover:border-green-600 transition">
              Edit
         </Link>
            
          
          <button
            onClick={onDelete}
            className="block w-full px-4 py-2 text-red-600 hover:bg-gray-100 text-left"
          >
            Delete
          </button>
        </div>
      )}

      <p className="text-3xl font-bold">{goal.progress}%</p>
      <p className="mt-2 font-medium">{goal.title}</p>
    </div>
  );
}
