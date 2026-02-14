"use client";

import { Card } from "@/components/ui/card";
import { FaPlus } from "react-icons/fa";
import CountUp from "react-countup";

function formatCurrencyCAD(amountNumber) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(Number(amountNumber || 0));
}

export default function BalanceCard({ balanceSummary, onAddFundsClick }) {
  if (!balanceSummary) return null;

  const currentBalanceAmountText = formatCurrencyCAD(balanceSummary.amount);
  const deltaAmountText = formatCurrencyCAD(balanceSummary.delta);

  return (
    <Card className="p-0 overflow-hidden border border-black/5 shadow-sm">
      {/* Dark green */}
      <div className="p-6 bg-[#4f915f]/20">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-slate-600 font-medium">{balanceSummary.label}</p>

            <div className="text-4xl font-semibold text-slate-800 mt-2">
              <div className="w-full">
                <CountUp
                  decimals={2}
                  decimal="."
                  prefix="$"
                  end={Number(balanceSummary.amount)}
                />
              </div>
            </div>
            {/* $$ */}
            <p className="mt-3 text-slate-600">
              {deltaAmountText} since {balanceSummary.since}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
