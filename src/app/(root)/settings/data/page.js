"use client";

import { useState, useRef, useEffect } from "react";
import {
  MdUpload,
  MdDownload,
  MdOutlineDescription,
  MdFormatListBulleted,
  MdArrowBack,
} from "react-icons/md";
import Link from "next/link";
import RequiredColumnsModal from "@/components/RequiredColumnsModal";
import FormatGuidelinesModal from "@/components/FormatGuidelinesModal";
import {
  handleFileSelect,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDownloadTemplate,
} from "@/lib/import.actions";
import PreviewTransactions from "@/components/PreviewTransactions";
import { getBudgetByMonthAndYear } from "@/lib/budget.actions";
import { getAllSavingGoals } from "@/lib/savingGoal.actions";
import { addTransaction } from "@/lib/transaction.actions";

export default function DataManagementPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploadedRows, setUploadedRows] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [categories, setCategories] = useState([]);

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;

  const year = Number(selectedYear);
  const month = Number(selectedMonth);
  const minYear = 2000;

  const isUploadDisabled =
    !selectedMonth ||
    !selectedYear ||
    Number(selectedYear) < minYear ||
    Number(selectedYear) > currentYear ||
    (year === currentYear && month > currentMonth);

  const handleBrowseClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const formatItems = [
    {
      title: "Download sample Excel template",
      description: "Get a ready-to-use template with sample data",
      onClick: handleDownloadTemplate,
      icon: MdDownload,
    },
    {
      title: "View required columns list",
      description: "See all required fields and their formats",
      onClick: () => setShowColumnsModal(true),
      icon: MdFormatListBulleted,
    },
    {
      title: "Format guidelines",
      description: "Detailed formatting rules and requirements",
      onClick: () => setShowGuidelinesModal(true),
      icon: MdOutlineDescription,
    },
  ];

  useEffect(() => {
    if (!isUploadDisabled) {
      async function fetchExpenseCategories() {
        const month = Number(selectedMonth);
        const year = Number(selectedYear);

        const [b, s] = await Promise.all([
          getBudgetByMonthAndYear(month - 1, year),
          getAllSavingGoals(),
        ]);

        const merged = [
          ...(b.budgets || []).map((x) => ({
            id: x.id,
            name: x.purpose,
            model: "Budget",
          })),
          ...(s.savingGoals || []).map((x) => ({
            id: x.id,
            name: x.purpose,
            model: "Saving Goal",
          })),
        ];

        setCategories(merged);
      }

      fetchExpenseCategories();
    }
  }, [selectedMonth, selectedYear, isUploadDisabled]);

  const handleCategoryChange = (rowId, categoryId) => {
    setUploadedRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, categoryId } : r)),
    );
  };

  const saveTransaction = async (row) => {
    try {
      const payload = {
        type: row.type,
        amount: row.amount,
        date: row.date,
        paymentMethod: row.paymentMethod,
        note: row.note,
      };
      if (row.type === "INCOME") {
        payload.category = row.categoryId;
      } else {
        const [model, id] = String(row.categoryId).split(":");

        const selected = categories.find(
          (c) => c.model === model && String(c.id) === String(id),
        );

        payload.category = selected.name;

        if (selected.model === "Budget") {
          payload.budgetId = selected.id;
          payload.savingGoalId = null;
        } else {
          payload.budgetId = null;
          payload.savingGoalId = selected.id;
        }
      }
      console.log(payload);

      await addTransaction(payload);
    } catch (e) {
      throw e;
    }
  };

  const handleSaveAll = async (rows) => {
    for (const row of rows) {
      await saveTransaction(row);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl flex flex-col">
          {/* Header */}
          <div className="px-8 py-6 border-b">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/settings"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MdArrowBack size={24} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold mb-1">Data Management</h1>
                <p className="text-sm text-gray-500">
                  Import your financial transactions and manage your stored data
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8">
            {/* Import Transactions Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Import Transactions (CSV, Excel)
              </h2>

              {/* Timeframe Selection */}
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-4 text-gray-700">
                  Select Timeframe
                </h2>

                <div className="flex gap-4">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border px-4 py-2 rounded-lg"
                  >
                    <option value="">Select Month</option>
                    {[
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
                    ].map((month, idx) => (
                      <option key={idx} value={idx + 1}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={minYear}
                    max={currentYear}
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    placeholder="Year (e.g., 2026)"
                    className="border px-4 py-2 rounded-lg w-45"
                  />
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`mb-8 ${isUploadDisabled && "opacity-50 cursor-not-allowed"}`}
              >
                <h3 className="text-lg font-medium mb-4 text-gray-700">
                  File Upload
                </h3>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) =>
                    handleFileSelect(
                      e,
                      setUploadedRows,
                      setIsPreviewOpen,
                      fileInputRef,
                      selectedMonth,
                      selectedYear,
                    )
                  }
                  accept=".csv,.xls,.xlsx"
                  multiple
                  className="hidden"
                />
                <div
                  onDragOver={(e) =>
                    !isUploadDisabled && handleDragOver(e, setIsDragging)
                  }
                  onDragLeave={(e) =>
                    !isUploadDisabled && handleDragLeave(e, setIsDragging)
                  }
                  onDrop={(e) =>
                    !isUploadDisabled &&
                    handleDrop(
                      e,
                      setIsDragging,
                      setUploadedRows,
                      setIsPreviewOpen,
                      selectedMonth,
                      selectedYear,
                    )
                  }
                  onClick={() => !isUploadDisabled && handleBrowseClick()}
                  className={`
                    border-2 border-dashed rounded-2xl p-8 text-center 
                    transition-all duration-200
                    ${
                      isUploadDisabled
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                        : isDragging
                          ? "border-emerald-500 bg-emerald-50 cursor-pointer"
                          : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50 cursor-pointer"
                    }
                  `}
                >
                  <MdUpload className="mx-auto text-4xl mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Drag & Drop File</p>
                  <p className="text-gray-600 mb-4">
                    CSV or XLSX file. File size limit: 25MB
                  </p>
                  <button
                    className={`"px-6 py-2 w-40 bg-gray-200 ${isUploadDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 cursor-pointer"} rounded-lg font-medium transition-colors "`}
                  >
                    Browse Files
                  </button>
                </div>

                {/* Uploaded Files Preview */}

                <PreviewTransactions
                  uploadedRows={uploadedRows}
                  categories={categories}
                  isOpen={isPreviewOpen}
                  setIsPreviewOpen={setIsPreviewOpen}
                  onChangeCategory={handleCategoryChange}
                  onSaveAll={handleSaveAll}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* File Format Requirements */}
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                File Format Requirements
              </h2>
              <div className="space-y-4">
                {formatItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="group flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200 w-full text-left cursor-pointer"
                  >
                    <div className="p-3 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      <item.icon size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 group-hover:text-emerald-700">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-emerald-600 font-medium text-lg">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 text-center text-xs text-gray-400 border-t">
            © 2025 Money Smart. All rights reserved · Privacy Policy
          </div>
        </div>
      </section>

      {/* Required Columns Modal */}
      <RequiredColumnsModal
        shown={showColumnsModal}
        onClose={() => setShowColumnsModal(false)}
      />

      {/* Format Guidelines Modal */}
      <FormatGuidelinesModal
        shown={showGuidelinesModal}
        onClose={() => setShowGuidelinesModal(false)}
        onDownload={() => {
          handleDownloadTemplate();
          setShowGuidelinesModal(false);
        }}
      />
    </>
  );
}
