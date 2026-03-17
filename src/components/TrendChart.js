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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { parseLocalDate, getWeekNumber } from "@/lib/utils";

export default function TrendChart({
  transactions = [],
  defaultViewType = "monthly",
  lockedViewType,
  selectedMonth,
  selectedYear,
  title = "Cash Flow",
  showCard = true,
}) {
  const [viewType, setViewType] = useState(defaultViewType);
  const [range, setRange] = useState("6");

  const activeViewType = lockedViewType || viewType;

  /* ---------------- Filter by Date Range (Monthly Only) ---------------- */
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const monthsBack = Number(range);

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - monthsBack + 1,
      1,
    );

    return transactions.filter((t) => {
      const date = parseLocalDate(t.date);
      return date >= startDate && date <= now;
    });
  }, [transactions, range]);

  /* ---------------- Monthly Data ---------------- */
  const monthlyData = useMemo(() => {
    const now = new Date();
    const monthsBack = Number(range);
    const result = [];

    for (let i = monthsBack - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const monthTransactions = filteredTransactions.filter((t) => {
        const d = parseLocalDate(t.date);
        return (
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
        );
      });

      const income = monthTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const expense = monthTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      result.push({
        name: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        fullName: date.toLocaleString("default", { month: "long" }),
        year: date.getFullYear(),
        income,
        expense,
      });
    }

    return result;
  }, [filteredTransactions, range]);

  /* ---------------- Weekly Data ---------------- */
  const weeklyData = useMemo(() => {
    const now = new Date();
    const targetMonth =
      selectedMonth !== undefined ? Number(selectedMonth) : now.getMonth();
    const targetYear =
      selectedYear !== undefined ? Number(selectedYear) : now.getFullYear();

    const currentMonthTransactions = transactions.filter((t) => {
      const d = parseLocalDate(t.date);
      return (
        d.getMonth() === targetMonth && d.getFullYear() === targetYear
      );
    });

    const weeks = [1, 2, 3, 4, 5].map((week) => ({
      name: `Week ${week}`,
      income: 0,
      expense: 0,
    }));

    currentMonthTransactions.forEach((t) => {
      const date = parseLocalDate(t.date);
      const week = getWeekNumber(date) - 1;

      if (weeks[week]) {
        if (t.type === "INCOME") {
          weeks[week].income += Number(t.amount || 0);
        } else if (t.type === "EXPENSE") {
          weeks[week].expense += Number(t.amount || 0);
        }
      }
    });

    return weeks;
  }, [transactions, selectedMonth, selectedYear]);

  const chartData = activeViewType === "monthly" ? monthlyData : weeklyData;
  const targetDate =
    selectedMonth !== undefined && selectedYear !== undefined
      ? new Date(Number(selectedYear), Number(selectedMonth), 1)
      : new Date();
  const currentMonthLabel = targetDate.toLocaleString("default", {
    month: "long",
  });
  const currentMonthYear = `${currentMonthLabel} ${targetDate.getFullYear()}`;

  const chartContent = (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>

        {!lockedViewType && (
          <div className="flex gap-4">
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-36 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly" className="cursor-pointer">
                  Monthly
                </SelectItem>
                <SelectItem value="weekly" className="cursor-pointer">
                  Weekly
                </SelectItem>
              </SelectContent>
            </Select>

            {activeViewType === "monthly" && (
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="w-36 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3" className="cursor-pointer">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="6" className="cursor-pointer">
                    Last 6 months
                  </SelectItem>
                  <SelectItem value="12" className="cursor-pointer">
                    Last 12 months
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      <div className="w-full h-90">
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${value}`} />

            <Tooltip
              labelFormatter={(label, payload) => {
                if (payload?.length) {
                  if (activeViewType === "monthly") {
                    const { fullName, year } = payload[0].payload;
                    return `${fullName} ${year}`;
                  }

                  if (activeViewType === "weekly") {
                    return `${label} - ${currentMonthYear}`;
                  }
                }
                return label;
              }}
              formatter={(value) => `$${value}`}
            />

            <Bar
              dataKey="income"
              name="Income"
              fill="#4f915f"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#D32F2F"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {activeViewType === "weekly" && (
          <div className="text-center text-xl font-extrabold text-slate-900 mt-1">
            {currentMonthYear}
          </div>
        )}

        <div className="flex justify-center gap-10 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#4f915f] rounded-sm"></div>
            <span className="text-lg text-slate-800">Income</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-700 rounded-sm"></div>
            <span className="text-lg text-slate-800">Expense</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={`${showCard ? "mt-8" : ""} flex justify-start`}>
      {showCard ? (
        <Card className="w-full rounded-2xl p-6 shadow-sm">{chartContent}</Card>
      ) : (
        <div className="w-full">{chartContent}</div>
      )}
    </div>
  );
}
