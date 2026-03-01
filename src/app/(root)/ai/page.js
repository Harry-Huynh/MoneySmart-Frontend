"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AIInsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const periodOptions = [
    { value: "October 2025", text: "October 2025" },
    { value: "September 2025", text: "September 2025" },
    { value: "August 2025", text: "August 2025" },
  ];

  const mock = useMemo(() => {
    if (!selectedPeriod) return null;

    return {
      period: selectedPeriod,

      summary: {
        income: 3200,
        expense: 2750,
        bullets: [
          "You spent 20% more on dining this month (~$245 over average).",
          "Your monthly gas spending has increased by 32%.",
        ],
      },

      detailed: {
        keyInsight:
          "Your spending increased by 15% this month (+$320). Primary factor: Dining & Entertainment (+$245).",
        breakdown: [
          { category: "Dining Out", thisMonth: 370, change: "+20%" },
          { category: "Groceries", thisMonth: 180, change: "-10%" },
          { category: "Transportation", thisMonth: 150, change: "0%" },
          { category: "Entertainment", thisMonth: 125, change: "+45%" },
          { category: "Utilities", thisMonth: 90, change: "+2%" },
          { category: "Shopping", thisMonth: 220, change: "+15%" },
        ],
        patterns: [
          "You typically overspend on weekends (+40%).",
          "Online shopping peaks mid-month (payday effect).",
          "Coffee shop visits: 18 times this month (↑6).",
          "Subscriptions: $67/month across 7 services.",
        ],
        actionPlan: [
          { title: "Week 1", items: ["Set up $150 auto-transfer to savings", "Cancel unused subscriptions"] },
          { title: "Week 2", items: ["Cook 4 meals at home", "Review credit card spending categories"] },
          { title: "Week 3", items: ["Compare insurance rates (potential $20/mo save)"] },
          { title: "Week 4", items: ["Review monthly progress", "Plan next month budget"] },
        ],
        savingOpportunity:
          "Based on your spending, consider setting aside $150/month for an emergency fund.",
        forecast: [
          { label: "Rent", amount: 1000, due: "in 3 days" },
          { label: "Utilities", amount: 180, due: "in 12 days" },
          { label: "Gas", amount: 60, due: "weekly" },
        ],
      },
    };
  }, [selectedPeriod]);

  const handleDismiss = () => {
    setSelectedPeriod("");
  };

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex flex-col gap-6">
        <div className="w-full px-8 py-6 flex flex-wrap justify-between items-center border-b">
          <div>
            <h1 className="text-2xl font-bold mb-1">AI Insights</h1>
            <p className="text-sm text-gray-500">Smart analysis & recommendations</p>
          </div>

          <div className="w-[340px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between rounded-xl cursor-pointer"
                >
                  <span className="truncate">
                    {selectedPeriod ? selectedPeriod : "Select Month & Year"}
                  </span>
                  <span className="text-gray-400">▾</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[340px]">
                <DropdownMenuLabel>Select Month & Year</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedPeriod || undefined}
                  onValueChange={(val) => setSelectedPeriod(val)}
                >
                  {periodOptions.map((opt) => (
                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                      {opt.text}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="px-8 pb-8">
          {!selectedPeriod && (
            <div className="bg-gray-50 rounded-2xl p-10 text-center text-gray-600">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                Select a month to generate insights
              </p>
              <p className="text-sm">
                We’ll analyze your income vs expenses and provide actionable recommendations.
              </p>
            </div>
          )}

          {selectedPeriod && mock && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">AI Detailed Analysis</h2>
                <div className="text-sm text-gray-500">
                  Analysis period: <span className="font-semibold">{mock.period}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-3">This Month Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border p-4 h-40 flex items-center justify-center text-gray-400 text-sm">
                    Chart (mock)
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <div className="text-sm mb-3">
                      <span className="font-semibold">Income:</span> ${mock.summary.income}{" "}
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="font-semibold">Expenses:</span> ${mock.summary.expense}
                    </div>
                    <ul className="list-disc ml-5 text-sm space-y-2">
                      {mock.summary.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Key Insight</h3>
                <div className="bg-white rounded-xl border p-4 text-sm">{mock.detailed.keyInsight}</div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-4">Spending Breakdown by Category</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border p-4 h-52 flex items-center justify-center text-gray-400 text-sm">
                    Bar Chart (mock)
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <div className="text-sm font-semibold mb-3">Change in Spending</div>
                    <div className="space-y-2 text-sm">
                      {mock.detailed.breakdown.map((row, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{row.category}</span>
                          <span>
                            ${row.thisMonth}{" "}
                            <span className="text-gray-500 ml-2">{row.change}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white rounded-xl border p-4 h-52 flex items-center justify-center text-gray-400 text-sm">
                    Spending Trend (mock)
                  </div>
                  <div className="bg-white rounded-xl border p-4 h-52 flex items-center justify-center text-gray-400 text-sm">
                    Budget vs Actual (mock)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold mb-3">Upcoming Forecast</h3>
                  <div className="bg-white rounded-xl border p-4">
                    <div className="space-y-2 text-sm">
                      {mock.detailed.forecast.map((f, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{f.label}</span>
                          <span className="text-gray-700">
                            -${f.amount} <span className="text-gray-400">({f.due})</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold mb-3">Savings Opportunity</h3>
                  <div className="bg-white rounded-xl border p-4 text-sm">
                    {mock.detailed.savingOpportunity}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-3">Pattern Recognition</h3>
                <ul className="list-disc ml-5 text-sm space-y-2">
                  {mock.detailed.patterns.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-4">Personalized Action Plan</h3>
                <div className="bg-white rounded-xl border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {mock.detailed.actionPlan.map((w, i) => (
                      <div key={i} className="border rounded-xl p-4">
                        <div className="font-semibold mb-2">{w.title}</div>
                        <ul className="list-disc ml-5 space-y-1">
                          {w.items.map((it, j) => (
                            <li key={j}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 justify-center">
                    <button className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold cursor-pointer">
                      PDF Report
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold cursor-pointer">
                      Excel Sheet
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold cursor-pointer">
                      Email to Me
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}