import BudgetsClient from "../../../components/BudgetsClient";
import { getAllBudgets } from "@/lib/budget.actions";

export default async function BudgetsPage() {
  let data;

  try {
    data = await getAllBudgets();
  } catch (e) {
    return <p className="text-red-500">Failed to load budgets</p>;
  }
  const { count, budgets } = data;
  return <BudgetsClient initialBudgets={budgets} initialCount={count} />;
}
