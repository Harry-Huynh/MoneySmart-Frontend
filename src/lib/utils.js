import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function dayLabel(dateString) {
  // Extract YYYY-MM-DD only to eliminate the timezone bug UTC
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);

  const d = new Date(year, month - 1, day); // Month in JS is 0 based -> month - 1
  const today = new Date();

  const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());

  const diffDays = Math.round(
    (start(today) - start(d)) / (1000 * 60 * 60 * 24), // take the difference then divide by number of miliseconds per day
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function groupByDay(transactions) {
  const map = new Map();
  for (const tx of transactions) {
    const key = dayLabel(tx.date);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(tx);
  }

  return Array.from(map.entries()); // return [label, txs]
}

export function parseDateToStartOfDay(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0)); // start of day UTC
}

export function parseDateToEndOfDay(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return new Date(Date.UTC(year, month - 1, day, 23, 59, 59)); // end of day UTC
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toCsvValue(value, delimiter) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  const escaped = str.replaceAll('"', '""');
  const needsQuotes =
    escaped.includes(delimiter) ||
    escaped.includes('"') ||
    escaped.includes("\n");

  return needsQuotes ? `"${escaped}"` : escaped;
}

export function transactionsToCsv(transactions, needHeader, delimiter) {
  const headers = [
    "date",
    "type",
    "amount",
    "category",
    "note",
    "paymentMethod",
  ];

  const rows = transactions.map((t) => [
    toCsvValue(t.date.split("T")[0], delimiter),
    toCsvValue(t.type, delimiter),
    toCsvValue(t.amount, delimiter),
    toCsvValue(t.category, delimiter),
    toCsvValue(t.note, delimiter),
    toCsvValue(t.paymentMethod, delimiter),
  ]);

  const csvLines = [];

  if (needHeader) {
    csvLines.push(headers.join(delimiter));
  }

  rows.forEach((r) => {
    csvLines.push(r.join(delimiter));
  });

  return csvLines.join("\n");
}
