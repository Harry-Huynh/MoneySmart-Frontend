import React from "react";
import DashboardClient from "@/components/DashboardClient";

export default function Dashboard() {
  // Dummy data for display purposes
  const userName = "User";

  const dashboardMockData = {
    balance: {
      label: "Current Balance",
      amount: 0,
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

  return <DashboardClient dashboardMockData={dashboardMockData} userName={userName} />;
}


