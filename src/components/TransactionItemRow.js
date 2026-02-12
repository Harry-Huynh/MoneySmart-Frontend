import { formatMoneyCAD } from "@/lib/mock/budgets";
import React from "react";
import { PiHandWithdrawBold, PiHandDepositBold } from "react-icons/pi";
import { FaRegTrashCan } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TransactionItemRow({ transaction, onDelete }) {
  const isIncome = transaction.type === "INCOME";

    const router = useRouter();

  const handleDoubleClick = () => {
    router.push(`/transactions/${transaction.id}/edit`);
  };


  function handleDelete() {
    onDelete(transaction.id);
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`w-full py-2 px-2 my-2 flex items-center justify-between border border-gray-100 rounded-md gap-4 select-none hover:border-gray-300 group`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${isIncome ? "bg-green-100" : "bg-red-100"}`}
      >
        {isIncome ? (
          <PiHandDepositBold className="text-green-700 text-xl" />
        ) : (
          <PiHandWithdrawBold className="text-red-700" />
        )}
      </div>
      <div className="flex-1">
        <div className="text-gray-700 font-semibold">
          {transaction.category}
        </div>
        <div className="text-gray-400 text-xs font-semibold">
          {transaction.note}
        </div>
      </div>
      <span
        className={`text-gray-700 font-semibold ${isIncome ? "text-green-700" : "text-red-700"}`}
      >
        {(isIncome ? "+" : "-") + formatMoneyCAD(transaction.amount)}
      </span>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div
            className="w-8 h-8 flex justify-center items-center rounded-sm invisible group-hover:visible
          hover:bg-red-100 cursor-pointer"
          >
            <FaRegTrashCan className="text-gray-400 hover:text-red-600" />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-red-500">
              Delete Transaction?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              transaction from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
