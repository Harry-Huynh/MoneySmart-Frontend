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

  const dashboardMockData = {
    balance: {
      label: "Current Balance",
      amount: userData?.currentBalance ?? 0.0,
      delta: 0,
      since: "01/01/2000",
    },
    budgets: [
      { name: "Name 1", amount: 0, checked: false },
      { name: "Name 2", amount: 0, checked: false },
      { name: "Name 3", amount: 0, checked: false },
    ],
    goals: [
      { name: "Name 1", progressLabel: "0%", checked: false },
      { name: "Name 2", progressLabel: "0%", checked: false },
    ],
    recentTransactions: [
      { name: "Name 1", date: "01/01/2000", amount: 0 },
      { name: "Name 2", date: "01/01/2000", amount: 0 },
      { name: "Name 3", date: "01/01/2000", amount: 0 },
      { name: "Name 4", date: "01/01/2000", amount: 0 },
    ],
  };

  return <DashboardClient dashboardMockData={dashboardMockData} name={name} />;
}
