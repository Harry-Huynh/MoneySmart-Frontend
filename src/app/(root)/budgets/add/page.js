"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addBudget } from "@/lib/budget.actions";
import Image from "next/image";

export default function AddBudgetPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    amount: "",
    purpose: "",
    startDate: "",
    thresholdAmount: "80",
    note: "",
  });

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await addBudget(
        form.amount,
        form.purpose,
        form.startDate,
        form.thresholdAmount,
        form.note,
      );
      router.replace("/budgets");
    } catch (error) {
      console.log(error);
      alert(error.message || "Failed to create budget");
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-8">
      <Link
        href="/budgets"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-xl cursor-pointer"
      >
        ← Add Budget
      </Link>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-md overflow-hidden mt-6 relative">
        {/* purple header */}
        <div className="bg-linear-to-r from-purple-200 to-purple-300 px-8 py-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">New Budget</h2>
        </div>

        {/* pig overlay */}
        <Image
          src="/pig-icon.png"
          alt="Piggy"
          className="absolute top-0 w-64 h-auto"
        />

        {/* form */}
        <form onSubmit={onSubmit} className="p-10 pt-16 space-y-6">
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Amount:</label>
            <input
              type="number"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              value={form.amount}
              onChange={(e) => updateField("amount", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Purpose:</label>
            <input
              type="text"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              value={form.purpose}
              onChange={(e) => updateField("purpose", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Start Date:</label>
            <input
              type="date"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Threshold Amount:</label>
            <input
              type="number"
              min="0"
              max="100"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              value={form.thresholdAmount}
              onChange={(e) => updateField("thresholdAmount", e.target.value)}
              required
            />
          </div>

          <div className="flex items-start gap-4">
            <label className="w-40 font-medium pt-2">Note:</label>
            <textarea
              rows="4"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2 resize-none"
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold cursor-pointer transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
