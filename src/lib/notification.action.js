import { getToken } from "./user.actions";

export const addNotification = async (notification) => {
  const token = await getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    },
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to add notification");
  }

  if (res.status === 201) return true;

  return false;
};
