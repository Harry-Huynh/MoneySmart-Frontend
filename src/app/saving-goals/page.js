"use client";

import { useState } from "react";
import Link from "next/link";
import SavingGoalCard from "@/components/SavingGoalsBox";
import SavingGoalModal from "@/components/SavingGoalsModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import Logo from "@/components/Logo";

export default function SavingGoalsPage() {
  const [goals, setGoals] = useState([
    { id: 1, title: "Vacation - New York", progress: 35 },
    { id: 2, title: "Replace old laptop", progress: 70 },
    { id: 3, title: "Buy headphones", progress: 50 },
    { id: 4, title: "Buy winter coat", progress: 90 },
  ]);

  const [activeGoal, setActiveGoal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  function saveGoal(goal) {
    if (goal.id) {
      setGoals(goals.map((g) => (g.id === goal.id ? goal : g)));
    } else {
      setGoals([...goals, { ...goal, id: Date.now() }]);
    }
    setShowForm(false);
  }

  function deleteGoal() {
    setGoals(goals.filter((g) => g.id !== activeGoal.id));
    setShowDelete(false);
  }

  return (
    <section className="min-h-screen px-6 py-10 bg-gray-50">
      
      <h1 className="text-2xl font-bold mb-6">Saving Goals</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {goals.map((goal) => (
          <SavingGoalCard
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

        {/* Add Goal */}
        <Link
          href="/saving-goals/add"
          className="rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-green-600 transition"
        >
          <span className="text-4xl text-gray-400">+</span>
        </Link>
      </div>

      {showForm && (
        <SavingGoalModal
          goal={activeGoal}
          onClose={() => setShowForm(false)}
          onSave={saveGoal}
        />
      )}

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
