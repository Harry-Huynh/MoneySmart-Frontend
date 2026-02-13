// notifications.actions.js
import { getToken } from "./user.actions";

export async function getAllNotifications() {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch notifications");
  return data; 
}

export async function getUnreadNotifications() {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/unread`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch unread notifications");
  return data; 
}

export async function getOneNotification(id) {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");
  if (!id) throw new Error("Notification id is required");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/${id}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (res.ok) return data; 
  throw new Error(data.message || "Failed to get notification");
}

export async function addNotification(payload) {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (res.status === 201) return true;
  throw new Error(data.message || "Failed to add notification");
}

export async function markNotificationAsRead(id) {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");
  if (!id) throw new Error("Notification id is required");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/${id}/read`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (res.ok) return true;
  throw new Error(data.message || "Failed to mark notification as read");
}

export async function markAllNotificationsAsRead() {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/read-all`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (res.ok) return true;
  throw new Error(data.message || "Failed to mark all notifications as read");
}

export async function deleteNotification(id) {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");
  if (!id) throw new Error("Notification id is required");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (res.status === 200) return true;
  throw new Error(data.message || "Failed to delete notification");
}
