"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loading from "@/components/Loading";
import { registerUser } from "@/lib/authenticate";
import Logo from "@/components/Logo";

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
    <section className="flex flex-col items-center px-4 sm:px-8 lg:px-40 max-w-screen mx-auto">
      <div className="flex w-full pt-2 items-center justify-between">
        <Logo />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4">
        {loading && <Loading />}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="bg-white w-full max-w-lg p-8 rounded-xl shadow-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>

          {/* Full Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
            {...register("name", { required: true })}
          />

          {errors.name?.type === "required" &&
            {
              /* Create a new Error Message component and include the message:
            "Full Name is required."
            */
            }}

          {/* Username + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              {...register("username", { required: true })}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              {...register("phoneNumber", {
                required: true,
                pattern: /^[0-9]+$/,
              })}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
            />
          </div>

          {errors.username?.type === "required" &&
            {
              /* Create a new Error Message component and include the message:
            "Username is required."
            */
            }}

          {errors.phoneNumber?.type === "required" &&
            {
              /* Create a new Error Message component and include the message:
            "Phone Number is required."
            */
            }}

          {errors.phoneNumber?.type === "pattern" &&
            {
              /* Create a new Error Message component and include the message:
            "Phone Number must follow the format: 1234567890"
            */
            }}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            {...register("email", {
              required: true,
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
            })}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
          />

          {errors.email?.type === "required" &&
            {
              /* Create a new Error Message component and include the message:
            "Email Address is required."
            */
            }}

          {errors.email?.type === "pattern" &&
            {
              /* Create a new Error Message component and include the message:
            "Email Address must follow the format: 4B4d5@example.com"
            */
            }}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            {...register("password", { required: true, minLength: 8 })}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
          />

          {errors.password?.type === "required" &&
            {
              /* Create a new Error Message component and include the message:
            "Password is required."
            */
            }}

          {errors.password?.type === "minLength" &&
            {
              /* Create a new Error Message component and include the message:
            "Password must be at least 8 characters long."
            */
            }}

          {/* Region */}
          <input
            type="text"
            name="region"
            placeholder="Region"
            {...register("region", {
              required: true,
              pattern: /^[A-Za-z\s]+$/,
            })}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
          />

          {errors.region?.type === "required" &&
            {
              /* Create a new Error Message component and include the message:
            "Region is required."
            */
            }}

          {errors.region?.type === "pattern" &&
            {
              /* Create a new Error Message component and include the message:
            "Region must only contain letters and spaces."
            */
            }}

          {/* Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="currency"
              {...register("currency", { required: true })}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">CAD</option>
            </select>

            <select
              name="dateFormat"
              {...register("dateFormat", { required: true })}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              <option value="MM-DD-YYYY">MM-DD-YYYY</option>
            </select>
          </div>

          {errors.currency?.type === "required" &&
            {
              /* Create a new Error Message component and include the message:
            "Currency is required."
            */
            }}
          {errors.dateFormat?.type === "required" &&
            {
              /* Create a new Error Message component and include the message:
            "Date Format is required."
            */
            }}

          {warningMessage &&
            {
              /* Create a new Error Message component and pass in the warningMessage state as the message prop.
               */
            }}

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
