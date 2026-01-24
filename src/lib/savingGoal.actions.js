import { getToken } from "./user.actions";

export async function getAllSavingGoals() {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/saving-goals`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(res.message || "Failed to fetch all saving goals");
  }

  return await res.json();
}

export async function getOneSavingGoal(id) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  if (!id) {
    throw new Error("Saving goal id is required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/saving-goal/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(res.message || "Failed to get saving goal");
  }

  return await res.json();
}

export async function addSavingGoal(targetAmount, purpose, targetDate, note) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/saving-goal`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetAmount,
        purpose,
        targetDate,
        note,
      }),
      cache: "no-store",
    },
  );

  const data = await res.json();
  if (res.status === 201) {
    return true;
  }

  throw new Error(data.message || "Failed to create saving goal");
}

export async function updateSavingGoal(
  id,
  targetAmount,
  purpose,
  targetDate,
  note,
  status,
) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  if (!id) {
    throw new Error("Saving goal id is required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/saving-goal/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetAmount,
        purpose,
        targetDate,
        note,
        status,
      }),
      cache: "no-store",
    },
  );

  const data = await res.json();
  if (res.status === 200) {
    return true;
  }

  throw new Error(data.message || "Failed to update saving goal");
}

export async function deleteSavingGoal(id) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  if (!id) {
    throw new Error("Saving goal id is required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/saving-goal/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const data = await res.json();
  if (res.status === 200) {
    return true;
  }

  throw new Error(data.message || "Failed to delete saving goal");
}
