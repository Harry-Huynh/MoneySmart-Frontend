"use client";

import { useEffect, useMemo, useState } from "react";
import {
  conductSystemPromptAndUserPrompt,
  getTransactionsForAnalysisMonth,
} from "@/AI/userPrompt.actions";
import { getAllBudgets, getBudgetByMonthAndYear } from "@/lib/budget.actions";
import { getAllSavingGoals } from "@/lib/savingGoal.actions";
import Loading from "@/components/Loading";
import TrendChart from "@/components/TrendChart";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import { toPng } from "html-to-image";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function buildPeriodKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function extractBudgetPeriodKeys(budget) {
  if (budget?.startDate) {
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate || budget.startDate);

    if (
      !Number.isNaN(startDate.getTime()) &&
      !Number.isNaN(endDate.getTime())
    ) {
      const cursor = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1,
      );
      const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      const periodKeys = [];

      while (cursor <= lastMonth) {
        periodKeys.push(
          buildPeriodKey(cursor.getFullYear(), cursor.getMonth() + 1),
        );
        cursor.setMonth(cursor.getMonth() + 1);
      }

      return periodKeys;
    }
  }

  if (
    typeof budget?.month === "number" &&
    typeof budget?.year === "number"
  ) {
    return [buildPeriodKey(budget.year, budget.month + 1)];
  }

  return [];
}

function extractSavingGoalPeriodKey(goal) {
  if (!goal?.targetDate) return null;

  const targetDate = new Date(goal.targetDate);

  if (Number.isNaN(targetDate.getTime())) return null;

  return buildPeriodKey(targetDate.getFullYear(), targetDate.getMonth() + 1);
}

export default function AIInsightsPage() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);
  const [error, setError] = useState("");
  const [aiData, setAiData] = useState(null);
  const [analysisTransactions, setAnalysisTransactions] = useState([]);
  const [availablePeriodKeys, setAvailablePeriodKeys] = useState(new Set());
  const reportRef = useRef(null);
  const chartRef = useRef(null);
  const sectionRefs = useRef([]);
  const minYear = 2000;
  const selectedPeriod =
    selectedMonth && selectedYear
      ? buildPeriodKey(Number(selectedYear), Number(selectedMonth))
      : "";
  const selectedPeriodLabel =
    selectedMonth && selectedYear
      ? `${monthNames[Number(selectedMonth) - 1]} ${selectedYear}`
      : "";

  useEffect(() => {
    async function fetchAvailablePeriods() {
      try {
        setIsLoadingPeriods(true);
        const [budgetsResult, savingGoalsResult] = await Promise.all([
          getAllBudgets(),
          getAllSavingGoals(),
        ]);

        const nextAvailablePeriods = new Set();

        for (const budget of budgetsResult?.budgets || []) {
          for (const periodKey of extractBudgetPeriodKeys(budget)) {
            nextAvailablePeriods.add(periodKey);
          }
        }

        for (const goal of savingGoalsResult?.savingGoals || []) {
          const periodKey = extractSavingGoalPeriodKey(goal);

          if (periodKey) {
            nextAvailablePeriods.add(periodKey);
          }
        }

        setAvailablePeriodKeys(nextAvailablePeriods);
      } catch (err) {
        setError(err?.message || "Failed to load available analysis periods.");
      } finally {
        setIsLoadingPeriods(false);
      }
    }

    fetchAvailablePeriods();
  }, []);

  useEffect(() => {
    if (!selectedYear || String(selectedYear).length !== 4) return;

    async function syncYearWithBudgetData() {
      try {
        const budgetChecks = await Promise.all(
          Array.from({ length: 12 }, (_, monthIndex) =>
            getBudgetByMonthAndYear(monthIndex, Number(selectedYear)),
          ),
        );

        setAvailablePeriodKeys((prev) => {
          const next = new Set(prev);

          budgetChecks.forEach((result, monthIndex) => {
            if ((result?.budgets || []).length > 0) {
              next.add(buildPeriodKey(Number(selectedYear), monthIndex + 1));
            }
          });

          return next;
        });
      } catch {
        // Keep the preloaded availability when month-specific sync fails.
      }
    }

    syncYearWithBudgetData();
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedMonth || !selectedYear) return;

    if (!availablePeriodKeys.has(selectedPeriod)) {
      setSelectedMonth("");
      setShowAnalysis(false);
      setAiData(null);
      setAnalysisTransactions([]);
    }
  }, [availablePeriodKeys, selectedMonth, selectedPeriod, selectedYear]);

  const availableMonthsForSelectedYear = useMemo(() => {
    if (!selectedYear || String(selectedYear).length !== 4) return new Set();

    const months = new Set();

    availablePeriodKeys.forEach((periodKey) => {
      const [year, month] = periodKey.split("-");

      if (year === String(selectedYear)) {
        months.add(Number(month));
      }
    });

    return months;
  }, [availablePeriodKeys, selectedYear]);

  const isSelectionAvailable =
    selectedMonth &&
    selectedYear &&
    availablePeriodKeys.has(selectedPeriod);

  const data = useMemo(() => {
    if (!selectedPeriod || !aiData) return null;

    return {
      period: aiData.summary?.analysisPeriod || selectedPeriodLabel || selectedPeriod,
      summary: {
        income: aiData.thisMonthSummary?.income || 0,
        expense: aiData.thisMonthSummary?.expenses || 0,
        bullets: aiData.thisMonthSummary?.insights || [],
      },
      detailed: {
        keyInsight: aiData.keyInsight?.message || "",
        breakdown: aiData.spendingBreakdown?.items || [],
        patterns: aiData.smartSpendingSuggestion?.items || [],
        actionPlan: aiData.actionPlan?.weeks || [],
        savingOpportunity: aiData.savingsOpportunity?.message || "",
        budgetWarnings: aiData.budgetOpportunity?.items || [],
      },
    };
  }, [selectedPeriod, selectedPeriodLabel, aiData]);

  const handleViewAnalysis = async () => {
    if (!isSelectionAvailable) return;

    try {
      setIsLoading(true);
      setError("");
      setShowAnalysis(false);
      const analysisMonth = Number(selectedMonth) - 1;
      const analysisYear = Number(selectedYear);

      const [result, transactions] = await Promise.all([
        conductSystemPromptAndUserPrompt(analysisMonth, analysisYear),
        getTransactionsForAnalysisMonth(analysisMonth, analysisYear),
      ]);

      setAiData(result);
      setAnalysisTransactions(transactions);
      setShowAnalysis(true);
    } catch (err) {
      setAiData(null);
      setAnalysisTransactions([]);
      setError(err?.message || "Failed to load AI insights.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownloadPDF = async () => {
    console.log("Clicked PDF button");

    try {
      const pdf = new jsPDF("p", "mm", "a4");

      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();

      let y = 10;

      // ✅ Add Title
      pdf.setFontSize(16);
      pdf.text("AI Financial Report", 10, y);

      y += 6;

      // ✅ Add current date
      const today = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${today}`, 10, y);

      y += 8; // smaller spacing

      for (let i = 0; i < sectionRefs.current.length; i++) {
        const section = sectionRefs.current[i];

        if (!section) continue;

        // ❌ Remove button from last section
        const button = section.querySelector("button");
        if (button) button.style.display = "none";

        const imgData = await toPng(section, {
          cacheBust: true,
          backgroundColor: "#ffffff",
        });

        // ✅ Restore button after capture
        if (button) button.style.display = "";

        const imgProps = pdf.getImageProperties(imgData);

        const imgWidth = pageWidth - 20;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        // ✅ Prevent section splitting
        if (y + imgHeight > pageHeight) {
          pdf.addPage();
          y = 10;
        }

        pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);

        y += imgHeight + 4;
      }

      pdf.save(`AI_Report_${selectedPeriod}.pdf`);

      console.log("PDF GENERATED ✅");
    } catch (err) {
      console.error("PDF ERROR:", err);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex flex-col gap-6">
        <div className="w-full px-8 py-6 flex flex-wrap justify-between items-start border-b">
          <div>
            <h1 className="text-2xl font-bold mb-1">AI Insights</h1>
            <p className="text-sm text-gray-500">
              Smart analysis & recommendations
            </p>
          </div>

          <div className="w-85 space-y-3">
            <div>
              <div className="flex gap-4">
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setShowAnalysis(false);
                    setAiData(null);
                    setAnalysisTransactions([]);
                    setError("");
                  }}
                  className="border px-4 py-2 rounded-lg flex-1"
                  disabled={!selectedYear || String(selectedYear).length !== 4}
                >
                  <option value="">Select Month</option>
                  {monthNames.map((month, idx) => {
                    const monthValue = idx + 1;

                    return (
                      <option
                        key={month}
                        value={monthValue}
                        disabled={!availableMonthsForSelectedYear.has(monthValue)}
                      >
                        {month}
                      </option>
                    );
                  })}
                </select>

                <input
                  type="number"
                  min={minYear}
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setShowAnalysis(false);
                    setAiData(null);
                    setAnalysisTransactions([]);
                    setError("");
                  }}
                  placeholder="Year (e.g., 2026)"
                  className="border px-4 py-2 rounded-lg w-45"
                />
              </div>

              {!isLoadingPeriods &&
                selectedYear &&
                String(selectedYear).length === 4 &&
                availableMonthsForSelectedYear.size === 0 && (
                  <p className="mt-2 text-sm text-amber-700">
                    No budget or saving goal data found for {selectedYear}.
                  </p>
                )}
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded-xl bg-[#4f915f] hover:hover:bg-[#214a2b] text-white text-sm font-semibold transition cursor-pointer disabled:opacity-60"
                onClick={handleViewAnalysis}
                disabled={isLoading || isLoadingPeriods || !isSelectionAvailable}
              >
                {isLoading ? "Generating..." : "View Analysis"}
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="mt-2">
              <Loading embedded />
            </div>
          )}

          {selectedPeriod && showAnalysis && data && (
            <div ref={reportRef} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">AI Detailed Analysis</h2>
                <div className="text-sm text-gray-500">
                  Analysis period:{" "}
                  <span className="font-semibold">{data.period}</span>
                </div>
              </div>

              <div
                ref={(el) => (sectionRefs.current[0] = el)}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <h3 className="font-bold mb-4">This Month Summary</h3>

                <div className="space-y-4">
                  <div
                    ref={chartRef}
                    className="bg-white rounded-xl border p-4"
                  >
                    <TrendChart
                      transactions={analysisTransactions}
                      defaultViewType="weekly"
                      lockedViewType="weekly"
                      selectedMonth={Number(selectedMonth) - 1}
                      selectedYear={Number(selectedYear)}
                      showCard={false}
                      maxWeeks={4}
                    />
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <div className="text-sm mb-3">
                      <span className="font-semibold">Income:</span> $
                      {data.summary.income}{" "}
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="font-semibold">Expenses:</span> $
                      {data.summary.expense}
                    </div>

                    <ul className="list-disc ml-5 text-sm space-y-2">
                      {data.summary.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div
                ref={(el) => (sectionRefs.current[1] = el)}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <h3 className="font-bold mb-2">Key Insight</h3>
                <div className="bg-white rounded-xl border p-4 text-sm">
                  {data.detailed.keyInsight}
                </div>
              </div>

              <div
                ref={(el) => (sectionRefs.current[2] = el)}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <h3 className="font-bold mb-4">
                  Spending Breakdown by Category
                </h3>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl border p-4">
                    <div className="text-sm font-semibold mb-3">
                      Change in Spending
                    </div>
                    <div className="space-y-2 text-sm">
                      {data.detailed.breakdown.map((row, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{row.category}</span>
                          <span>
                            ${row.amount}
                            <span className="text-gray-500 ml-2">
                              {row.change}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={(el) => (sectionRefs.current[3] = el)}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <h3 className="font-bold mb-3">Savings Opportunity</h3>
                <div className="bg-white rounded-xl border p-4 text-sm">
                  {data.detailed.savingOpportunity}
                </div>
              </div>

              <div
                ref={(el) => (sectionRefs.current[4] = el)}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <h3 className="font-bold mb-3">Budget Opportunity</h3>
                <div className="bg-white rounded-xl border p-4 text-sm">
                  {data.detailed.budgetWarnings.map((b, i) => (
                    <div key={i} className="mb-4">
                      <div className="font-semibold">{b.category}</div>
                      <div className="text-gray-500 text-sm mb-1">
                        Budget: ${b.budget} | Spent: ${b.spent} | Status:{" "}
                        {b.status}
                      </div>
                      <div>{b.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                ref={(el) => (sectionRefs.current[5] = el)}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <h3 className="font-bold mb-3">Smart Spending Suggestion</h3>
                <ul className="list-disc ml-5 text-sm space-y-2">
                  {data.detailed.patterns.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div
                ref={(el) => (sectionRefs.current[6] = el)}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <h3 className="font-bold mb-4">Personalized Action Plan</h3>
                <div className="bg-white rounded-xl border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {data.detailed.actionPlan.slice(0, 4).map((w, i) => (
                      <div key={i} className="border rounded-xl p-4">
                        <div className="font-semibold mb-2">{w.week}</div>
                        <ul className="list-disc ml-5 space-y-1">
                          {(w.actions || []).map((it, j) => (
                            <li key={j}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex justify-center">
                    <button
                      onClick={handleDownloadPDF}
                      className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold cursor-pointer"
                    >
                      Download PDF Report
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
