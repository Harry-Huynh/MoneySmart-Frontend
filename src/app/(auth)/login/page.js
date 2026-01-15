"use client";

import { useState } from "react";
import Link from "next/link";
import { authenticateUser } from "@/lib/authenticate";
import { redirect } from "next/navigation";
import Loading from "@/components/Loading";
import { useForm } from "react-hook-form";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitForm = async (data) => {
    setLoading(true);
    try {
      await authenticateUser(data.username, data.password);
      reset();
      redirect("/dashboard");
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

      <div className="flex min-h-screen items-center justify-center px-4">
        {loading && <Loading />}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="bg-white w-full max-w-sm p-8 rounded-xl shadow-md space-y-5"
        >
          <h2 className="text-2xl font-bold text-center">Log In</h2>

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            {...register("username", { required: true })}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
          />
          {errors.username?.type === "required" &&
            {
              /* Create a new Error Message component and include the message:
            "Username is required."
            */
            }}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
          />

          {errors.password?.type === "required" &&
            {
              /* Create a new Error Message component and include the message:
            "Password is required."
            */
            }}

          {warningMessage &&
            {
              /* Create a new Error Message component and pass the warningMessage as a prop
               */
            }}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#4f915f] text-white p-3 rounded-md font-semibold hover:bg-[#214a2b] transition cursor-pointer"
            disabled={Object.keys(errors).length > 0 || warningMessage !== null}
          >
            Log In
          </button>

          <p className="text-center text-sm">
            Don&apos;t have an account?
            <Link href="/signup" className="text-green-700 ml-1 font-medium">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
