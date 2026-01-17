"use client";

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return <p className="text-sm text-red-600 text-center">{message}</p>;
}
