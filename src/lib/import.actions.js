import * as XLSX from "xlsx";

export const handleFileSelect = (
  event,
  setUploadedRows,
  setOpenPreviewTable,
  fileInputRef,
  selectedMonth,
  selectedYear,
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
      categoryId: "",
      amount: row[0] || 0,
      type: row[1] || "",
      date: row[2] || "",
      note: row[3] || "",
      paymentMethod: row[4] || "",
    }));

    const cleanUpRows = cleanUpUploadedRows(
      importedRows,
      selectedMonth,
      selectedYear,
    );
    setUploadedRows(cleanUpRows);
    setOpenPreviewTable(true);

    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

export const handleDrop = (
  e,
  setIsDragging,
  setUploadedRows,
  setOpenPreviewTable,
  selectedMonth,
  selectedYear,
) => {
  e.preventDefault();
  setIsDragging(false);

  const files = Array.from(e.dataTransfer.files);
  if (!files.length) return;

  const file = files[0];

  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const importedRows = rows.slice(1).map((row, index) => ({
      id: index,
      categoryId: "",
      amount: row[0] || 0,
      type: row[1] || "",
      date: row[2] || "",
      note: row[3] || "",
      paymentMethod: row[4] || "",
    }));

    const cleanedUpRows = cleanUpUploadedRows(
      importedRows,
      selectedMonth,
      selectedYear,
    );
    setUploadedRows(cleanedUpRows);
    setOpenPreviewTable(true);
  };

  reader.readAsArrayBuffer(file);
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

const normalizeExcelDateToYMD = (raw) => {
  if (raw == null || raw === "") return null;

  // Scenario 1: already a Date object
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  // Scenario 2:  Excel serial number (For example: 46068 )
  if (typeof raw === "number" && Number.isFinite(raw)) {
    const dc = XLSX.SSF.parse_date_code(raw);
    // If cannot convert to a complete date (with y,m,d) -> return null
    if (!dc || !dc.y || !dc.m || !dc.d) return null;

    const mm = String(dc.m).padStart(2, "0");
    const dd = String(dc.d).padStart(2, "0");
    return `${dc.y}-${mm}-${dd}`;
  }

  // Scenario 3: String
  const s = String(raw).trim();

  // If it's already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // If dates does not have pad like "2" instead of "02"
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) {
    const mm = String(mdy[1]).padStart(2, "0");
    const dd = String(mdy[2]).padStart(2, "0");
    return `${mdy[3]}-${mm}-${dd}`;
  }
  return null;
};

const validateAndFormatDate = (dateStr, selectedMonth, selectedYear) => {
  const month = Number(selectedMonth);
  const year = Number(selectedYear);

  const ymd = normalizeExcelDateToYMD(dateStr);
  if (!ymd) return null;

  const [y, m, d] = ymd.split("-").map(Number);
  if (y !== year || m != month) return null;

  // Have to verify the date to catch edge cases such as 29th February
  const test = new Date(Date.UTC(y, m - 1, d));
  if (
    test.getUTCFullYear() !== y ||
    test.getUTCMonth() + 1 !== m ||
    test.getUTCDate() !== d
  ) {
    return null;
  }
  return ymd;
};

const cleanUpUploadedRows = (importedRows, selectedMonth, selectedYear) => {
  const validTransactionTypes = ["INCOME", "EXPENSE"];
  const validPaymentTypes = ["CASH", "CARD", "CHEQUE"];

  return importedRows
    .map((row) => {
      const type = String(row.type).toUpperCase().trim();
      const payment = String(row.paymentMethod).toUpperCase().trim();
      const amount = Number(row.amount);

      if (!validTransactionTypes.includes(type)) return null;
      if (!validPaymentTypes.includes(payment)) return null;
      if (Number.isNaN(amount)) return null;

      const formattedDate = validateAndFormatDate(
        row.date,
        selectedMonth,
        selectedYear,
      );
      if (!formattedDate) return null;

      return {
        id: row.id,
        categoryId: row.categoryId ?? "",
        amount: Number(amount.toFixed(2)),
        type,
        date: formattedDate,
        note: String(row.note || "").trim(),
        paymentMethod: payment,
      };
    })
    .filter(Boolean);
};
