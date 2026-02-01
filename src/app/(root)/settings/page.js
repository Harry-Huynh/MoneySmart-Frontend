import Link from "next/link";
import {
  MdChevronRight,
  MdPerson,
  MdLock,
  MdNotifications,
  MdStorage,
  MdHelpOutline,
} from "react-icons/md";

const settingsItems = [
  {
    title: "Account Settings",
    description: "Manage your personal information",
    href: "/settings/account",
    icon: MdPerson,
    highlight: true,
  },
  {
    title: "Security & Privacy",
    description: "Password, security and privacy options",
    href: "/settings/security",
    icon: MdLock,
  },
  {
    title: "Notifications",
    description: "Manage notification preferences",
    href: "/settings/notifications",
    icon: MdNotifications,
  },
  {
    title: "Data Management",
    description: "Manage your stored data",
    href: "/settings/data",
    icon: MdStorage,
  },
  {
    title: "Help & Support",
    description: "Get help or contact support",
    href: "/settings/help",
    icon: MdHelpOutline,
  },
];

export default function SettingsPage() {
  return (
    <section className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b">
          <h1 className="text-2xl font-bold mb-1">Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your account and application preferences
          </p>
        </div>

        {/* Settings List */}
        <div className="px-6 py-4 flex flex-col gap-2">
          {settingsItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="
                        group
                        flex items-center justify-between
                        px-4 py-4 rounded-xl border border-gray-200
                        transition-all duration-200
                        hover:bg-emerald-50 hover:border-emerald-200
                "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                            p-2 rounded-lg
                            bg-gray-100 text-gray-600
                            transition-colors
                            group-hover:bg-emerald-100 group-hover:text-emerald-600
                        "
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>

                <MdChevronRight
                  size={22}
                  className="
                        text-gray-400
                        transition-transform duration-200
                        group-hover:translate-x-1
                    "
                />
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-center text-xs text-gray-400">
          © 2025 Money Smart. All rights reserved · Privacy Policy
        </div>
      </div>
    </section>
  );
}