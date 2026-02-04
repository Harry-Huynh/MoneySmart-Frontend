"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { getBudgetByMonthAndYear } from "@/lib/budget.actions";
import { getAllSavingGoals } from "@/lib/savingGoal.actions";
import { addTransaction } from "@/lib/transaction.actions";
import { parseDateToStartOfDay } from "@/lib/utils";

export default function AddTransactionPage() {
  const router = useRouter();
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

  const date = watch("date");
  const type = watch("type");

  // Get categories
  useEffect(() => {
    async function fetchExpenseCategories() {
      const dateObj = parseDateToStartOfDay(date);
      if (isNaN(dateObj)) return;

      const [b, s] = await Promise.all([
        getBudgetByMonthAndYear(
          dateObj.getUTCMonth(),
          dateObj.getUTCFullYear(),
        ),
        getAllSavingGoals(),
      ]);

      const merged = [
        ...(b.budgets || []).map((x) => ({
          id: x.id,
          name: x.purpose,
          model: "Budget",
        })),
        ...(s.savingGoals || []).map((x) => ({
          id: x.id,
          name: x.purpose,
          model: "Saving Goal",
        })),
      ];

      setCategory(merged);
    }

    if (type === "EXPENSE") {
      fetchExpenseCategories().catch((e) => setWarningMessage(e.message));
    }
  }, [type, date]);

  useEffect(() => {
    const currentDate = new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      ),
    );
    const formattedDate = currentDate.toISOString().split("T")[0];

    reset({
      type: "EXPENSE",
      category: "",
      amount: "",
      date: formattedDate,
      paymentMethod: "CARD",
      note: "",
    });
  }, [reset]);

  const handleSave = async (data) => {
    setLoading(true);
    setWarningMessage("");

    try {
      const payload = {
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        paymentMethod: data.paymentMethod,
        note: data.note,
      };

      if (data.type === "INCOME") {
        payload.category = data.category;
      } else {
        const selected = category.find(
          (c) => `${c.model}:${c.id}` === data.category,
        );

        if (!selected) {
          throw new Error("Please select a Budget or SavingGoal.");
        }

        payload.category = selected.name;

        if (selected.model === "Budget") {
          payload.budgetId = selected.id;
          payload.savingGoalId = null;
        } else {
          payload.budgetId = null;
          payload.savingGoalId = selected.id;
        }
      }

      await addTransaction(payload);

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
    router.replace("/transactions");
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
              <select
                {...register("type", { required: true })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>

              {errors.type && (
                <p className="text-sm text-red-500">Type is required</p>
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
                max={
                  new Date(
                    Date.UTC(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate(),
                    ),
                  )
                    .toISOString()
                    .split("T")[0]
                } // Set max to today
                min={
                  new Date(
                    Date.UTC(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      1,
                    ),
                  )
                    .toISOString()
                    .split("T")[0]
                }
              />

              {errors.date && (
                <p className="text-sm text-red-500">Date is required</p>
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
                      const keys = category.map((c) => `${c.model}:${c.id}`);
                      return (
                        keys.includes(value) ||
                        "Please select a Budget or SavingGoal."
                      );
                    }

                    if (type === "INCOME") {
                      const incomeCategories = [
                        "Salary",
                        "Freelance",
                        "Investments",
                        "Rental",
                        "Business",
                        "Gifts",
                        "Refunds",
                        "Other",
                      ];
                      return (
                        incomeCategories.includes(value) ||
                        "Invalid income category."
                      );
                    }

                    return true;
                  },
                })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Select a category</option>

                {type === "EXPENSE" &&
                  category.map((cat) => (
                    <option
                      key={`${cat.model}:${cat.id}`}
                      value={`${cat.model}:${cat.id}`}
                    >
                      {cat.name} ({cat.model})
                    </option>
                  ))}

                {type === "INCOME" && (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investments">Investments</option>
                    <option value="Rental">Rental</option>
                    <option value="Business">Business</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Refunds">Refunds</option>
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
