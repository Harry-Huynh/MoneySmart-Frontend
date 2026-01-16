"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";

function sanitizeAmountInput(rawValue) {
  if (rawValue == null) return "";

  // Keep only digits and dot
  let value = String(rawValue).replace(/[^\d.]/g, "");

  // Only one dot
  const firstDotIndex = value.indexOf(".");
  if (firstDotIndex !== -1) {
    value =
      value.slice(0, firstDotIndex + 1) +
      value.slice(firstDotIndex + 1).replace(/\./g, "");
  }

  // Normalize ".5" -> "0.5"
  if (value.startsWith(".")) value = `0${value}`;

  // Normalize leading zeros: "00012" -> "12" (but keep "0" and "0.x")
  if (value.length > 1 && value.startsWith("0") && !value.startsWith("0.")) {
    value = value.replace(/^0+/, "");
    if (value === "") value = "0";
  }

  return value;
}

function validateAmount(value) {
  if (!value) return "Amount is required";
  if (Number.isNaN(Number(value))) return "Amount must be a number";
  if (Number(value) <= 0) return "Amount must be greater than $0";
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return "Only 2 decimal places allowed";
  if (Number(value) < 1) return "Minimum amount is $1";
  return null;
}

export default function AddFundsModal({
  isOpen,
  onRequestClose,
  onSubmitDeposit,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: { amount: "" },
  });

  const amountValue = watch("amount");

  // Real-time sanitize
  useEffect(() => {
    const sanitized = sanitizeAmountInput(amountValue);
    if (sanitized !== amountValue) {
      setValue("amount", sanitized, { shouldValidate: true, shouldDirty: true });
    }
  }, [amountValue, setValue]);

  // Escape closes
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event) {
      if (event.key === "Escape") onRequestClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onRequestClose]);

  const amountErrorMessage = useMemo(() => {
    return errors.amount?.message || "";
  }, [errors.amount?.message]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      onMouseDown={onRequestClose} // click outside closes
    >
      {/* Blur + dim background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className="relative z-10 w-[92%] max-w-lg rounded-2xl bg-white shadow-xl p-8"
        onMouseDown={(event) => event.stopPropagation()} // prevent closing when clicking inside
      >
        <h2 className="text-2xl font-bold text-center mb-6">Add Funds</h2>

        <form
          onSubmit={handleSubmit(async (formData) => {
            await onSubmitDeposit(formData.amount);
          })}
          className="space-y-5"
        >
          <FormInput
            name="amount"
            placeholder="Amount (e.g., 25.50)"
            register={register}
            validation={{
              validate: (value) => validateAmount(value) || true,
            }}
            error={amountErrorMessage}
          />

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full bg-[#4f915f] text-white p-3 rounded-md font-semibold transition ${
              !isValid || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#214a2b] hover:opacity-100 hover:scale-102 cursor-pointer"
            }`}
          >
            Deposit
          </button>

          <p className="text-center text-xs text-slate-500">
            Min $1 • Up to 2 decimals
          </p>
        </form>
      </div>
    </div>
  );
}
