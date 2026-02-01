"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOneBudget, updateBudget } from "@/lib/budget.actions";
import BudgetCancelEditAlert from "@/components/BudgetCancelEditAlert";
import { parseDateToStartOfDay, parseDateToEndOfDay } from "@/lib/utils";

export default function EditBudgetPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().slice(0, 10);

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function isValidMoneyInput(value) {
    const s = String(value ?? "").trim();

    if (s === "") return false;

    // non-negative number, max 2 decimal places
    // accept "12." to allow user in the middle of typing, submit will parse as 12
    return /^(?:0|[1-9]\d*)(?:\.\d{0,2})?$/.test(s);
  }

  function validateForm(nextForm) {
    const nextErrors = {};
    const amountRaw = String(nextForm.amount ?? "").trim();
    const thresholdRaw = String(nextForm.thresholdAmount ?? "").trim();
    const thresholdIsEmpty = thresholdRaw === "";

    if (!thresholdIsEmpty) {
      if (!isValidMoneyInput(thresholdRaw)) {
        nextErrors.thresholdAmount =
          "Threshold must be a non-negative number with up to 2 decimals";
      } else {
        const threshold = Number(thresholdRaw);
        const amount = Number(amountRaw);

        if (Number.isNaN(threshold) || threshold < 0) {
          nextErrors.thresholdAmount =
            "Threshold must be greater than or equal to 0";
        } else if (!Number.isNaN(amount) && threshold > amount) {
          nextErrors.thresholdAmount =
            "Threshold must be less than or equal to Amount";
        }
      }
    }

    if (!isValidMoneyInput(amountRaw)) {
      nextErrors.amount =
        "Amount must be a non-negative number with up to 2 decimals";
    } else {
      const amount = Number(amountRaw);
      if (Number.isNaN(amount) || amount < 0) {
        nextErrors.amount = "Amount must be a greater number or equal to 0";
      }
    }

    if (!nextForm.startDate) {
      nextErrors.startDate = "Start date is required";
    }

    // Add endDate validation
    if (nextForm.endDate) {
      if (nextForm.startDate && nextForm.endDate < nextForm.startDate) {
        nextErrors.endDate = "End date must be after start date";
      }
      if (nextForm.endDate < today) {
        nextErrors.endDate = "End date cannot be in the past";
      }
    }

    return nextErrors;
  }

  useEffect(() => {
    let ignore = false;

    async function loadBudget() {
      try {
        setLoading(true);
        const { budget } = await getOneBudget(id);
        if (ignore) return;

        setForm({
          id,
          amount: budget.amount ?? "",
          purpose: budget.purpose ?? "",
          startDate: (budget.startDate ?? "").slice(0, 10),
          endDate: budget.endDate ? (budget.endDate ?? "").slice(0, 10) : "", // Add endDate
          thresholdAmount: budget.thresholdAmount ?? "",
          note: budget.note ?? "",
        });
      } catch (e) {
        alert("Failed to get budget information");
        router.replace("/budgets");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (id) loadBudget();
    return () => (ignore = true);
  }, [id, router]);

  async function doUpdate() {
    try {
      const startDate = parseDateToStartOfDay(form.startDate);
      const endDate = parseDateToEndOfDay(form.endDate);

      await updateBudget(
        id,
        form.amount,
        form.purpose,
        startDate,
        endDate, // Add endDate
        form.thresholdAmount,
        form.note,
      );

      router.replace("/budgets");
    } catch (error) {
      console.log(error);
      alert("Failed to update budget");
    }
  }

  if (loading || !form) return <div className="p-10">Loading...</div>;

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <Link
        href="/budgets"
        className="inline-flex items-center text-gray-700 mb-8 hover:text-black text-xl font-medium group"
      >
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">
          ←
        </span>
        {form?.purpose || "Edit Budget"}
      </Link>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-md overflow-hidden relative">
        {/* purple header */}
        <div className="bg-linear-to-r from-purple-200 to-purple-300 px-8 py-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Budget</h2>
        </div>

        {/* pig overlay */}
        <Image
          src="/pig-icon.png"
          alt="Piggy"
          width={256}
          height={256}
          className="absolute left-0 top-0 w-64 h-auto"
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const nextErrors = validateForm(form);
            setErrors(nextErrors);
            if (Object.keys(nextErrors).length > 0) return;
            doUpdate();
          }}
          className="p-10 pt-16 space-y-6"
        >
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
                min={0}
                step="0.01"
                inputMode="decimal"
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
                className="w-full bg-yellow-50 border rounded-md px-4 py-2 cursor-pointer"
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
            <label className="w-40 font-medium">End Date:</label>
            <div className="flex-1">
              <input
                type="date"
                min={today}
                className="w-full bg-yellow-50 border rounded-md px-4 py-2 cursor-pointer"
                value={form.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                placeholder="(Optional)"
              />

              {errors.endDate ? (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Threshold Amount:</label>
            <div className="flex-1">
              <input
                type="number"
                step="0.01"
                className="w-full bg-yellow-50 border rounded-md px-4 py-2"
                value={form.thresholdAmount}
                onChange={(e) => updateField("thresholdAmount", e.target.value)}
                placeholder="(Optional)"
              />

              {errors.thresholdAmount ? (
                <p className="text-red-500 text-sm mt-1">
                  {errors.thresholdAmount}
                </p>
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
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <BudgetCancelEditAlert onConfirm={() => router.replace("/budgets")}>
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
        </form>
      </div>
    </section>
  );
}
