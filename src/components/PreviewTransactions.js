import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const PreviewTransactions = ({
  uploadedRows,
  categories,
  isOpen,
  setIsPreviewOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent className="max-w-7xl!" showCloseButton={false}>
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Preview Transactions
          </h2>
          <p className="text-sm text-gray-500">
            Review and adjust transactions before saving
          </p>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto border rounded-xl">
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
              {uploadedRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {/* Category */}
                  <td className="border px-3 py-2">
                    <select
                      value={row.categoryId}
                      onChange={(e) =>
                        handleCategoryChange(row.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded-lg w-full"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-4">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="px-6 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button className="px-6 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
            Save Transactions
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewTransactions;
