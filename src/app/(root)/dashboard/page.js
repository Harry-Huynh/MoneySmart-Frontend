import React from "react";
import DashboardClient from "@/components/DashboardClient";
import { getBudgetByMonthAndYear } from "@/lib/budget.actions";
import { getMyProfile } from "@/lib/user.actions";
import { getAllTransactionsByMonthAndYear } from "@/lib/transaction.actions";
import { get } from "react-hook-form";
import { getAllSavingGoals } from "@/lib/savingGoal.actions";

async function getUserData() {
  try {
    return await getMyProfile();
  } catch (error) {
    return null;
  }
}

async function getThisMonthBudgetData() {
  try {
    return await getBudgetByMonthAndYear(
      new Date().getMonth(),
      new Date().getFullYear(),
    );
  } catch (error) {
    return [];
  }
}

async function getSavingGoals() {
  try {
    return await getAllSavingGoals();
  } catch (error) {
    return [];
  }
}

async function getAllTransactions() {
  try {
    return await getAllTransactionsByMonthAndYear(
      new Date().getMonth(),
      new Date().getFullYear(),
    );
  } catch (error) {
    return [];
  }
}
export default async function Dashboard() {
  // Dummy data for display purposes
  const [userData, budgetData, savingGoalsData, transactionsData] =
    await Promise.all([
      getUserData(),
      getThisMonthBudgetData(),
      getSavingGoals(),
      getAllTransactions(),
    ]);

  const name = userData?.name ?? "Unknown User";
  const dateFormat = userData?.dateFormat ?? "YYYY-MM-DD";

  const dashboardMockData = {
    balance: {
      label: "Current Balance",
      amount: userData?.currentBalance ?? 0.0,
      delta: 0,
      since: "01/01/2000",
    },
    budgets: budgetData.budgets,
    goals: savingGoalsData.savingGoals,
    recentTransactions: transactionsData.transactions,
  };
  return (
    <DashboardClient
      dashboardMockData={dashboardMockData}
      name={name}
      preferredDateFormat={dateFormat}
    />
  );
}
