import BudgetsClient from "./BudgetsClient";
import { getAllBudgets } from "@/lib/budget.actions";

export default async function BudgetsPage() {
  const { count, budgets } = await getAllBudgets();
  return <BudgetsClient initialBudgets={budgets} initialCount={count} />;
}
