import Link from "next/link";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaShoppingBag, FaShieldAlt, FaHome, FaGasPump } from "react-icons/fa";

const TRANSACTION_ICON_RULES = [
  { keyword: "groc", iconComponent: FaShoppingBag },
  { keyword: "insur", iconComponent: FaShieldAlt },
  { keyword: "rent", iconComponent: FaHome },
  { keyword: "gas", iconComponent: FaGasPump },
];

function getTransactionIconComponent(transactionName) {
  const normalizedName = (transactionName || "").toLowerCase();
  return (
    TRANSACTION_ICON_RULES.find((rule) => normalizedName.includes(rule.keyword))
      ?.iconComponent ?? FaShoppingBag
  );
}

function formatTransactionAmount(amountValue) {
  const amountNumber = Number(amountValue ?? 0);
  if (amountNumber < 0) return `-$${Math.abs(amountNumber).toFixed(2)}`;
  return `$${amountNumber.toFixed(2)}`;
}

export default function TransactionItem({ transactionItem }) {
  const IconComponent = getTransactionIconComponent(transactionItem?.name);
  const amountText = formatTransactionAmount(transactionItem?.amount);

  return (
    <Card className="p-5 rounded-2xl border shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        {React.createElement(IconComponent, { className: "text-slate-700 text-xl" })}
        <p className="font-semibold text-slate-800">{transactionItem?.name}</p>
      </div>

      <p className="text-slate-500 text-sm">{transactionItem?.date}</p>
      <p className="text-slate-700 mt-3">{amountText}</p>

      <div className="mt-4">
        <Link href={`/transactions/${encodeURIComponent(transactionItem?.name || "unknown")}`}>
          <Button variant="secondary" className="w-full rounded-xl">
            View details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
