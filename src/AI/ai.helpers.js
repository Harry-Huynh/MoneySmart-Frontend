export const monthNames = [
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

export function buildPeriodKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function extractBudgetPeriodKeys(budget) {
  if (budget?.startDate) {
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate || budget.startDate);

    if (
      !Number.isNaN(startDate.getTime()) &&
      !Number.isNaN(endDate.getTime())
    ) {
      const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
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

  if (typeof budget?.month === "number" && typeof budget?.year === "number") {
    return [buildPeriodKey(budget.year, budget.month + 1)];
  }

  return [];
}

export function extractSavingGoalPeriodKey(goal) {
  if (!goal?.targetDate) return null;

  const targetDate = new Date(goal.targetDate);

  if (Number.isNaN(targetDate.getTime())) return null;

  return buildPeriodKey(targetDate.getFullYear(), targetDate.getMonth() + 1);
}
