"use client";

import { addSavingGoal } from "@/lib/savingGoal.actions";
import SavingGoalsForm from "@/components/SavingGoalsForm";

export default function AddSavingGoalPage() {
  const submitForm = async (data) => {
    try {
      await addSavingGoal(data.amount, data.purpose, data.date, data.note);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return <SavingGoalsForm isEdit={false} onSave={submitForm} />;
}
