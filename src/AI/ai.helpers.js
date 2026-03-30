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

function toValidInteger(value) {
  const parsed = Number(value);

  return Number.isInteger(parsed) ? parsed : null;
}

function parseUtcDateParts(dateValue) {
  if (typeof dateValue !== "string") return null;

  const match = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return { year, month, day };
}

function compareUtcMonth(a, b) {
  if (a.year !== b.year) return a.year - b.year;

  return a.month - b.month;
}

function getPeriodKeysFromUtcDateRange(startParts, endParts) {
  if (!startParts || !endParts || compareUtcMonth(startParts, endParts) > 0) {
    return [];
  }

  const periodKeys = [];
  let cursorYear = startParts.year;
  let cursorMonth = startParts.month;

  while (
    cursorYear < endParts.year ||
    (cursorYear === endParts.year && cursorMonth <= endParts.month)
  ) {
    periodKeys.push(buildPeriodKey(cursorYear, cursorMonth));
    cursorMonth += 1;

    if (cursorMonth > 12) {
      cursorMonth = 1;
      cursorYear += 1;
    }
  }

  return periodKeys;
}

// Legacy local Date-based version kept here for reference only.
// export function extractBudgetPeriodKeys(budget) {
//   if (budget?.startDate) {
//     const startDate = new Date(budget.startDate);
//     const endDate = new Date(budget.endDate || budget.startDate);
//
//     if (
//       !Number.isNaN(startDate.getTime()) &&
//       !Number.isNaN(endDate.getTime())
//     ) {
//       const cursor = new Date(
//         startDate.getFullYear(),
//         startDate.getMonth(),
//         1,
//       );
//       const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
//       const periodKeys = [];
//
//       while (cursor <= lastMonth) {
//         periodKeys.push(
//           buildPeriodKey(cursor.getFullYear(), cursor.getMonth() + 1),
//         );
//         cursor.setMonth(cursor.getMonth() + 1);
//       }
//
//       return periodKeys;
//     }
//   }
//
//   if (typeof budget?.month === "number" && typeof budget?.year === "number") {
//     return [buildPeriodKey(budget.year, budget.month + 1)];
//   }
//
//   return [];
// }
export function extractBudgetPeriodKeys(budget) {
  if (budget?.startDate) {
    const startDateParts = parseUtcDateParts(budget.startDate);
    const endDateParts = parseUtcDateParts(budget.endDate || budget.startDate);

    return getPeriodKeysFromUtcDateRange(startDateParts, endDateParts);
  }

  if (typeof budget?.month === "number" && typeof budget?.year === "number") {
    return [buildPeriodKey(budget.year, budget.month + 1)];
  }

  return [];
}

// Legacy local Date-based version kept here for reference only.
// export function extractSavingGoalPeriodKey(goal) {
//   if (!goal?.targetDate) return null;
//
//   const targetDate = new Date(goal.targetDate);
//
//   if (Number.isNaN(targetDate.getTime())) return null;
//
//   return buildPeriodKey(targetDate.getFullYear(), targetDate.getMonth() + 1);
// }
export function extractSavingGoalPeriodKey(goal) {
  if (!goal?.targetDate) return null;

  const targetDateParts = parseUtcDateParts(goal.targetDate);

  if (!targetDateParts) return null;

  return buildPeriodKey(targetDateParts.year, targetDateParts.month);
}

export function extractTransactionPeriodKey(transaction) {
  if (transaction?.date) {
    const dateParts = parseUtcDateParts(transaction.date);

    if (dateParts) {
      return buildPeriodKey(dateParts.year, dateParts.month);
    }
  }

  const transactionYear = toValidInteger(transaction?.year);
  const rawMonth = toValidInteger(transaction?.month);

  if (transactionYear === null || rawMonth === null) return null;

  const normalizedMonth =
    rawMonth >= 1 && rawMonth <= 12
      ? rawMonth
      : rawMonth >= 0 && rawMonth <= 11
        ? rawMonth + 1
        : null;

  if (normalizedMonth === null) return null;

  return buildPeriodKey(transactionYear, normalizedMonth);
}
