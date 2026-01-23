"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";

export default function AddSavingGoalPage() {
  const router = useRouter();
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      purpose: "",
      date: "",
      note: "",
    },
  });

  const submitForm = async (data) => {
    setLoading(true);

    try {
      // 🔹 later: replace with POST /api/saving-goals
      console.log("Saving goal:", data);

      // frontend-only temporary storage
      const existing = JSON.parse(localStorage.getItem("savingGoals")) || [];

      localStorage.setItem("savingGoals", JSON.stringify([...existing, data]));

      reset();
      router.replace("/saving-goals");
    } catch (error) {
      setWarningMessage("Failed to save goal");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Back */}
       <Link
        href="/saving-goals"
        className="inline-flex items-center text-gray-700 mb-8 hover:text-black text-lg font-medium group"
      >
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
        Back to Saving Goals
      </Link>

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header with centered title and pig icon */}
        <div className="bg-linear-to-r from-purple-200 to-purple-300 px-8 py-6 flex items-center justify-between">
          {/* Spacer for alignment */}
          <div className="w-20"></div>
          
          {/* Centered Title */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Add New Saving Goal
          </h2>
          
          {/* Pig Icon in header */}
         <div className="flex justify-center items-start">
            <Image
              src="/pig-icon.png"
              alt="Saving Icon"
              width={180}
              height={180}
              priority
            />
          </div>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="p-8"
        >
          {/* Form Fields - Full width layout */}
          <div className="space-y-6">
            {/* Target Amount */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Target Amount:</label>
              <input
                type="number"
                {...register("amount", { required: true })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter target amount"
              />
              {errors.amount && (
                <p className="text-sm text-red-500">Amount is required</p>
              )}
            </div>

            {/* Purpose */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Purpose:</label>
              <input
                type="text"
                {...register("purpose", { required: true })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="What are you saving for?"
              />
              {errors.purpose && (
                <p className="text-sm text-red-500">Purpose is required</p>
              )}
            </div>

            {/* Target Date */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Target Date:</label>
              <input
                type="date"
                {...register("date", { required: true })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              {errors.date && (
                <p className="text-sm text-red-500">Target date is required</p>
              )}
            </div>

            {/* Note */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Note (Optional):</label>
              <textarea
                rows="4"
                {...register("note")}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                placeholder="Any additional notes about this goal..."
              />
            </div>

            {/* Warning */}
            {warningMessage && (
              <p className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">{warningMessage}</p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? "Saving..." : "Save Goal"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}