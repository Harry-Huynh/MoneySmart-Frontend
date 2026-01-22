"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import SavingGoalsBox from "@/components/SavingGoalsBox";
import SavingGoalModal from "@/components/SavingGoalsModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

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

  // 🔹 Load goals from backend
  useEffect(() => {
    async function fetchGoals() {
      const res = await fetch("/api/saving-goals"); // backend later
      const data = await res.json();
      setGoals(data);
    }
    fetchGoals();
  }, []);

  // 🔹 Update goal
  const saveGoal = async (goal) => {
    await fetch(`/api/saving-goals/${goal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal),
    });

    setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
    setShowForm(false);
  };

  // 🔹 Delete goal
  const deleteGoal = async () => {
    await fetch(`/api/saving-goals/${activeGoal.id}`, {
      method: "DELETE",
    });

    setGoals((prev) => prev.filter((g) => g.id !== activeGoal.id));
    setShowDelete(false);
  };

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Logo />
        </div>

        <h1 className="text-2xl font-bold mb-6">Saving Goals</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
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
            className="aspect-square max-w-45 w-full rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-3xl hover:border-green-500 hover:text-green-500 transition"
          >
            +
          </Link>
        </div>
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
