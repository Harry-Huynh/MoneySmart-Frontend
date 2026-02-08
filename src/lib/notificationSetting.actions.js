import { getToken } from "./user.actions";

export async function getNotificationSettings() {
  const token = await getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification-settings`,
    {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch notification settings");
  }
  
  return data;
}

export async function updateNotificationSettings(settings) {
  const token = await getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification-settings`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to update notification settings");
  }
  
  return data;
}