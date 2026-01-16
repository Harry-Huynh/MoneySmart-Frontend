"use client";

export default function FormSelect({
  name,
  register,
  validation,
  error,
  options,
}) {
  return (
    <div className="w-full space-y-1">
      <select
        {...register(name, validation)}
        className="
          w-full p-3
          border border-gray-300
          rounded-xl
          bg-white
          focus:outline-none
          focus:ring-2 focus:ring-[#4f915f]
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
