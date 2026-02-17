import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FaMoneyBills } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
import { formatMoneyCAD } from "@/lib/mock/budgets";
import { LuArrowDownRight } from "react-icons/lu";
import { LuArrowUpRight } from "react-icons/lu";
import { returnDayInPreferredFormat } from "@/lib/utils";

export default function DashboardTransactionCard({
  transactionItems = [],
  preferredDateFormat,
}) {
  return (
    <Link href="/transactions" className="block">
      <Card className="p-6 h-full border border-black/5 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-1">
          <GrMoney className="text-[#4f915f] text-xl" />
          <h3 className="text-xl font-semibold text-slate-800">
            Recent Transactions
          </h3>
        </div>
        <p className="text-sm text-slate-600">Your recent transactions</p>
        <ul className="space-y-3 text-slate-700">
          {transactionItems.length === 0 ? (
            <div className="mt-3 py-8 text-center bg-gray-50 rounded-xl border border-dashed">
              <p className="text-gray-500 text-sm">No transactions found.</p>
            </div>
          ) : (
            transactionItems.map((transactionItem) => (
              <li
                key={transactionItem.id}
                className="flex border border-slate-200 p-3 rounded-md gap-3"
              >
                <div className="w-full flex align-center items-center gap-3">
                  <div className="p-2 rounded-md bg-yellow-100 ">
                    <FaMoneyBills className="text-yellow-500 text-lg" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold">
                      {transactionItem.category}
                    </span>
                    <p className="text-xs text-slate-500">
                      {returnDayInPreferredFormat(
                        transactionItem.date,
                        preferredDateFormat,
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold flex-1">
                      {transactionItem.type === "EXPENSE" ? "-" : null}
                      {formatMoneyCAD(transactionItem.amount)}
                    </span>
                    {transactionItem.type === "EXPENSE" ? (
                      <LuArrowDownRight className="text-lg text-red-500" />
                    ) : (
                      <LuArrowUpRight className="text-lg text-green-500" />
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </Card>
    </Link>
  );
}
