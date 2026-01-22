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
        className="flex items-center text-gray-600 mb-6 hover:text-black"
      >
        ← Add Saving Goal
      </Link>

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-200 to-purple-300 px-8 py-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            New Saving Goal
          </h2>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8"
        >
          {/* Left Icon */}
          <div className="flex justify-center items-start">
            <Image
              src="/pig-icon.png"
              alt="Saving Icon"
              width={180}
              height={180}
              priority
            />
          </div>

          {/* Form Fields */}
          <div className="md:col-span-2 space-y-5">
            {/* Target Amount */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium">Target Amount:</label>
              <input
                type="number"
                {...register("amount", { required: true })}
                className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500 ml-36">Amount is required</p>
            )}

            {/* Purpose */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium">Purpose:</label>
              <input
                type="text"
                {...register("purpose", { required: true })}
                className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              />
            </div>

            {/* Target Date */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium">Target Date:</label>
              <input
                type="date"
                {...register("date", { required: true })}
                className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              />
            </div>

            {/* Note */}
            <div className="flex items-start gap-4">
              <label className="w-32 font-medium pt-2">Note:</label>
              <textarea
                rows="4"
                {...register("note")}
                className="flex-1 bg-yellow-50 border rounded-md px-4 py-2 resize-none"
              />
            </div>

            {/* Warning */}
            {warningMessage && (
              <p className="text-red-500 text-sm">{warningMessage}</p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-md bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-md bg-yellow-500 text-white font-semibold disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
