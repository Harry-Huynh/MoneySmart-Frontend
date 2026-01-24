"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getOneSavingGoal, updateSavingGoal } from "@/lib/savingGoal.actions";
import SavingGoalsForm from "@/components/SavingGoalsForm";

export default function EditSavingGoalPage() {
  const router = useRouter();
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  

  const progress = Math.round((goal?.currentAmount / goal?.targetAmount) * 100);

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

  function handleChange(e) {
    setGoal({ ...goal, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await updateSavingGoal(
      id,
      goal?.targetAmount,
      goal?.purpose,
      goal?.targetDate,
      goal?.note,
      goal?.status,
    );
    router.push("/saving-goals");
  }

  const handleCancel = () => {
    console.log("Cancelled editing goal");
  };

  

  return (
    <SavingGoalsForm
      goal={{
        targetAmount: goal?.amount,
        purpose: goal?.purpose,
        date: goal?.date,
        note: goal?.note,
        status: goal?.status
      }}
      savedAmount={goal?.savedAmount}
      isEdit={true}
      onSave={handleSubmit}
      onCancel={handleCancel}
    />
  );
}