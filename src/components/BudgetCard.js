import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FaRegStar } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import { RiErrorWarningLine } from "react-icons/ri";
import { formatMoneyCAD } from "@/lib/mock/budgets";
import { Progress } from "@/components/ui/progress";

export default function BudgetCard({ budgetItems = [] }) {
  return (
    <Link href="/budgets" className="block">
      <Card className="p-6 h-full border border-black/5 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-1">
          <FaRegStar className="text-[#4f915f] text-xl" />
          <h3 className="text-xl font-semibold text-slate-800">
            Budget Overview
          </h3>
        </div>
        <p className="text-sm text-slate-600">Your monthly budget limit</p>

        <ul className="space-y-3 text-slate-700">
          {budgetItems.length === 0 ? (
            <div className="mt-3 py-8 text-center bg-gray-50 rounded-xl border border-dashed">
              <p className="text-gray-500 text-sm">No budgets found.</p>
            </div>
          ) : (
            budgetItems.map((budgetItem) => {
              const isOverSpent = budgetItem.usedAmount > budgetItem.amount;
              const overspent = Math.max(budgetItem.usedAmount - budgetItem.amount, 0);
              const remaining = Math.max(budgetItem.amount - budgetItem.usedAmount, 0);
              const rawPercent =
                budgetItem.amount > 0 ? (budgetItem.usedAmount / budgetItem.amount) * 100 : 0;
              return (
                <li
                  key={budgetItem.id}
                  className={`flex flex-col border border-slate-200 p-3 rounded-md gap-3 ${isOverSpent ? "bg-red-50" : null}`}
                >
                  <div className="flex flex-wrap align-center items-center gap-3">
                    <div
                      className={`p-2 rounded-md ${isOverSpent ? "bg-red-100" : "bg-green-100"}`}
                    >
                      <GiWallet
                        className={`text-lg ${isOverSpent ? "text-red-700" : "text-green-700"}`}
                      />
                    </div>
                    <span className="font-bold flex-1">{budgetItem.name}</span>
                    {isOverSpent ? (
                      <div className="text-sm text-red-700 flex items-center gap-1">
                        <RiErrorWarningLine className="inline mr-1" />
                        Over Budget
                      </div>
                    ) : null}
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      rawPercent,
                    )}
                    className={`${
                      isOverSpent
                        ? "[&>div]:bg-red-600"
                        : "[&>div]:bg-[#4f915f]"
                    }`}
                  ></Progress>

                <div className="block flex justify-between items-center">
  <div className="flex items-center gap-2">
    <span className="text-xs font-bold">
      {formatMoneyCAD(budgetItem.usedAmount)}
    </span>
    {overspent > 0 && (
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
        Overspent {formatMoneyCAD(overspent)}
      </span>
    )}
    <span className="text-xs"> of {formatMoneyCAD(budgetItem.amount)}</span>
  </div>

  <div>
    {overspent > 0 ? (
      <span className="text-xs text-red-600 font-semibold">Over</span>
    ) : (
      <>
        <span className="text-xs text-green-700 font-semibold">
          {formatMoneyCAD(remaining)}
        </span>
        <span className="text-xs text-green-700"> left</span>
      </>
    )}
  </div>
</div>
                </li>
              );
            })
          )}
        </ul>
      </Card>
    </Link>
  );
}
