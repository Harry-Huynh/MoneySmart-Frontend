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
    thresholdAmount: "",
    note: "",
  });
  const today = new Date().toISOString().split("T")[0];;
  const [errors, setErrors] = useState({});

  function isValidMoneyInput(value) {
    const s = String(value ?? "").trim();
    if (s === "") return false;

    // non-negative number, max 2 decimal places
    return /^(?:0|[1-9]\d*)(?:\.\d{0,2})?$/.test(s);
  }


  function validateForm(nextForm) {
    const nextErrors = {};

    const amountRaw = String(nextForm.amount ?? "").trim();
    const thresholdRaw = String(nextForm.thresholdAmount ?? "").trim();

    if (!isValidMoneyInput(amountRaw)) {
      nextErrors.amount =
        "Amount must be a non-negative number with up to 2 decimals (e.g., 12.59)";
    } else {
      const amount = Number(amountRaw);
      if (Number.isNaN(amount) || amount < 0) {
        nextErrors.amount = "Amount must be ≥ 0";
      }
    }

    if (!nextForm.startDate) {
      nextErrors.startDate = "Start date is required";
    }

    if (nextForm.startDate && nextForm.startDate < today) {
      nextErrors.startDate = "Start date cannot be in the past";
    }


    const thresholdIsEmpty = thresholdRaw === "";
      if (!thresholdIsEmpty) {
        if (!isValidMoneyInput(thresholdRaw)) {
          nextErrors.thresholdAmount =
            "Threshold must be a non-negative number with up to 2 decimals";
        } else {
          const threshold = Number(thresholdRaw);
          const amount = Number(amountRaw);

          if (Number.isNaN(threshold) || threshold < 0) {
            nextErrors.thresholdAmount = "Threshold must be greater than or equal to 0";
          } else if (!Number.isNaN(amount) && threshold > amount) {
            nextErrors.thresholdAmount = "Threshold must be less than or equal to Amount";
          }
        }
      }

    return nextErrors;
  }


  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
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
          width={256}
          height={256}
          className="absolute left-0 top-0 w-64 h-auto"
        />

        {/* form */}
        <form onSubmit={onSubmit} className="p-10 pt-16 space-y-6">
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Amount:</label>
            <div className="flex-1">
              <input
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                className="w-full bg-yellow-50 border rounded-md px-4 py-2"
                value={form.amount}
                onChange={(e) => updateField("amount", e.target.value)}
                required
              />

              {errors.amount ? (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Purpose:</label>
            <div className="flex-1">
              <input
                type="text"
                className="w-full bg-yellow-50 border rounded-md px-4 py-2"
                value={form.purpose}
                onChange={(e) => updateField("purpose", e.target.value)}
              />

              {errors.purpose ? (
                <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Start Date:</label>
            <div className="flex-1">
              <input
                type="date"
                min={today}
                className="w-full bg-yellow-50 border rounded-md px-4 py-2"
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                required
              />

              {errors.startDate ? (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Threshold Amount:</label>
            <div className="flex-1">
              <input
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                className="w-full bg-yellow-50 border rounded-md px-4 py-2"
                value={form.thresholdAmount}
                onChange={(e) => updateField("thresholdAmount", e.target.value)}
              />

              {errors.thresholdAmount ? (
                <p className="text-red-500 text-sm mt-1">{errors.thresholdAmount}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <label className="w-40 font-medium pt-2">Note:</label>
            <textarea
              rows="4"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2 resize-none"
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
              placeholder="(Optional)"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.replace("/budgets")}
              className="flex-1 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold cursor-pointer transition"
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
