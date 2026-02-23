import * as XLSX from "xlsx";

export const handleFileSelect = (
  event,
  setUploadedRows,
  setOpenPreviewTable,
) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  const file = files[0];

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Skip header row
    const importedRows = rows.slice(1).map((row, index) => ({
      id: index,
      category: "",
      amount: row[0] || 0,
      type: row[1] || "",
      date: row[2] || "",
      note: row[3] || "",
      paymentMethod: row[4] || "",
    }));

    setUploadedRows(importedRows);
    setOpenPreviewTable(true);
    e.target.files = null;
  };
  reader.readAsArrayBuffer(file);
};

export const handleDragOver = (e, setIsDragging) => {
  e.preventDefault();
  setIsDragging(true);
};

export const handleDragLeave = (e, setIsDragging) => {
  e.preventDefault();
  setIsDragging(false);
};

export const handleDrop = (e, setIsDragging, setUploadedFiles) => {
  e.preventDefault();
  setIsDragging(false);

  const files = Array.from(e.dataTransfer.files);
  const validFiles = files.filter((file) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const validExtensions = [".csv", ".xls", ".xlsx"];
    const extension = "." + file.name.split(".").pop().toLowerCase();

    return (
      validTypes.includes(file.type) || validExtensions.includes(extension)
    );
  });

  setUploadedFiles(validFiles);
};

export const handleDownloadTemplate = () => {
  // Create sample CSV data based on your Transaction model
  const sampleData = [
    ["Amount", "Type", "Date (YYYY-MM-DD)", "Note", "Payment Method"],
    ["3500", "INCOME", "2026-01-15", "January salary", "CARD"],
    ["120.45", "EXPENSE", "2026-01-18", "Weekly groceries", "CASH"],
    ["1800", "EXPENSE", "2026-01-01", "January rent", "CHEQUE"],
    ["45.75", "EXPENSE", "2026-01-20", "Dinner with friends", "CARD"],
    ["800", "INCOME", "2026-01-25", "Web design project", "CASH"],
  ];

  // Create Excel file
  const ws = XLSX.utils.aoa_to_sheet(sampleData);

  // Set column widths
  ws["!cols"] = [
    { wpx: 66 }, // Amount
    { wpx: 65 }, // Type
    { wpx: 117 }, // Date
    { wpx: 250 }, // Note
    { wpx: 130 }, // Payment Method
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Download Excel file
  XLSX.writeFile(wb, "sample_transactions.xlsx");
};
