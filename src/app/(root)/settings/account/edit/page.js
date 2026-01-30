"use client";

import Link from "next/link";
import AccountSettingsEditForm from "@/components/AccountSettingsEditForm";

export default function AccountSettingsEditPage() {
  return (
    <section className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mb-5">
        <Link
          href="/settings/account"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-xl cursor-pointer"
        >
          ← Account Settings
        </Link>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <AccountSettingsEditForm />
      </div>
    </section>
  );
}
