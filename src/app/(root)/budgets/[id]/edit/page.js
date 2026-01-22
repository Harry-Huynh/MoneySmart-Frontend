"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mockBudgets } from "@/lib/mock/budgets";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EditBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const budgetId = params?.id;

  // Mock existing budget (later load from API by id)
  const initial = useMemo(() => {
    return mockBudgets.find((b) => b.id === budgetId) || null;
  }, [budgetId]);

  const [form, setForm] = useState(
    initial || {
      id: budgetId,
      amount: 0,
      purpose: "",
      startDate: "",
      thresholdAlert: 80,
      note: "",
      spent: 0,
    }
  );

  const [openConfirm, setOpenConfirm] = useState(false);

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function doUpdate() {
    // later: PUT /api/budget/:id
    console.log("Update budget:", form);
    setOpenConfirm(false);
    router.replace("/budgets");
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <Link href="/budgets" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-xl
 cursor-pointer">
        ← {form.purpose || "Edit Budget"}
      </Link>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-200 to-purple-300 px-8 py-6">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Budget</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpenConfirm(true);
          }}
          className="p-10 space-y-6"
        >
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Amount:</label>
            <input
              type="number"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              value={form.amount}
              onChange={(e) => updateField("amount", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Purpose:</label>
            <input
              type="text"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              value={form.purpose}
              onChange={(e) => updateField("purpose", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Start Date:</label>
            <input
              type="date"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-medium">Threshold Alert (%):</label>
            <input
              type="number"
              min="0"
              max="100"
              className="flex-1 bg-yellow-50 border rounded-md px-4 py-2"
              value={form.thresholdAlert}
              onChange={(e) => updateField("thresholdAlert", e.target.value)}
              required
            />
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

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold cursor-pointer transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget?</DialogTitle>
            <DialogDescription>
              Save changes for <strong>{form.purpose || "this budget"}</strong>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={doUpdate}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
