"use client";

export default function FormInput({
  type = "text",
  placeholder,
  register,
  name,
  validation,
  error,
}) {
  return (
    <div className="w-full space-y-1">
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        className="
          w-full p-3
          border border-gray-300
          rounded-xl
          focus:outline-none
          focus:ring-2 focus:ring-[#4f915f]
          placeholder-gray-400
        "
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
