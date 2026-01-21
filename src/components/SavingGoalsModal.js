"use client";

import { useState } from "react";

export default function SavingGoalModal({ goal, onClose, onSave }) {
  const [title, setTitle] = useState(goal?.title || "");
  const [progress, setProgress] = useState(goal?.progress || 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {goal ? "Edit Saving Goal" : "Add Saving Goal"}
        </h2>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Goal name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          min="0"
          max="100"
          className="w-full border p-3 rounded mb-4"
          placeholder="Progress %"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({ id: goal?.id, title, progress: Number(progress) })
            }
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
