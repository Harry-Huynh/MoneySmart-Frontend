import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
