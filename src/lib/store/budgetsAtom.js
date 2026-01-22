import { atom } from "jotai";
import { mockBudgets } from "@/lib/mock/budgets";

// Single source of truth for budgets
export const budgetsAtom = atom(mockBudgets);
