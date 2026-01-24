"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SavingGoalsBox from "@/components/SavingGoalsBox";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { deleteSavingGoal, getAllSavingGoals } from "@/lib/savingGoal.actions";

export default function SavingGoalsPage() {
  const [goals, setGoals] = useState([   
    { id: 1, purpose: "Vacation - New York", progress: 35 },
    { id: 2, purpose: "Replace old laptop", progress: 70 },
    { id: 3, purpose: "Buy headphones", progress: 50 },
    { id: 4, purpose: "Buy winter coat", progress: 90 },
  ]);
  const [activeGoal, setActiveGoal] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    async function fetchGoals() {
      const { savingGoals } = await getAllSavingGoals();
      setGoals(savingGoals);
    }
    fetchGoals();
  }, []);

  // Delete goal
  const deleteGoal = async () => {
    await deleteSavingGoal(activeGoal.id);

    setGoals((prev) => prev.filter((g) => g.id !== activeGoal.id));
    setShowDelete(false);
  };

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
         
        </div>

        <h1 className="text-2xl font-bold mb-6">Saving Goals</h1>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <SavingGoalsBox
              key={goal.id}
              goal={goal}
              onEdit={() => {
                setActiveGoal(goal);
                setShowForm(true);
              }}
              onDelete={() => {
                setActiveGoal(goal);
                setShowDelete(true);
              }}
            />
          ))}

          {/* ➕ Add Goal */}
            <Link
            href="/saving-goals/add"
            className="min-h-[180px] rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-4xl hover:border-green-500 hover:text-green-500 transition cursor-pointer p-6"
          >
            +
          </Link>
        </div>
      </div>

     

      {showDelete && (
        <ConfirmDeleteModal
          title={activeGoal.title}
          onCancel={() => setShowDelete(false)}
          onConfirm={deleteGoal}
        />
      )}
    </section>
  );
}
