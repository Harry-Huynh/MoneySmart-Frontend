"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-8 rounded-xl shadow-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">
          Log In
        </h2>

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#4f915f] text-white p-3 rounded-md font-semibold hover:bg-[#214a2b] transition"
        >
          Log In
        </button>

        <p className="text-center text-sm">
          No account?
          <Link href="/signup" className="text-green-700 ml-1 font-medium">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
