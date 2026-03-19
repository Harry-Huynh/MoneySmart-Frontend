"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  conductSystemPromptAndUserPrompt,
  getTransactionsForAnalysisMonth,
} from "@/AI/userPrompt.actions";
import TrendChart from "@/components/TrendChart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import { toPng } from "html-to-image";

export default function AIInsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiData, setAiData] = useState(null);
  const [analysisTransactions, setAnalysisTransactions] = useState([]);
  const reportRef = useRef(null);
  const chartRef = useRef(null);
  const sectionRefs = useRef([]);

  const periodOptions = [
    { value: "2026-03", text: "March 2026", month: 2, year: 2026 },
    { value: "2026-02", text: "February 2026", month: 1, year: 2026 },
    { value: "2026-01", text: "January 2026", month: 0, year: 2026 },
  ];

  const data = useMemo(() => {
    if (!selectedPeriod || !aiData) return null;

    return {
      period: aiData.summary?.analysisPeriod || selectedPeriod,
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
  }, [selectedPeriod, aiData]);

  const handleViewAnalysis = async () => {
    if (!selectedPeriod) return;

    const selectedOption = periodOptions.find(
      (option) => option.value === selectedPeriod,
    );

    if (!selectedOption) return;

    try {
      setIsLoading(true);
      setError("");
      setShowAnalysis(false);

      const [result, transactions] = await Promise.all([
        conductSystemPromptAndUserPrompt(
          selectedOption.month,
          selectedOption.year,
        ),
        getTransactionsForAnalysisMonth(
          selectedOption.month,
          selectedOption.year,
        ),
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between rounded-xl cursor-pointer"
                >
                  <span className="truncate">
                    {selectedPeriod
                      ? periodOptions.find(
                          (opt) => opt.value === selectedPeriod,
                        )?.text
                      : "Select Month & Year"}
                  </span>
                  <span className="text-gray-400">▼</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-85">
                <DropdownMenuLabel>Select Month & Year</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedPeriod || undefined}
                  onValueChange={(val) => {
                    setSelectedPeriod(val);
                    setShowAnalysis(false);
                    setAiData(null);
                    setAnalysisTransactions([]);
                    setError("");
                  }}
                >
                  {periodOptions.map((opt) => (
                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                      {opt.text}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold transition cursor-pointer disabled:opacity-60"
                onClick={handleViewAnalysis}
                disabled={isLoading}
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
              className="bg-gray-50 rounded-2xl p-6">
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
                      selectedMonth={
                        periodOptions.find(
                          (opt) => opt.value === selectedPeriod,
                        )?.month
                      }
                      selectedYear={
                        periodOptions.find(
                          (opt) => opt.value === selectedPeriod,
                        )?.year
                      }
                      showCard={false}
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
              className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Key Insight</h3>
                <div className="bg-white rounded-xl border p-4 text-sm">
                  {data.detailed.keyInsight}
                </div>
              </div>

              <div 
              ref={(el) => (sectionRefs.current[2] = el)}
              className="bg-gray-50 rounded-2xl p-6">
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
              className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-3">Savings Opportunity</h3>
                <div className="bg-white rounded-xl border p-4 text-sm">
                  {data.detailed.savingOpportunity}
                </div>
              </div>

              <div 
              ref={(el) => (sectionRefs.current[4] = el)}
              className="bg-gray-50 rounded-2xl p-6">
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
              className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-3">Smart Spending Suggestion</h3>
                <ul className="list-disc ml-5 text-sm space-y-2">
                  {data.detailed.patterns.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div 
              ref={(el) => (sectionRefs.current[6] = el)}
              className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-4">Personalized Action Plan</h3>
                <div className="bg-white rounded-xl border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {data.detailed.actionPlan.map((w, i) => (
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
