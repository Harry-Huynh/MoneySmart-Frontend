"use client";

export default function ConfirmDeleteModal({ title, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-2">Delete Saving Goal?</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete <strong>{title}</strong>?  
          This action can’t be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
