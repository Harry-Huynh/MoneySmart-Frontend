"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AddSavingGoalPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    amount: "",
    purpose: "",
    date: "",
    note: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // later: POST to API
    console.log("Saving goal:", form);

    router.push("/saving-goals");
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Back */}
      <Link
        href="/saving-goals"
        className="flex items-center text-gray-600 mb-6 hover:text-black"
      >
        ← Add Saving Goal
      </Link>

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-200 to-purple-300 px-8 py-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            New Saving Goal
          </h2>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          {/* Left Icon */}
          <div className="flex justify-center items-start">
            <Image
              src="/pig-icon.png"
              alt="Saving Icon"
              width={220}
              height={220}
              priority
            />
          </div>

          {/* Form Fields */}
          <div className="md:col-span-2 space-y-5">
            {/* Target Amount */}
            <div className="flex items-center gap-4">
              <label className="w-32 text-gray-700 font-medium">
                Target Amount:
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="$"
                required
                className="flex-1 bg-yellow-50 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Purpose */}
            <div className="flex items-center gap-4">
              <label className="w-32 text-gray-700 font-medium">
                Purpose:
              </label>
              <input
                type="text"
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                required
                className="flex-1 bg-yellow-50 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Target Date */}
            <div className="flex items-center gap-4">
              <label className="w-32 text-gray-700 font-medium">
                Target Date:
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="flex-1 bg-yellow-50 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Note */}
            <div className="flex items-start gap-4">
              <label className="w-32 text-gray-700 font-medium pt-2">
                Note:
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows="4"
                placeholder="Upgrade to a new MacBook for better performance."
                className="flex-1 bg-yellow-50 border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
