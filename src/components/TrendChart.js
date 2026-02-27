"use client";

import { useState, useMemo } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";

export default function TrendChart({ transactions = [] }) {
  const [chartType, setChartType] = useState("bar");

  // 📊 Weekly Income vs Expense
  const weeklyData = useMemo(() => {
    const weeks = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const week = getWeekNumber(date);

      if (!weeks[week]) {
        weeks[week] = { income: 0, expense: 0 };
      }

      if (t.type === "INCOME") {
        weeks[week].income += Number(t.amount || 0);
      } else if (t.type === "EXPENSE") {
        weeks[week].expense += Number(t.amount || 0);
      }
    });

    return Object.entries(weeks).map(([week, values]) => ({
      label: `Week ${week}`,
      income: values.income,
      expense: values.expense,
    }));
  }, [transactions]);

  // 🥧 Expense Category Breakdown
  const expenseByCategory = useMemo(() => {
    const map = {};

    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        const category = t.category || "Other";
        map[category] = (map[category] || 0) + Number(t.amount || 0);
      });

    return Object.entries(map).map(([label, value], index) => ({
      id: index,
      label,
      value,
    }));
  }, [transactions]);

  return (
   <Box
    sx={{
      backgroundColor: "white",
      borderRadius: 4,
      p: 3,
      boxShadow: 2,
      mt: 4,

      width: "100%",      // allow responsiveness
      maxWidth: 750,      // control chart width (adjust if needed)
      ml: 0,              // stick to left
    }}
  >
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          Financial Trends
        </Typography>

        <Select
          size="small"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <MenuItem value="bar">Weekly Trend</MenuItem>
          <MenuItem value="pie">Expense Breakdown</MenuItem>
        </Select>
      </Box>

      {chartType === "bar" ? (
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: weeklyData.map((d) => d.label),
            },
          ]}
          series={[
            {
              label: "Income",
              data: weeklyData.map((d) => d.income),
            },
            {
              label: "Expense",
              data: weeklyData.map((d) => d.expense),
            },
          ]}
          height={320}
        />
      ) : (
        <PieChart
          series={[
            {
              data: expenseByCategory,
            },
          ]}
          height={320}
        />
      )}
    </Box>
  );
}

function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const diff = date - firstDay;
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}