import React from "react";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function MonthNavigation({
  selectedMonth,
  onPrevMonth,
  onNextMonth,
}) {
  const label = selectedMonth.toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full mb-4 flex justify-center">
      <div className="w-50 flex content-between justify-between items-center">
        <button className="cursor-pointer" onClick={onPrevMonth} type="button">
          <FaChevronLeft />
        </button>

        <span className="text-lg font-semibold flex-1 text-center select-none">
          {label}
        </span>
        <button className="cursor-pointer" onClick={onNextMonth} type="button">
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
