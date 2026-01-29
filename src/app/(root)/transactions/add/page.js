"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { getAllBudgets } from "@/lib/budget.actions";
import { getAllSavingGoals } from "@/lib/savingGoal.actions";

export default function AddTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      type: "EXPENSE",
      category: "",
      amount: "",
      date: "",
      paymentMethod: "CARD",
      note: "",
    },
  });

  // To add the transaction for saving goals
  const isSavingGoal = searchParams.get("savingGoals") === "true";

  const type = watch("type");

  // Get categories
  useEffect(() => {
    if (isSavingGoal) {
      async function fetchSavingGoals() {
        const { savingGoals: categories } = await getAllSavingGoals();
        setCategory(categories);
      }
      fetchSavingGoals();
    } else {
      async function fetchBudgets() {
        const { budgets: categories } = await getAllBudgets();
        setCategory(categories);
      }
      fetchBudgets();
    }
  }, [isSavingGoal, reset]);

  const handleSave = async (data) => {
    setLoading(true);

    try {
      // Convert amount to number if it's a string
      const formattedData = {
        ...data,
        amount: Number(data.amount),
      };

      // Trigger the function for transaction using formattedData
      console.log(formattedData);

      reset({
        type: "EXPENSE",
        category: "",
        amount: "",
        date: "",
        paymentMethod: "CARD",
        note: "",
      });
      router.replace("/transactions");
    } catch (error) {
      setWarningMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/transactions");
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 px-6 py-10">
      {/* Card */}
      <div className="shrink-0 w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden relative">
        {/* purple header */}
        <div className="bg-linear-to-r from-purple-200 to-purple-300 px-8 py-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add Transaction
          </h2>
        </div>
        {/* pig overlay */}
        <Image
          src="/pig-icon.png"
          alt="Piggy"
          width={256}
          height={256}
          className="absolute left-0 top-0 w-64 h-auto"
        />

        {/* Content */}
        <form onSubmit={handleSubmit(handleSave)} className="p-8 pt-16">
          {/* Form Fields - Full width layout */}
          <div className="space-y-3">
            {/* Type of transaction */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Type:</label>
              {isSavingGoal ? (
                <>
                  {/* Display-only input */}
                  <input
                    type="text"
                    value="Expense"
                    className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    readOnly
                  />

                  {/* Actual submitted value */}
                  <input type="hidden" {...register("type")} value="EXPENSE" />
                </>
              ) : (
                <select
                  {...register("type", { required: true })}
                  className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              )}

              {errors.type && (
                <p className="text-sm text-red-500">Type is required</p>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Category:</label>
              <select
                {...register("category", {
                  required: true,
                  validate: (value) => {
                    if (type === "EXPENSE") {
                      const name = category.map((cat) => cat.purpose);

                      if (!name.includes(value) && value !== "Other") {
                        return "Invalid category. Type of transaction and the category do not match.";
                      }
                    } else if (type === "INCOME") {
                      const incomeCategories = [
                        "Salary",
                        "Freelance",
                        "Investments",
                        "Rental",
                        "Business",
                        "Gifts",
                        "Refunds",
                      ];

                      if (
                        !incomeCategories.includes(value) &&
                        value !== "Other"
                      ) {
                        return "Invalid category. Type of transaction and the category do not match.";
                      }
                    }

                    return true;
                  },
                })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <optgroup label="Expenses">
                  {category.map((cat) => (
                    <option key={cat.id} value={cat.purpose}>
                      {cat.purpose}
                    </option>
                  ))}
                </optgroup>

                {!isSavingGoal && (
                  <>
                    <optgroup label="Income">
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investments">Investments</option>
                      <option value="Rental">Rental</option>
                      <option value="Business">Business</option>
                      <option value="Gifts">Gifts</option>
                      <option value="Refunds">Refunds</option>
                    </optgroup>

                    <option value="Other">Other</option>
                  </>
                )}
              </select>
              {errors.category && (
                <p className="text-sm text-red-500">
                  {" "}
                  {errors.category.type === "required"
                    ? "Category is required"
                    : errors.category.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Amount:</label>

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
                min="0.0"
              />

              {errors.amount && (
                <p className="text-sm text-red-500">
                  {errors.amount.type === "required"
                    ? "Amount is required"
                    : errors.amount.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Date:</label>
              <input
                type="date"
                {...register("date", {
                  required: true,
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      selectedDate <= today ||
                      "Target date must be today or in the past"
                    );
                  },
                })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer"
                max={new Date().toISOString().split("T")[0]} // Set min to today
              />

              {errors.date && (
                <p className="text-sm text-red-500">Date is required</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">
                Payment Method:
              </label>
              <select
                {...register("paymentMethod", { required: true })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CARD">Card</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500">
                  Payment Method is required
                </p>
              )}
            </div>

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
                {loading ? "Saving..." : "Save Transaction"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
