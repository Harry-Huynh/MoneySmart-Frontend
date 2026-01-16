"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loading from "@/components/Loading";
import { registerUser } from "@/lib/authenticate";
import Logo from "@/components/Logo";
import FormInput from "@/components/ui/formInput";
import FormSelect from "@/components/ui/formSelect";


export default function SignUpPage() {
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmedPassword: "",
      phoneNumber: "",
      region: "",
      currency: "USD",
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
        data.currency,
        data.dateFormat
      );

      reset();
      redirect("/login");
    } catch (error) {
      setWarningMessage(error.message);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
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
      <div className="relative z-10 flex w-full pt-4 px-6">
        <Logo />
      </div>

      {/* Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        {loading && <Loading />}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="bg-white w-full max-w-lg p-8 rounded-xl shadow-md space-y-6"
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


          {/* Username + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                name="username"
                placeholder="Username"
                register={register}
                validation={{ required: "Username is required." }}
                error={errors.username?.message}
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
          </div>

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
                      message: "Email Address must follow the format: 4B4d5@example.com",
                    },
                  }}
                  error={errors.email?.message}
              />


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
              name="currency"
              register={register}
              validation={{ required: "Currency is required." }}
              error={errors.currency?.message}
              options={[
                { value: "USD", label: "USD" },
                { value: "EUR", label: "EUR" },
                { value: "GBP", label: "GBP" },
                { value: "CAD", label: "CAD" },
                { value: "AUD", label: "AUD" },   ]}
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#4f915f] text-white p-3 rounded-md font-semibold hover:bg-[#214a2b] transition cursor-pointer"
            disabled={Object.keys(errors).length > 0 || warningMessage !== null}
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
