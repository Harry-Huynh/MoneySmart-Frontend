import BudgetsClient from "../../../components/BudgetsClient";
import { getAllBudgets } from "@/lib/budget.actions";

export default async function BudgetsPage() {
  const { budgets } = await getAllBudgets();
  return <BudgetsClient initialBudgets={budgets} />;
}
