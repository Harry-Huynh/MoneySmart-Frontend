import { MdClose, MdDownload } from "react-icons/md";

const FormatGuidelinesModal = ({ shown, onClose, onDownload }) => {
  const formatGuidelines = [
    {
      title: "File Format",
      items: [
        "Supported formats: CSV (.csv), Excel (.xls, .xlsx)",
        "Maximum file size: 25MB",
        "First row must contain column headers",
        "Use UTF-8 encoding for CSV files",
      ],
    },
    {
      title: "Data Formatting",
      items: [
        "Dates must be in YYYY-MM-DD format (e.g., 2026-01-15)",
        "Amounts must be numbers (e.g., 120.45, 1800.00)",
        "Text fields should not contain commas if using CSV",
        "Empty cells for optional fields are allowed",
      ],
    },
    {
      title: "Validation Rules",
      items: [
        "Amount must be greater than 0",
        "Type must be exactly 'INCOME' or 'EXPENSE'",
        "Payment method must be exactly 'CASH', 'CHEQUE', or 'CARD'",
        "Date must be a valid calendar date",
      ],
    },
    {
      title: "Tips",
      items: [
        "Download the sample template to see correct formatting",
        "Save your file as CSV for best compatibility",
        "Check for trailing spaces in text fields",
        "Ensure decimal points are used (not commas)",
      ],
    },
  ];

  if (!shown) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Format Guidelines
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MdClose size={24} className="text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Follow these guidelines to ensure your file imports successfully
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formatGuidelines.map((section, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">
              Quick Reference
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Valid Values</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-600">
                    • Type: INCOME or EXPENSE
                  </li>
                  <li className="text-sm text-blue-600">
                    • Payment: CASH, CHEQUE, or CARD
                  </li>
                  <li className="text-sm text-blue-600">
                    • Date: YYYY-MM-DD format
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 mb-2">
                  Common Mistakes
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-600">
                    • Using commas in CSV text fields
                  </li>
                  <li className="text-sm text-blue-600">
                    • Incorrect date format
                  </li>
                  <li className="text-sm text-blue-600">
                    • Missing required columns
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <MdDownload className="text-amber-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-amber-800">Need an example?</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Download the sample template to see exactly how your data
                  should be formatted.
                </p>
                <button
                  onClick={onDownload}
                  className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Download Sample Template
                </button>
              </div>
            </div>
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

export default FormatGuidelinesModal;
