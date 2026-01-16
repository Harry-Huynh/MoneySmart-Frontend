import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FaRegClock } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

export default function SavingGoalsCard({ savingGoalItems = [] }) {
  return (
    <Link href="/saving-goals" className="block">
      <Card className="p-6 h-full bg-[#4f915f]/12 border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <FaRegClock className="text-[#4f915f] text-2xl" />
          <h3 className="text-2xl font-semibold text-slate-800">
            Saving Goals
          </h3>
        </div>

        <ul className="space-y-3 text-slate-700">
          {savingGoalItems.map((savingGoalItem) => (
            <li key={savingGoalItem.name} className="flex items-center gap-3">
              {savingGoalItem.checked ? (
                <MdCheckBox className="text-slate-600" />
              ) : (
                <MdCheckBoxOutlineBlank className="text-slate-600" />
              )}

              <span>
                {savingGoalItem.name}
                {savingGoalItem.progressLabel
                  ? ` ${savingGoalItem.progressLabel}`
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </Link>
  );
}
