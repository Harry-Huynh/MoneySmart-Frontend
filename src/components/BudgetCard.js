import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FaRegStar } from "react-icons/fa";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

export default function BudgetCard({ budgetItems = [] }) {
  return (
    <Link href="/budgets" className="block">
      <Card className="p-6 h-full bg-[#4f915f]/12 border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <FaRegStar className="text-[#4f915f] text-2xl" />
          <h3 className="text-2xl font-semibold text-slate-800">Budgets</h3>
        </div>

        <ul className="space-y-3 text-slate-700">
          {budgetItems.map((budgetItem) => (
            <li
              key={budgetItem.name}
              className="flex items-center gap-3"
            >
              {budgetItem.checked ? (
                <MdCheckBox className="text-slate-600" />
              ) : (
                <MdCheckBoxOutlineBlank className="text-slate-600" />
              )}

              <span>
                {budgetItem.name}
                {budgetItem.amount != null ? `: $${budgetItem.amount}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </Link>
  );
}
