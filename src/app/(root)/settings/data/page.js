"use client";

import { useState, useRef } from "react";
import {
  MdUpload,
  MdDownload,
  MdOutlineDescription,
  MdFormatListBulleted,
  MdOutlineTipsAndUpdates,
  MdErrorOutline,
  MdArrowBack,
} from "react-icons/md";
import Link from "next/link";

export default function DataManagementPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleImport = () => {
    console.log("Importing files:", uploadedFiles);
    alert("Import functionality would process the uploaded files");
  };

  const handleSave = () => {
    console.log("Saving files:", uploadedFiles);
    alert("Save functionality would store the uploaded files");
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const helpItems = [
    {
      title: "Download sample CSV/Excel template",
      href: "/templates/sample.csv",
      icon: MdDownload,
    },
    {
      title: "View required columns list",
      href: "/help/columns",
      icon: MdFormatListBulleted,
    },
    {
      title: "Format guidelines",
      href: "/help/format",
      icon: MdOutlineDescription,
    },
    {
      title: "Tutorial and FAQ",
      href: "/help/tutorial",
      icon: MdOutlineTipsAndUpdates,
    },
    {
      title: "Troubleshooting common errors",
      href: "/help/troubleshooting",
      icon: MdErrorOutline,
    },
  ];

  return (
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
                  onClick={handleImport}
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
                  onClick={handleSave}
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
                  className="px-8 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* File Format Requirements */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              File Format Requirements
            </h2>
            <div className="space-y-4">
              {helpItems.slice(0, 3).map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium flex-1">{item.title}</span>
                  <span className="text-emerald-600 font-medium">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Help & Support */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Help & Support
            </h2>
            <div className="space-y-4">
              {helpItems.slice(3).map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium flex-1">{item.title}</span>
                  <span className="text-blue-600 font-medium">→</span>
                </a>
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
  );
}