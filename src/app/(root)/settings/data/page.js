"use client";

import { useState, useRef } from "react";
import {
  MdUpload,
  MdDownload,
  MdOutlineDescription,
  MdFormatListBulleted,
  MdArrowBack,
  MdClose,
} from "react-icons/md";
import Link from "next/link";

export default function DataManagementPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      const validExtensions = ['.csv', '.xls', '.xlsx'];
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      
      return validTypes.includes(file.type) || validExtensions.includes(extension);
    });

    setUploadedFiles(validFiles);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleDownloadTemplate = () => {
    // Create sample CSV data based on your Transaction model
    const sampleData = [
      ["category", "amount", "type", "date", "note", "paymentMethod"],
      ["Salary", "3500", "INCOME", "2026-01-15", "January salary", "CARD"],
      ["Groceries", "120.45", "EXPENSE", "2026-01-18", "Weekly groceries", "CASH"],
      ["Rent", "1800", "EXPENSE", "2026-01-01", "January rent", "CHEQUE"],
      ["Dining", "45.75", "EXPENSE", "2026-01-20", "Dinner with friends", "CARD"],
      ["Freelance", "800", "INCOME", "2026-01-25", "Web design project", "CASH"]
    ];
    
    // Create CSV content
    const csvContent = sampleData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_transactions.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const requiredColumns = [
    {
      name: "category",
      type: "string",
      required: true,
      description: "Transaction category (e.g., Groceries, Salary, Rent)",
      example: "Groceries"
    },
    {
      name: "amount",
      type: "number",
      required: true,
      description: "Transaction amount (positive number with 2 decimal places)",
      example: "120.45"
    },
    {
      name: "type",
      type: "string",
      required: true,
      description: "Must be either 'INCOME' or 'EXPENSE' (case sensitive)",
      example: "EXPENSE"
    },
    {
      name: "date",
      type: "date",
      required: true,
      description: "Transaction date in YYYY-MM-DD format",
      example: "2026-01-18"
    },
    {
      name: "note",
      type: "string",
      required: false,
      description: "Optional description or memo for the transaction",
      example: "Weekly groceries"
    },
    {
      name: "paymentMethod",
      type: "string",
      required: true,
      description: "Must be 'CASH', 'CHEQUE', or 'CARD' (case sensitive)",
      example: "CASH"
    }
  ];

  const formatGuidelines = [
    {
      title: "File Format",
      items: [
        "Supported formats: CSV (.csv), Excel (.xls, .xlsx)",
        "Maximum file size: 25MB",
        "First row must contain column headers",
        "Use UTF-8 encoding for CSV files"
      ]
    },
    {
      title: "Data Formatting",
      items: [
        "Dates must be in YYYY-MM-DD format (e.g., 2026-01-15)",
        "Amounts must be numbers (e.g., 120.45, 1800.00)",
        "Text fields should not contain commas if using CSV",
        "Empty cells for optional fields are allowed"
      ]
    },
    {
      title: "Validation Rules",
      items: [
        "Amount must be greater than 0",
        "Type must be exactly 'INCOME' or 'EXPENSE'",
        "Payment method must be exactly 'CASH', 'CHEQUE', or 'CARD'",
        "Date must be a valid calendar date"
      ]
    },
    {
      title: "Tips",
      items: [
        "Download the sample template to see correct formatting",
        "Save your file as CSV for best compatibility",
        "Check for trailing spaces in text fields",
        "Ensure decimal points are used (not commas)"
      ]
    }
  ];

  const handleCancel = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatItems = [
    {
      title: "Download sample CSV/Excel template",
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

              {/* File Upload Area */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-700">File Upload</h3>
                
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".csv,.xls,.xlsx"
                  multiple
                  className="hidden"
                />
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                  className={`
                    border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                    transition-all duration-200
                    ${isDragging
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
                    }
                  `}
                >
                  <MdUpload className="mx-auto text-4xl mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">
                    Drag & Drop File(s)
                  </p>
                  <p className="text-gray-600 mb-4">
                    CSV or XLSX files. File size limit: 25MB
                  </p>
                  <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors">
                    Browse Files
                  </button>
                </div>

                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium mb-2">Selected Files:</h4>
                    <ul className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newFiles = [...uploadedFiles];
                              newFiles.splice(index, 1);
                              setUploadedFiles(newFiles);
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    onClick={() => alert("Import functionality would process the uploaded files")}
                    disabled={uploadedFiles.length === 0}
                    className={`
                      px-8 py-3 rounded-lg font-medium transition-colors
                      ${uploadedFiles.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }
                    `}
                  >
                    Import
                  </button>
                  <button
                    onClick={() => alert("Save functionality would store the uploaded files")}
                    disabled={uploadedFiles.length === 0}
                    className={`
                      px-8 py-3 rounded-lg font-medium transition-colors
                      ${uploadedFiles.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                      }
                    `}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={uploadedFiles.length === 0}
                    className={`
                      px-8 py-3 rounded-lg font-medium transition-colors
                      ${uploadedFiles.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                      }
                    `}
                  >
                    Cancel
                  </button>
                </div>
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
                    className="group flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200 w-full text-left"
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
                    <span className="text-emerald-600 font-medium text-lg">→</span>
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
      {showColumnsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Required Columns</h2>
                <button
                  onClick={() => setShowColumnsModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MdClose size={24} className="text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Your file must include these columns in the exact order shown below:
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-4 font-semibold text-gray-700 border-b">Column Name</th>
                      <th className="text-left p-4 font-semibold text-gray-700 border-b">Type</th>
                      <th className="text-left p-4 font-semibold text-gray-700 border-b">Required</th>
                      <th className="text-left p-4 font-semibold text-gray-700 border-b">Description</th>
                      <th className="text-left p-4 font-semibold text-gray-700 border-b">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requiredColumns.map((column, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <span className="font-medium text-gray-800">{column.name}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            column.type === 'string' ? 'bg-blue-100 text-blue-800' :
                            column.type === 'number' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {column.type}
                          </span>
                        </td>
                        <td className="p-4">
                          {column.required ? (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Required
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                              Optional
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">{column.description}</td>
                        <td className="p-4">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {column.example}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                <h3 className="font-semibold text-emerald-800 mb-4">Sample Data Preview</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-emerald-100">
                        <th className="p-3 font-medium text-emerald-800 border-b">category</th>
                        <th className="p-3 font-medium text-emerald-800 border-b">amount</th>
                        <th className="p-3 font-medium text-emerald-800 border-b">type</th>
                        <th className="p-3 font-medium text-emerald-800 border-b">date</th>
                        <th className="p-3 font-medium text-emerald-800 border-b">note</th>
                        <th className="p-3 font-medium text-emerald-800 border-b">paymentMethod</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border-b">Salary</td>
                        <td className="p-3 border-b">3500</td>
                        <td className="p-3 border-b">INCOME</td>
                        <td className="p-3 border-b">2026-01-15</td>
                        <td className="p-3 border-b">January salary</td>
                        <td className="p-3 border-b">CARD</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-b">Groceries</td>
                        <td className="p-3 border-b">120.45</td>
                        <td className="p-3 border-b">EXPENSE</td>
                        <td className="p-3 border-b">2026-01-18</td>
                        <td className="p-3 border-b">Weekly groceries</td>
                        <td className="p-3 border-b">CASH</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-b">Rent</td>
                        <td className="p-3 border-b">1800</td>
                        <td className="p-3 border-b">EXPENSE</td>
                        <td className="p-3 border-b">2026-01-01</td>
                        <td className="p-3 border-b">January rent</td>
                        <td className="p-3 border-b">CHEQUE</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-emerald-700 mt-4">
                  Note: Your file should follow this exact format with the same column headers.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowColumnsModal(false)}
                  className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Format Guidelines Modal */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Format Guidelines</h2>
                <button
                  onClick={() => setShowGuidelinesModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MdClose size={24} className="text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Follow these guidelines to ensure your file imports successfully
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formatGuidelines.map((section, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">Quick Reference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Valid Values</h4>
                    <ul className="space-y-1">
                      <li className="text-sm text-blue-600">• Type: INCOME or EXPENSE</li>
                      <li className="text-sm text-blue-600">• Payment: CASH, CHEQUE, or CARD</li>
                      <li className="text-sm text-blue-600">• Date: YYYY-MM-DD format</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Common Mistakes</h4>
                    <ul className="space-y-1">
                      <li className="text-sm text-blue-600">• Using commas in CSV text fields</li>
                      <li className="text-sm text-blue-600">• Incorrect date format</li>
                      <li className="text-sm text-blue-600">• Missing required columns</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <MdDownload className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-800">Need an example?</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Download the sample template to see exactly how your data should be formatted.
                    </p>
                    <button
                      onClick={() => {
                        handleDownloadTemplate();
                        setShowGuidelinesModal(false);
                      }}
                      className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      Download Sample Template
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowGuidelinesModal(false)}
                  className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}