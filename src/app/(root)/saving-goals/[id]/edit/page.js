"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getOneSavingGoal, updateSavingGoal } from "@/lib/savingGoal.actions";
import SavingGoalsForm from "@/components/SavingGoalsForm";

export default function EditSavingGoalPage() {
  const { id } = useParams();
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    async function fetchGoal() {
      const { savingGoal } = await getOneSavingGoal(id);
      savingGoal.targetDate = new Date(savingGoal.targetDate)
        .toISOString()
        .split("T")[0];
      setGoal(savingGoal);
    }
    fetchGoal();
  }, [id]);

  async function submitForm(data) {
    try {
      await updateSavingGoal(
        id,
        data.amount,
        data.purpose,
        data.date,
        data.note,
        data.status,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return (
    <SavingGoalsForm
      goal={goal}
      savedAmount={goal?.currentAmount}
      isEdit={true}
      onSave={submitForm}
    />
  );
}
