export const mockBudgets = [
  {
    id: "b1",
    purpose: "Food",
    amount: 200,
    spent: 120,
    thresholdAlert: 80,
    startDate: "2025-01-01",
    note: "",
  },
  {
    id: "b2",
    purpose: "Rent",
    amount: 1200,
    spent: 1200,
    thresholdAlert: 80,
    startDate: "2025-01-01",
    note: "",
  },
  {
    id: "b3",
    purpose: "Transport",
    amount: 150,
    spent: 60,
    thresholdAlert: 80,
    startDate: "2025-01-01",
    note: "",
  },
  {
    id: "b4",
    purpose: "Phone",
    amount: 150,
    spent: 60,
    thresholdAlert: 80,
    startDate: "2025-01-01",
    note: "",
  },
];

export function formatMoneyCAD(n) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(Number(n || 0));
}

export function percent(spent, amount) {
  const a = Number(amount || 0);
  const s = Number(spent || 0);
  if (a <= 0) return 0;
  return Math.min(100, Math.round((s / a) * 10000) / 100);
}
