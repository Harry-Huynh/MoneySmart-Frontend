"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    region: "",
    currency: "USD",
    dateFormat: "YYYY-MM-DD",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data:", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-8 rounded-xl shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>

        {/* Full Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
        />

        {/* Username + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
          />
        </div>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
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

        {/* Region */}
        <input
          type="text"
          name="region"
          placeholder="Region"
          value={form.region}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
        />

        {/* Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>

          <select
            name="dateFormat"
            value={form.dateFormat}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f915f]"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            <option value="MM-DD-YYYY">MM-DD-YYYY</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#4f915f] text-white p-3 rounded-md font-semibold hover:bg-[#214a2b] transition"
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
  );
}
