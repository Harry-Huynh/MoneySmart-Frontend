"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loading from "@/components/Loading";
import { registerUser } from "@/lib/authenticate";
import Logo from "@/components/Logo";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/ErrorMessage";

export default function SignUpPage() {
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmedPassword: "",
      phoneNumber: "",
      region: "",
      currencyCode: "USD",
      dateFormat: "YYYY-MM-DD",
    },
  });

  const submitForm = async (data) => {
    setLoading(true);
    try {
      await registerUser(
        data.name,
        data.username,
        data.password,
        data.confirmedPassword,
        data.email,
        data.phoneNumber,
        data.region,
        data.currencyCode,
        data.dateFormat,
      );

      reset();
      router.replace("/login");
    } catch (error) {
      setWarningMessage(error.message);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center relative min-h-screen overflow-hidden px-4 sm:px-8 lg:px-40 max-w-screen mx-auto">
      {/* Background */}
      <div
        className="
          absolute inset-0
          bg-[url('/background.jpg')]
          bg-cover bg-center
          blur-md
          scale-110
        "
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Header */}
      <div className="relative z-10 px-6 flex w-full pt-2">
        <Logo isAuth={true} />
      </div>

      {/* Form */}
      <div className="relative z-10 flex items-start justify-center px-4 w-2xl">
        {loading && <Loading />}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-8 rounded-xl shadow-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>

          {/* Full Name */}
          <FormInput
            name="name"
            placeholder="Full Name"
            register={register}
            validation={{ required: "Full Name is required." }}
            error={errors.name?.message}
          />

          <FormInput
            name="phoneNumber"
            placeholder="Phone Number"
            register={register}
            validation={{
              required: "Phone Number is required.",
              pattern: {
                value: /^[0-9]+$/,
                message: "Phone Number must follow the format: 1234567890",
              },
            }}
            error={errors.phoneNumber?.message}
          />

          {/* Email */}
          <FormInput
            type="email"
            name="email"
            placeholder="Email Address"
            register={register}
            validation={{
              required: "Email Address is required.",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message:
                  "Email Address must follow the format: 4B4d5@example.com",
              },
            }}
            error={errors.email?.message}
          />

          {/* Region */}
          <FormInput
            name="region"
            placeholder="Region"
            register={register}
            validation={{
              required: "Region is required.",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Region must only contain letters and spaces.",
              },
            }}
            error={errors.region?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              name="currencyCode"
              register={register}
              validation={{ required: "CurrencyCode is required." }}
              error={errors.currencyCode?.message}
              options={[
                { value: "USD", label: "USD" },
                { value: "EUR", label: "EUR" },
                { value: "GBP", label: "GBP" },
                { value: "CAD", label: "CAD" },
                { value: "AUD", label: "AUD" },
              ]}
            />

            <FormSelect
              name="dateFormat"
              register={register}
              validation={{ required: "Date Format is required." }}
              error={errors.dateFormat?.message}
              options={[
                { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
                { value: "MM-DD-YYYY", label: "MM-DD-YYYY" },
              ]}
            />
          </div>

          {/* Username */}
          <div>
            <FormInput
              name="username"
              placeholder="Username"
              register={register}
              validation={{ required: "Username is required." }}
              error={errors.username?.message}
            />
          </div>

          {/* Password */}
          <FormInput
            type="password"
            name="password"
            placeholder="Password"
            register={register}
            validation={{
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long.",
              },
            }}
            error={errors.password?.message}
          />
          {/* Confirm Password */}
          <FormInput
            type="password"
            name="confirmedPassword"
            placeholder="Confirm Password"
            register={register}
            validation={{
              required: "Please confirm your password.",
              validate: (value) =>
                value === watch("password") || "Passwords do not match.",
            }}
            error={errors.confirmedPassword?.message}
          />

          {warningMessage && <ErrorMessage message={warningMessage} />}

          {/* Submit */}
          <button
            type="submit"
            className={`w-full bg-[#4f915f] text-white p-3 rounded-md font-semibold transition ${
              Object.keys(errors).length > 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#214a2b] hover:opacity-100 hover:scale-102 cursor-pointer"
            }`}
          >
            Sign Up
          </button>

          <p className="text-center text-sm">
            Already have an account?
            <Link href="/login" className="text-green-700 ml-1 font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
