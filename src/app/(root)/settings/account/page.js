import Link from "next/link";
import { FiEdit2 } from "react-icons/fi";

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-4 border-b last:border-b-0">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="sm:col-span-2 text-sm text-gray-900">
        {value ?? <span className="text-gray-400">—</span>}
      </div>
    </div>
  );
}

export default async function AccountSettingsPage({ searchParams }) {
    const profile = {
    name: "John Wick",
    email: "john.wich@myseneca.ca",
    region: "Canada",
    dateFormat: "12/31/2025",
  };

    return (
        <section className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="mb-5">
            <Link
            href="/settings"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-xl cursor-pointer"
            >
            ← Account Settings
            </Link>
        </div>

        {/* Main here*/}
        <div className="mx-auto w-full max-w-6xl">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                Profile Information
                </h2>

                <Link
                href="/settings/account/edit"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                <FiEdit2 className="h-4 w-4" />
                Edit
                </Link>
            </div>

            {/* Profile rows */}
            <div className="px-6 py-2">
                <InfoRow label="Name" value={profile.name} />
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Region" value={profile.region} />
                <InfoRow label="Date Format" value={profile.dateFormat} />
            </div>
            </div>
        </div>
        </section>
    );
}
