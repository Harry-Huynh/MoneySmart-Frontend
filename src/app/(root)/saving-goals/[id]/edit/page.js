"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getOneSavingGoal, updateSavingGoal } from "@/lib/savingGoal.actions";

export default function EditSavingGoalPage() {
  const router = useRouter();
  const { id } = useParams();
  const [goal, setGoal] = useState(null);

  const progress = Math.round((goal?.currentAmount / goal?.targetAmount) * 100);

  useEffect(() => {
    async function fetchGoal() {
      const { savingGoal } = await getOneSavingGoal(id);
      savingGoal.targetDate = new Date(savingGoal.targetDate)
        .toISOString()
        .split("T")[0];
      setGoal(savingGoal);
    }
    fetchGoal();
  }, [id]);

  function handleChange(e) {
    setGoal({ ...goal, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await updateSavingGoal(
      id,
      goal?.targetAmount,
      goal?.purpose,
      goal?.targetDate,
      goal?.note,
      goal?.status,
    );
    router.push("/saving-goals");
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Back */}
      <Link
        href="/saving-goals"
        className="inline-flex items-center text-gray-700 mb-8 hover:text-black text-lg font-medium group"
      >
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">
          ←
        </span>{" "}
        {goal?.purpose}
      </Link>

      {/* Progress Section */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="relative h-3 bg-gray-300 rounded-full">
          <div
            className="absolute h-3 bg-yellow-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-center mt-4">
          <div className="bg-white rounded-full px-6 py-3 shadow-md border">
            <p className="text-xl font-bold text-center">{progress}%</p>
            <p className="text-sm text-gray-600 text-center">
              ${goal?.currentAmount} / ${goal?.targetAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Edit Saving Goal</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Target Amount */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium text-gray-700">
              Target Amount
            </label>
            <input
              type="number"
              name="targetAmount"
              value={goal?.targetAmount}
              onChange={handleChange}
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          {/* Purpose */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Purpose</label>
            <input
              type="text"
              name="purpose"
              value={goal?.purpose}
              onChange={handleChange}
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          {/* Target Date */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium text-gray-700">
              Target Date
            </label>
            <input
              type="date"
              name="targetDate"
              value={goal?.targetDate}
              onChange={handleChange}
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          {/* Note */}
          <div className="flex items-start gap-4">
            <label className="w-40 font-medium text-gray-700 pt-2">Note</label>
            <textarea
              name="note"
              value={goal?.note}
              onChange={handleChange}
              rows="4"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2 resize-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-2 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
