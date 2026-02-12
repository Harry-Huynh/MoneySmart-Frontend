// app/transactions/[id]/edit/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { getBudgetByMonthAndYear } from "@/lib/budget.actions";
import { getAllSavingGoals } from "@/lib/savingGoal.actions";
import { getOneTransaction, updateTransaction } from "@/lib/transaction.actions";
import { parseDateToStartOfDay } from "@/lib/utils";

export default function EditTransactionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [formInitialized, setFormInitialized] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  useEffect(() => {
    let ignore = false;

    async function loadTransactionAndCategories() {
      try {
        const response = await getOneTransaction(id);
        const transactionData = response.transaction || response;
        
        // Format date to YYYY-MM-DD directly from the ISO string
        let formattedDate = "";
        if (transactionData.date) {
          formattedDate = transactionData.date.split("T")[0];
        }

        reset({
          type: transactionData.type,
          amount: transactionData.amount,
          date: formattedDate,
          paymentMethod: transactionData.paymentMethod,
          note: transactionData.note || "",
          category: "",
        });

        if (transactionData.type === "EXPENSE") {
          const dateObj = parseDateToStartOfDay(formattedDate);
          const [b, s] = await Promise.all([
            getBudgetByMonthAndYear(
              dateObj.getUTCMonth(),
              dateObj.getUTCFullYear()
            ),
            getAllSavingGoals(),
          ]);

          if (ignore) return;

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

          if (transactionData.budgetId) {
            const budgetCategory = merged.find(
              (c) => c.model === "Budget" && c.id === transactionData.budgetId
            );
            if (budgetCategory) {
              setValue("category", `Budget:${budgetCategory.id}`);
            }
          } else if (transactionData.savingGoalId) {
            const savingCategory = merged.find(
              (c) => c.model === "Saving Goal" && c.id === transactionData.savingGoalId
            );
            if (savingCategory) {
              setValue("category", `Saving Goal:${savingCategory.id}`);
            }
          }
        } else {
          setValue("category", transactionData.category);
        }

        setFormInitialized(true);
      } catch (error) {
        console.error("Failed to load transaction:", error);
        alert("Failed to get transaction information");
        router.replace("/transactions");
      }
    }

    if (id) {
      loadTransactionAndCategories();
    }

    return () => {
      ignore = true;
    };
  }, [id, reset, setValue, router]);

  useEffect(() => {
    async function fetchExpenseCategories() {
      if (!date || type !== "EXPENSE") return;
      
      const dateObj = parseDateToStartOfDay(date);
      if (isNaN(dateObj)) return;

      try {
        const [b, s] = await Promise.all([
          getBudgetByMonthAndYear(
            dateObj.getUTCMonth(),
            dateObj.getUTCFullYear()
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
      } catch (error) {
        setWarningMessage(error.message);
      }
    }

    fetchExpenseCategories();
  }, [type, date]);

  const handleSave = async (data, event) => {
    // Prevent default form submission
    event?.preventDefault();
    
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
        payload.budgetId = null;
        payload.savingGoalId = null;
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

      await updateTransaction(id, payload);
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

  // Custom submit handler to prevent multiple submissions
  const onSubmit = (data) => {
    if (!loading) {
      handleSave(data);
    }
  };

  if (!formInitialized) {
    return (
      <section className="flex justify-center items-center min-h-screen bg-gray-50 px-6 py-10">
        <div className="shrink-0 w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-linear-to-r from-purple-200 to-purple-300 px-8 py-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Loading Transaction...
            </h2>
          </div>
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 px-6 py-10">
      <div className="shrink-0 w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden relative">
        <div className="bg-linear-to-r from-purple-200 to-purple-300 px-8 py-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Transaction
          </h2>
        </div>
        <Image
          src="/pig-icon.png"
          alt="Piggy"
          width={256}
          height={256}
          className="absolute left-0 top-0 w-64 h-auto"
        />

        {/* Change from onSubmit={handleSubmit(handleSave)} to onSubmit={handleSubmit(onSubmit)} */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-16">
          <div className="space-y-3">
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
                }
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
                  {errors.category.type === "required"
                    ? "Category is required"
                    : errors.category.message}
                </p>
              )}
            </div>

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
                placeholder="Enter amount"
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
              {errors.paymentMethod && (
                <p className="text-sm text-red-500">
                  Payment Method is required
                </p>
              )}
            </div>

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
                placeholder="Any additional notes about this transaction..."
              />
              {errors.note && (
                <p className="text-sm text-red-500">{errors.note.message}</p>
              )}
            </div>

            {warningMessage && (
              <p className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                {warningMessage}
              </p>
            )}

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
                {loading ? "Updating..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}