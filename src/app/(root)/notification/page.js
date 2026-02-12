"use client";

import { useMemo, useState } from "react";
import NotificationCard from "@/components/NotificationCard";

/**
 * UI Notification Shape
 * Suggestion : Backend should be mapped into this shape using mapApiNotificationToUi()
 * 
 * {
 *   id: string|number,
 *   title: string,
 *   subtitle: string,
 *   amount?: number,
 *   type: "add" | "delete",
 *   isRead: boolean,
 *   createdAt: string (UTC ISO)
 * }
 */

// Example mapping function (backend to UI)
function mapApiNotificationToUi(n) {
  // Example backend shapes:
  // n.message, n.status ("READ"/"UNREAD"), n.action ("CREATED"/"DELETED"), n.createdAt
  return {
    id: n.id,
    title: n.title ?? "Notification",
    subtitle: n.message ?? "",
    amount: n.amount ?? undefined,
    type:
      (n.action || "").toUpperCase() === "DELETED" ? "delete" : "add",
    isRead: (n.status || "").toUpperCase() === "READ",
    createdAt: n.createdAt,
  };
}

// Helper to get relative date label (Today, Yesterday, 2 days ago,...)
function getRelativeLabel(createdAt) {
  const now = new Date();

  const todayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  const created = new Date(createdAt);
  const createdUTC = Date.UTC(
    created.getUTCFullYear(),
    created.getUTCMonth(),
    created.getUTCDate()
  );

  const diffDays = Math.floor((todayUTC - createdUTC) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return "Earlier";
}

// Group notifications by relative day label
function groupNotifications(list) {
  const groups = {};

  // Sort by createdAt DESC first ( will be newest first)
  const sorted = [...list].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  sorted.forEach((n) => {
    const label = getRelativeLabel(n.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  });

  return groups;
}

// dummy initial data , replace later
const initialNotifications = [
  {
    id: 1,
    title: "Budget Added",
    subtitle: "Food budget created",
    amount: 200,
    type: "add",
    isRead: false,
    createdAt: "2026-02-11T14:30:00Z",
  },
  {
    id: 2,
    title: "Budget Deleted",
    subtitle: "Car budget removed",
    amount: 350,
    type: "delete",
    isRead: false,
    createdAt: "2026-02-11T09:10:00Z",
  },
  {
    id: 3,
    title: "Saving Goal Added",
    subtitle: "Buying new laptop",
    amount: 1200,
    type: "add",
    isRead: true,
    createdAt: "2026-02-10T18:45:00Z",
  },
  {
    id: 4,
    title: "Transaction Added",
    subtitle: "Grocery shopping",
    amount: 85,
    type: "add",
    isRead: true,
    createdAt: "2026-02-09T20:15:00Z",
  },
  {
    id: 5,
    title: "Budget Deleted",
    subtitle: "Entertainment budget removed",
    amount: 150,
    type: "delete",
    isRead: false,
    createdAt: "2026-02-08T11:00:00Z",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const grouped = useMemo(() => groupNotifications(notifications),[notifications]);

  function handleMarkRead(id) {
    // api mark read(id) then update UI here
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  function handleDelete(id) {
    // api delete(id) then remove from UI here
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl flex flex-col">
        <div className="px-8 py-6 border-b">
          <h1 className="text-2xl font-bold mb-1">Notifications</h1>
          <p className="text-sm text-gray-500">
            View your recent activity and alerts
          </p>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6 overflow-y-auto max-h-[65vh]">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-sm text-gray-500">No notifications yet.</p>
          ) : (
            Object.entries(grouped).map(([label, items]) => (
              <div key={label}>
                <p className="mb-3 text-sm font-medium text-gray-400">
                  {label}
                </p>

                <div className="flex flex-col gap-3">
                  {items.map((n) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onMarkRead={handleMarkRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-6 py-4 text-center text-xs text-gray-400">
          © 2025 Money Smart. All rights reserved · Privacy Policy
        </div>
      </div>
    </section>
  );
}
