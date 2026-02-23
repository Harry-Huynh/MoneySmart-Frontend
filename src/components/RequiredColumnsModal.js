import { MdClose } from "react-icons/md";

const RequiredColumnsModal = ({ shown, onClose }) => {
  const requiredColumns = [
    // {
    //   name: "category",
    //   type: "string",
    //   required: true,
    //   description: "Transaction category (e.g., Groceries, Salary, Rent)",
    //   example: "Groceries",
    // },
    {
      name: "amount",
      type: "number",
      required: true,
      description: "Transaction amount (positive number with 2 decimal places)",
      example: "120.45",
    },
    {
      name: "type",
      type: "string",
      required: true,
      description: "Must be either 'INCOME' or 'EXPENSE' (case sensitive)",
      example: "EXPENSE",
    },
    {
      name: "date",
      type: "date",
      required: true,
      description: "Transaction date in YYYY-MM-DD format",
      example: "2026-01-18",
    },
    {
      name: "note",
      type: "string",
      required: false,
      description: "Optional description or memo for the transaction",
      example: "Weekly groceries",
    },
    {
      name: "paymentMethod",
      type: "string",
      required: true,
      description: "Must be 'CASH', 'CHEQUE', or 'CARD' (case sensitive)",
      example: "CASH",
    },
  ];

  if (!shown) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Required Columns
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <MdClose size={24} className="text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Your file must include these columns in the exact order shown below:
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 font-semibold text-gray-700 border-b">
                    Column Name
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700 border-b">
                    Type
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700 border-b">
                    Required
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700 border-b">
                    Description
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700 border-b">
                    Example
                  </th>
                </tr>
              </thead>
              <tbody>
                {requiredColumns.map((column, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <span className="font-medium text-gray-800">
                        {column.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          column.type === "string"
                            ? "bg-blue-100 text-blue-800"
                            : column.type === "number"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {column.type}
                      </span>
                    </td>
                    <td className="p-4">
                      {column.required ? (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Compulsory
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{column.description}</td>
                    <td className="p-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {column.example}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-4">
              Sample Data Preview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden text-left">
                <thead>
                  <tr className="bg-emerald-100">
                    {/* <th className="p-3 font-medium text-emerald-800 border-b">
                      category
                    </th> */}
                    <th className="p-3 font-medium text-emerald-800 border-b">
                      amount
                    </th>
                    <th className="p-3 font-medium text-emerald-800 border-b">
                      type
                    </th>
                    <th className="p-3 font-medium text-emerald-800 border-b">
                      date
                    </th>
                    <th className="p-3 font-medium text-emerald-800 border-b">
                      note
                    </th>
                    <th className="p-3 font-medium text-emerald-800 border-b">
                      paymentMethod
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* <td className="p-3 border-b">Salary</td> */}
                    <td className="p-3 border-b">3500</td>
                    <td className="p-3 border-b">INCOME</td>
                    <td className="p-3 border-b">2026-01-15</td>
                    <td className="p-3 border-b">January salary</td>
                    <td className="p-3 border-b">CARD</td>
                  </tr>
                  <tr>
                    {/* <td className="p-3 border-b">Groceries</td> */}
                    <td className="p-3 border-b">120.45</td>
                    <td className="p-3 border-b">EXPENSE</td>
                    <td className="p-3 border-b">2026-01-18</td>
                    <td className="p-3 border-b">Weekly groceries</td>
                    <td className="p-3 border-b">CASH</td>
                  </tr>
                  <tr>
                    {/* <td className="p-3 border-b">Rent</td> */}
                    <td className="p-3 border-b">1800</td>
                    <td className="p-3 border-b">EXPENSE</td>
                    <td className="p-3 border-b">2026-01-01</td>
                    <td className="p-3 border-b">January rent</td>
                    <td className="p-3 border-b">CHEQUE</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-emerald-700 mt-4">
              Note: Your file should follow this exact format with the same
              column headers.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequiredColumnsModal;
