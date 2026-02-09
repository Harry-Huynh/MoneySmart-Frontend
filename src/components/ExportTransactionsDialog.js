import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MdSaveAlt } from "react-icons/md";
import { FaFileCsv } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import {
  downloadBlob,
  transactionsToCsv,
  transactionsToXlsxBlob,
} from "@/lib/utils";

export default function ExportTransactionsDialog({
  transactions,
  month,
  year,
}) {
  const [format, setFormat] = useState("csv");

  const handleDownload = () => {
    const fileName = `MoneySmart-transactions-${year}-${month}`;

    if (!transactions || transactions.length === 0) {
      alert("No transactions to export for this month.");
      return;
    }

    if (format === "csv") {
      const csv = transactionsToCsv(transactions);
      const blob = new Blob([csv], { type: "text/csv" });
      downloadBlob(blob, `${fileName}.csv`);
    } else {
      const blob = transactionsToXlsxBlob(transactions);
      downloadBlob(blob, `${fileName}.xlsx`);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-200 font-medium transition cursor-pointer flex items-center justify-center gap-2 select-none">
          <MdSaveAlt size={18} /> Export this month
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-0">
        <AlertDialogHeader className="select-none">
          <AlertDialogTitle className="text-center text-2xl">
            Export Transactions
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-500">
            Choose your preferred format to export your transaction history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="text-black text-lg my-5 select-none">Export Format</div>
        <RadioGroup
          value={format}
          onValueChange={(v) => setFormat(v === "csv" ? "csv" : "excel")}
          className="w-full select-none"
        >
          <label
            htmlFor="csv"
            className={`w-full border rounded-md flex items-center gap-3 p-5 cursor-pointer
    ${format === "csv" ? "border-blue-500 bg-blue-50" : ""}
  `}
          >
            <RadioGroupItem value="csv" id="csv" className="sr-only" />
            <FaFileCsv size={38} className="text-blue-800" />

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label className="text-black text-lg">CSV (.csv)</Label>
                {format === "csv" && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-blue-600 text-white">
                    Selected
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600">
                Universally compatible across apps and systems.
              </p>
            </div>
          </label>

          <label
            htmlFor="excel"
            className={`w-full border rounded-md flex items-center gap-3 p-5 cursor-pointer
    ${format === "excel" ? "border-green-600 bg-green-50" : ""}
  `}
          >
            <RadioGroupItem value="excel" id="excel" className="sr-only" />
            <PiMicrosoftExcelLogoFill size={38} className="text-green-800" />

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label className="text-black text-lg">Excel (.xlsx)</Label>
                {format === "excel" && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-green-700 text-white">
                    Selected
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600">
                Best for Excel users. Keeps formatting.
              </p>
            </div>
          </label>
        </RadioGroup>

        <div className="mt-8 mb-5 border border-red-300 rounded-md p-5 bg-red-50 select-none">
          <p className="text-red-700 font-bold text-lg">Note:</p>
          <p className="text-red-600 text-xs">
            All transactions within the chosen month will be included in the
            export.
          </p>
        </div>
        <AlertDialogFooter className="select-none">
          <AlertDialogCancel className="cursor-pointer">
            Close
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDownload}
            className="cursor-pointer bg-green-700 hover:bg-green-600"
          >
            <LuDownload />
            Download {format === "csv" ? "CSV" : "Excel"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
