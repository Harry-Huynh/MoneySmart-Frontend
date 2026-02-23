import { useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

const PreviewTransactions = ({
  uploadedRows,
  categories,
  isOpen,
  setIsPreviewOpen,
  onChangeCategory,
  onSaveAll,
}) => {
  const [missingCategoryIds, setMissingCategoryIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    const missing = uploadedRows
      .filter((r) => !r.categoryId || String(r.categoryId).trim() === "")
      .map((r) => r.id);

    // If there is any transaction that user did not choose category => Stop Saving immediately
    // Only can save when all transactions have categories selected
    if (missing.length > 0) {
      setMissingCategoryIds(missing);
      return;
    }

    // If all transactions have categories selected -> Start saving
    setMissingCategoryIds([]);
    setIsSaving(true);
    try {
      await onSaveAll(uploadedRows);
      setIsPreviewOpen(false);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-7xl!"
        showCloseButton={false}
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Preview Transactions
          </h2>
          <p className="text-sm text-gray-500">
            Review and adjust transactions before saving
          </p>
        </div>
        <div className="border border-blue-300 rounded-md p-3 bg-blue-50 select-none">
          <p className="text-blue-700 font-bold text-lg">Disclaimer:</p>
          <p className="text-blue-600 text-xs">
            The list below includes only transactions that meet the required
            format and match the selected timeframe. All other entries have been
            excluded.
          </p>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-y-auto border rounded-xl max-h-[60vh]">
          <table className="min-w-300 w-full text-sm border-collapse">
            {/* Sticky Header */}
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="border px-4 py-3 text-left w-1/6">Category</th>
                <th className="border px-4 py-3 text-left">Amount</th>
                <th className="border px-4 py-3 text-left">Type</th>
                <th className="border px-4 py-3 text-left">Date</th>
                <th className="border px-4 py-3 text-left">Note</th>
                <th className="border px-4 py-3 text-left w-1/4">
                  Payment Method
                </th>
              </tr>
            </thead>

            <tbody>
              {uploadedRows.map((row) => {
                const isMissing = missingCategoryIds.includes(row.id);

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 ${isMissing ? "bg-red-50" : ""}`}
                  >
                    {/* Category */}
                    <td
                      className={`border px-3 py-2 ${isMissing ? "border-red-300" : ""}`}
                    >
                      <select
                        value={row.categoryId ?? ""}
                        onChange={(e) =>
                          onChangeCategory(row.id, e.target.value)
                        }
                        className={`border px-2 py-1 rounded-lg w-full ${
                          isMissing ? "border-red-400 focus:ring-red-300" : ""
                        }`}
                      >
                        <option value="">Select category</option>
                        {row.type === "EXPENSE" &&
                          (categories ?? []).map((cat) => (
                            <option
                              key={`${cat.model}:${cat.id}`}
                              value={`${cat.model}:${cat.id}`}
                            >
                              {cat.name} ({cat.model})
                            </option>
                          ))}
                        {row.type === "INCOME" && (
                          <>
                            <option value="Salary">Salary</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Investments">Investments</option>
                            <option value="Rental">Rental</option>
                            <option value="Business">Business</option>
                            <option value="Gifts">Gifts</option>
                            <option value="Refunds">Refunds</option>
                            <option value="Other">Other</option>
                          </>
                        )}
                      </select>
                      {isMissing && (
                        <p className="text-xs text-red-600 mt-1">
                          Please select a category
                        </p>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="border px-3 py-2 whitespace-nowrap">
                      {row.amount}
                    </td>

                    {/* Type */}
                    <td className="border px-3 py-2 whitespace-nowrap">
                      {row.type}
                    </td>

                    {/* Date */}
                    <td className="border px-3 py-2 whitespace-nowrap">
                      {row.date}
                    </td>

                    {/* Note */}
                    <td className="border px-3 py-2 wrap-break-word">
                      {row.note}
                    </td>

                    {/* Payment Method */}
                    <td className="border px-3 py-2 whitespace-nowrap">
                      {row.paymentMethod}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-4">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="px-6 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="px-6 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Transactions"}
          </button>
        </DialogFooter>
        {isSaving && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-700 font-medium">
                Saving transactions...
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreviewTransactions;
