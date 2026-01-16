"use client";

import { useState } from "react";
import Link from "next/link";
import { authenticateUser } from "@/lib/authenticate";
import { redirect } from "next/navigation";
import Loading from "@/components/Loading";
import { useForm } from "react-hook-form";
import Logo from "@/components/Logo";
import FormInput from "@/components/ui/formInput";
import ErrorMessage from "@/components/ui/errorMessage";

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
          <FormInput
            name="username"
            placeholder="Username"
            register={register}
            validation={{ required: "Username is required." }}
            error={errors.username?.message}
          />

          <FormInput
            type="password"
            name="password"
            placeholder="Password"
            register={register}
            validation={{ required: "Password is required." }}
            error={errors.password?.message}
          />

          <ErrorMessage message={warningMessage} />


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
