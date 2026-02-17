import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FaRegClock } from "react-icons/fa";
import { LuTarget } from "react-icons/lu";
import { Progress } from "@/components/ui/progress";
import { formatMoneyCAD } from "@/lib/mock/budgets";
import { returnDayInPreferredFormat } from "@/lib/utils";

export default function SavingGoalsCard({
  savingGoalItems = [],
  preferredDateFormat,
}) {
  return (
    <Link href="/saving-goals" className="block">
      <Card className="p-6 h-full border border-black/5 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-1">
          <FaRegClock className="text-[#4f915f] text-xl" />
          <h3 className="text-xl font-semibold text-slate-800">Saving Goals</h3>
        </div>
        <p className="text-sm text-slate-600">Track your saving progress</p>

        <ul className="space-y-3 text-slate-700">
          {savingGoalItems.length === 0 ? (
            <div className="mt-3 py-8 text-center bg-gray-50 rounded-xl border border-dashed">
              <p className="text-gray-500 text-sm">No saving goals found.</p>
            </div>
          ) : (
            savingGoalItems.map((savingGoalItem) => (
              <li
                key={savingGoalItem.id}
                className={
                  "flex flex-col border border-slate-200 p-3 rounded-md gap-3"
                }
              >
                <div className="flex flex-wrap align-center items-center gap-3">
                  <div className={"p-2 rounded-md bg-purple-100 "}>
                    <LuTarget className={"text-lg text-purple-700"} />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold">{savingGoalItem.name}</span>
                    <p className="text-xs text-slate-500">
                      Target Date:{" "}
                      {returnDayInPreferredFormat(
                        savingGoalItem.targetDate,
                        preferredDateFormat,
                      )}
                    </p>
                  </div>
                  <div className="text-sm font-bold flex items-center gap-1">
                    {Math.min(
                      100,
                      (savingGoalItem.currentAmount /
                        savingGoalItem.targetAmount) *
                        100,
                    ).toFixed(0)}
                    %
                  </div>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    (savingGoalItem.currentAmount /
                      savingGoalItem.targetAmount) *
                      100,
                  )}
                  className={"[&>div]:bg-purple-600"}
                ></Progress>

                <div className="block flex justify-between items-center">
                  <span className="text-xs">
                    {formatMoneyCAD(savingGoalItem.currentAmount)} saved
                  </span>

                  <div>
                    <span className={"text-xs"}>
                      {formatMoneyCAD(savingGoalItem.targetAmount)} goal
                    </span>
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
