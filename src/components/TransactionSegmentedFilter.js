import React from "react";

export default function TransactionSegmentedFilter({
  value = "All",
  onChange,
}) {
  const tabs = ["All", "Income", "Expense"];

  return (
    <div className="mx-8 mt-4 rounded-2xl bg-gray-100 p-1 flex">
      {tabs.map((t) => {
        const active = value === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={`flex-1 py-1 text-center rounded-xl transition font-medium cursor-pointer ${active ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
