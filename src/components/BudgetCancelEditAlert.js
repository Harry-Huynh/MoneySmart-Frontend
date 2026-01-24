"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function BudgetCancelEditAlert({ onConfirm, children }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
          <AlertDialog.Title className="text-2xl font-bold text-slate-800">
            Cancel Editing?
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-3 text-slate-600 leading-relaxed">
            You have unsaved changes. Are you sure you want to cancel?
            Your changes will be lost.
          </AlertDialog.Description>

          <div className="mt-7 flex justify-center gap-6">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="min-w-52 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-semibold cursor-pointer"
              >
                Continue Editing
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={onConfirm}
                className="min-w-40 px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition font-semibold cursor-pointer"
              >
                Yes, Cancel
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
