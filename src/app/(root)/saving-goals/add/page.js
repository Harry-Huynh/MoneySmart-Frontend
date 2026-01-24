// AddSavingGoalPage.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { addSavingGoal } from "@/lib/savingGoal.actions";
import SavingGoalsForm from "@/components/SavingGoalsForm";

export default function AddSavingGoalPage() {
  const router = useRouter();
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      purpose: "",
      date: "",
      note: "",
    },
  });

  const submitForm = async (data) => {
    setLoading(true);

    try {
      await addSavingGoal(data.amount, data.purpose, data.date, data.note);

      reset();
      router.replace("/saving-goals");
    } catch (error) {
      setWarningMessage("Failed to save goal");
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Cancelled adding goal");
  };

  return (
    <SavingGoalsForm
      isEdit={false}
      onSave={handleSubmit}
      onCancel={handleCancel}
    />
  );
}