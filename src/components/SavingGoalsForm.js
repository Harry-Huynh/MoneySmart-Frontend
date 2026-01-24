"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";

export default function SavingGoalsForm({
  goal = null,
  isEdit = false,
  onSave,
  savedAmount = 0, // Add savedAmount prop for progress calculation
}) {
  const router = useRouter();
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Status enum values from backend
  const STATUS_ENUM = {
    ACTIVE: "ACTIVE",
    ACHIEVED: "ACHIEVED",
    CANCELLED: "CANCELLED",
    PAUSED: "PAUSED",
  };

  // Set default values based on whether we're editing or adding
  const defaultValues = {
    amount: 0,
    purpose: "",
    date: "",
    note: "",
    status: STATUS_ENUM.ACTIVE, // Default value is 'ACTIVE'
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({ defaultValues });

  // Watch amount field for progress calculation
  const amount = watch("amount");

  // Load the data into fields
  useEffect(() => {
    if (goal && isEdit) {
      reset({
        amount: goal.targetAmount,
        purpose: goal.purpose,
        date: goal.targetDate,
        note: goal.note,
        status: goal.status,
      });
    }
  }, [goal, isEdit, reset]);

  // Calculate progress
  const currentAmount = parseFloat(savedAmount) || 0;
  const targetAmount = parseFloat(amount) || 0;
  const progress =
    targetAmount > 0 ? Math.round((currentAmount / targetAmount) * 100) : 0;

  const handleSave = async (data) => {
    setLoading(true);

    try {
      // Convert amount to number if it's a string
      const formattedData = {
        ...data,
        amount: Number(data.amount),
      };

      await onSave(formattedData);
      reset();
      router.replace("/saving-goals");
    } catch (error) {
      setWarningMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      // Show confirmation dialog for edit mode
      setShowCancelConfirm(true);
    } else {
      router.push("/saving-goals");
    }
  };

  const confirmCancel = () => {
    router.push("/saving-goals");
    setShowCancelConfirm(false);
  };

  const continueEditing = () => {
    setShowCancelConfirm(false);
  };

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Back */}
      <Link
        href="/saving-goals"
        className="inline-flex items-center text-gray-700 mb-8 hover:text-black text-lg font-medium group"
      >
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">
          ←
        </span>
        Back to Saving Goals
      </Link>

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Cancel Editing?
            </h3>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to cancel? Your
              changes will be lost.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={continueEditing}
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-medium"
              >
                Continue Editing
              </button>
              <button
                onClick={confirmCancel}
                className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header with centered title and pig icon */}
        <div className="bg-linear-to-r from-purple-200 to-purple-300 px-8 py-6 flex items-center justify-between">
          {/* Spacer for alignment */}
          <div className="w-20"></div>

          {/* Centered Title */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {isEdit ? "Edit Saving Goal" : "Add New Saving Goal"}
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
        <form onSubmit={handleSubmit(handleSave)} className="p-8">
          {/* Progress Bar - Only show when editing or when amount is set */}
          {isEdit && (
            <div className="mb-6">
              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-200 rounded-full mb-2">
                <div
                  className="absolute h-2 bg-yellow-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Progress Info */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Progress: {progress}%</span>
                <span>
                  ${currentAmount.toLocaleString()} / $
                  {targetAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Form Fields - Full width layout */}
          <div className="space-y-6">
            {/* Target Amount */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">
                Target Amount:
              </label>
              <input
                type="number"
                {...register("amount", {
                  required: true,
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter target amount"
                step="0.01"
                min="0.01"
              />
              {errors.amount && (
                <p className="text-sm text-red-500">
                  {errors.amount.type === "required"
                    ? "Amount is required"
                    : errors.amount.message}
                </p>
              )}
            </div>

            {/* Purpose */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Purpose:</label>
              <input
                type="text"
                {...register("purpose", {
                  required: true,
                  minLength: {
                    value: 2,
                    message: "Purpose must be at least 2 characters",
                  },
                })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="What are you saving for?"
              />
              {errors.purpose && (
                <p className="text-sm text-red-500">
                  {errors.purpose.type === "required"
                    ? "Purpose is required"
                    : errors.purpose.message}
                </p>
              )}
            </div>

            {/* Target Date */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Target Date:</label>
              <input
                type="date"
                {...register("date", {
                  required: true,
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      selectedDate >= today ||
                      "Target date must be today or in the future"
                    );
                  },
                })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer"
                min={new Date().toISOString().split("T")[0]} // Set min to today
              />
              {errors.date && (
                <p className="text-sm text-red-500">
                  {errors.date.type === "required"
                    ? "Target date is required"
                    : errors.date.message}
                </p>
              )}
            </div>

            {/* Status Field - Only for Edit mode */}
            {isEdit && (
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">Status:</label>
                <select
                  {...register("status", { required: true })}
                  className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value={STATUS_ENUM.ACTIVE}>Active</option>
                  <option value={STATUS_ENUM.ACHIEVED}>Achieved</option>
                  <option value={STATUS_ENUM.PAUSED}>Paused</option>
                  <option value={STATUS_ENUM.CANCELLED}>Cancelled</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500">Status is required</p>
                )}
              </div>
            )}

            {/* Note */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">
                Note (Optional):
              </label>
              <textarea
                rows="4"
                {...register("note", {
                  maxLength: {
                    value: 500,
                    message: "Note cannot exceed 500 characters",
                  },
                })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                placeholder="Any additional notes about this goal..."
              />
              {errors.note && (
                <p className="text-sm text-red-500">{errors.note.message}</p>
              )}
            </div>

            {/* Warning */}
            {warningMessage && (
              <p className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                {warningMessage}
              </p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-black font-semibold disabled:opacity-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold disabled:opacity-50 transition cursor-pointer"
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Saving..."
                  : isEdit
                    ? "Update Goal"
                    : "Save Goal"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
