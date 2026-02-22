import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FaRegClock } from "react-icons/fa";
import { LuTarget } from "react-icons/lu";
import { Progress } from "@/components/ui/progress";
import { formatCurrencyCAD } from "@/lib/utils";
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
            savingGoalItems.map((savingGoalItem) => {
              const rawPercent =
                savingGoalItem.targetAmount > 0
                  ? (savingGoalItem.currentAmount /
                      savingGoalItem.targetAmount) *
                    100
                  : 0;

              const isCompleted = rawPercent >= 100;
              const exceeded = Math.max(
                savingGoalItem.currentAmount - savingGoalItem.targetAmount,
                0,
              );
              const remaining = Math.max(
                savingGoalItem.targetAmount - savingGoalItem.currentAmount,
                0,
              );
              return (
                <li
                  key={savingGoalItem.id}
                  className={`flex flex-col border border-slate-200 p-3 rounded-md gap-3 ${
                    isCompleted ? "bg-emerald-50" : ""
                  }`}
                >
                  <div className="flex flex-wrap align-center items-center gap-3">
                    <div
                      className={`p-2 rounded-md ${isCompleted ? "bg-emerald-100" : "bg-purple-100"}`}
                    >
                      <LuTarget
                        className={`text-lg ${isCompleted ? "text-emerald-700" : "text-purple-700"}`}
                      />
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
                    {isCompleted ? (
                      <div className="text-sm text-emerald-700 flex items-center gap-1 font-semibold">
                        Completed
                      </div>
                    ) : null}
                  </div>
                  <Progress
                    value={Math.min(100, rawPercent)}
                    className={`${isCompleted ? "[&>div]:bg-emerald-600" : "[&>div]:bg-purple-600"}`}
                  ></Progress>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">
                        {formatCurrencyCAD(savingGoalItem.currentAmount)}
                      </span>

                      {exceeded > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                          Exceeded {formatCurrencyCAD(exceeded)}
                        </span>
                      )}

                      <span className="text-xs">
                        {" "}
                        of {formatCurrencyCAD(savingGoalItem.targetAmount)}
                      </span>
                    </div>

                    <div>
                      {exceeded > 0 ? (
                        <span className="text-xs text-emerald-700 font-semibold">
                          Done
                        </span>
                      ) : (
                        <>
                          <span className="text-xs text-purple-700 font-semibold">
                            {formatCurrencyCAD(remaining)}
                          </span>
                          <span className="text-xs text-purple-700"> left</span>
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
