"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { parseLocalDate } from "@/lib/utils";
import { getBudgetByMonthAndYear } from "@/lib/budget.actions";
import { useEffect } from "react";

const COLORS = [
  "#4f915f",
  "#6dbb92",
  "#8cd1b0",
  "#a7dfc4",
  "#c4ead9",
];

export default function SpendingCategoryChart() {
  const [budgets, setBudgets] = useState([]);
  const now = new Date();
  const currentYear = now.getFullYear();

  const [month, setMonth] = useState(now.getMonth());

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" }),
  );

  useEffect(() => {
  async function fetchBudgets() {
    try {
      const res = await getBudgetByMonthAndYear(month, currentYear);
      setBudgets(res.budgets || []);
    } catch (err) {
      console.error("Failed to load budgets", err);
      setBudgets([]);
    }
  }

  fetchBudgets();
}, [month, currentYear]);

  /* -------- Filter transactions for selected month -------- */
const data = useMemo(() => {
  const total = budgets.reduce(
    (sum, b) => sum + Number(b.usedAmount || 0),
    0
  );

  return budgets
    .filter((b) => Number(b.usedAmount) > 0)
    .map((b) => ({
      name: b.purpose,
      value: Number(b.usedAmount),
      percent: total
        ? Math.round((Number(b.usedAmount) / total) * 100)
        : 0,
    }));
}, [budgets]);
 

  return (
    <Card className="w-full rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Spending by Category
          </h2>
        <p className="text-slate-500 text-sm">
          {months[month]} {currentYear}
        </p>
        </div>

        <Select value={String(month)} onValueChange={setMonth}>
          <SelectTrigger className="w-40 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem
                key={i}
                value={String(i)}
                className="cursor-pointer"
              >
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[260px] text-slate-500 text-sm">
          No spending data for {months[month]} {currentYear}.
        </div>
      ) : (
        <div className="flex items-center">
        <div className="w-1/2 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(v) => `$${v}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-1/2 space-y-3">
          {data.map((d, i) => (
            <div
              key={i}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-slate-700">
                  {d.name}
                </span>
              </div>

              <span className="font-semibold text-slate-900">
                {d.percent}%
              </span>
            </div>
          ))}
        </div>
        
      </div>
      )}
    </Card>
  );
}