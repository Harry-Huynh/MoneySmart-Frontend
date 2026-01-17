"use client";

import { useState } from "react";
import Link from "next/link";
import { authenticateUser } from "@/lib/authenticate";
import Loading from "@/components/Loading";
import { useForm } from "react-hook-form";
import Logo from "@/components/Logo";
import FormInput from "@/components/FormInput";
import ErrorMessage from "@/components/ErrorMessage";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
      router.replace("/dashboard");
    } catch (error) {
      setWarningMessage(error.message);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4 sm:px-8 lg:px-40 mx-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center blur-md scale-110" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Header */}
      <div className="absolute top-50% left-50% z-20 w-full px-6 pt-2">
        <Logo isAuth={true} />
      </div>

      {/* Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        {loading && <Loading />}

        <form
          onSubmit={handleSubmit(submitForm)}
          className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-8 rounded-xl shadow-md space-y-5"
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
