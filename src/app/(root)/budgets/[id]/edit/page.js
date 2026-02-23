"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getOneBudget, updateBudget } from "@/lib/budget.actions";
import BudgetCancelEditAlert from "@/components/BudgetCancelEditAlert";
import { parseDateToStartOfDay, parseDateToEndOfDay } from "@/lib/utils";
import { NumericFormat } from "react-number-format";
import { useForm, Controller } from "react-hook-form";

export default function EditBudgetPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    reset,
  } = useForm({
    defaultValues: {
      amount: "",
      purpose: "",
      startDate: "",
      endDate: "",
      thresholdAmount: "",
      note: "",
    },
  });

  useEffect(() => {
    async function loadBudget() {
      try {
        setLoading(true);
        const { budget } = await getOneBudget(id);

        reset({
          amount: budget.amount ?? "",
          purpose: budget.purpose ?? "",
          startDate: (budget.startDate ?? "").slice(0, 10),
          endDate: budget.endDate ? (budget.endDate ?? "").slice(0, 10) : "", // Add endDate
          thresholdAmount: budget.thresholdAmount ?? "",
          note: budget.note ?? "",
        });
      } catch (e) {
        setErrorMessage(e.message);
        router.replace("/budgets");
      } finally {
        setLoading(false);
      }
    }

    loadBudget();
  }, [id, router, reset]);

  async function onUpdate(data) {
    try {
      const startDate = parseDateToStartOfDay(data.startDate);
      const endDate = parseDateToEndOfDay(data.endDate);
      const formattedAmount = data.amount.replace(/[^0-9.]/g, "");

      await updateBudget(
        id,
        formattedAmount,
        data.purpose,
        startDate,
        endDate,
        data.thresholdAmount,
        data.note,
      );

      router.replace("/budgets");
    } catch (error) {
      setErrorMessage(
        error.message || "An unexpected error occurred. Please try again.",
      );
    }
  }

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 px-6 py-10">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden relative">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-200 to-purple-300 px-8 py-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Budget</h2>
        </div>

        <Image
          src="/pig-icon.png"
          alt="Piggy"
          width={256}
          height={256}
          className="absolute left-0 top-0 w-64 h-auto"
        />

        <form onSubmit={handleSubmit(onUpdate)} className="p-8 pt-16">
          <div className="space-y-3">
            {/* Amount */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Amount:</label>

              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Amount is required",
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                }}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    thousandSeparator
                    prefix="$"
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="$0.00"
                    onValueChange={(values) => {
                      field.onChange(values.floatValue);
                    }}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            {/* Purpose */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Purpose:</label>
              <input
                type="text"
                {...register("purpose", {
                  required: "Purpose is required",
                  minLength: {
                    value: 2,
                    message: "Purpose must be at least 2 characters",
                  },
                })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="What is this budget for?"
              />
              {errors.purpose && (
                <p className="text-sm text-red-500">{errors.purpose.message}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Start Date:</label>
              <input
                type="date"
                min={today}
                {...register("startDate", {
                  required: "Start date is required",
                  validate: (value) =>
                    value >= today || "Start date cannot be in the past",
                })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer"
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">End Date:</label>
              <input
                type="date"
                min={today}
                {...register("endDate", {
                  required: "End date is required",
                  validate: (value) => {
                    const startDate = getValues("startDate");

                    if (value < today) return "End date cannot be in the past";
                    if (startDate && value < startDate)
                      return "End date must be after start date";
                    return true;
                  },
                })}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer"
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>

            {/* Threshold */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">
                Threshold Amount:
              </label>

              <Controller
                name="thresholdAmount"
                control={control}
                rules={{
                  required: "Threshold amount is required",
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                  validate: (value) => {
                    const amount = getValues("amount");
                    if (
                      parseFloat(value.replace(/[^0-9.]/g, "")) >
                      parseFloat(amount.replace(/[^0-9.]/g, ""))
                    )
                      return "Threshold must be less than or equal to Amount";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    thousandSeparator
                    prefix="$"
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="$0.00"
                    onValueChange={(values) => {
                      field.onChange(values.floatValue);
                    }}
                  />
                )}
              />

              {errors.thresholdAmount && (
                <p className="text-sm text-red-500">
                  {errors.thresholdAmount.message}
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
                {...register("note")}
                className="w-full bg-yellow-50 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                {errorMessage}
              </p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <BudgetCancelEditAlert
                onConfirm={() => router.replace("/budgets")}
              >
                <button
                  type="button"
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </BudgetCancelEditAlert>

              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold cursor-pointer transition"
              >
                Update Budget
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
