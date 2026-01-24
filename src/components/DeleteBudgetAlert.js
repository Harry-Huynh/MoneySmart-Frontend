"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { Button } from "@/components/ui/button";

/**
 * Reliable AlertDialog wrapper (Radix).
 * - children = trigger (button/menu item)
 * - onOpenChange = optional (use it to close dropdown menu)
 */
export default function DeleteBudgetAlert({
  budgetName,
  onConfirm,
  children,
  onOpenChange,
}) {
  return (
    <AlertDialogPrimitive.Root onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Trigger asChild>
        {children}
      </AlertDialogPrimitive.Trigger>

      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
          <AlertDialogPrimitive.Title className="text-lg font-semibold text-red-500">
            Delete budget?
          </AlertDialogPrimitive.Title>

          <AlertDialogPrimitive.Description className="mt-2 text-sm text-slate-600">
            Are you sure you want to delete{" "}
          <strong className="text-red-500">{budgetName}</strong>? This action can&apos;t be undone.
          </AlertDialogPrimitive.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="outline" className="cursor-pointer hover:bg-slate-100">
                Cancel
              </Button>
            </AlertDialogPrimitive.Cancel>

            <AlertDialogPrimitive.Action asChild>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={onConfirm}
              >
                Delete
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
