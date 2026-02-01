"use server";

import { getToken } from "./user.actions";

export async function getAllBudgets() {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/budgets`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(res.message || "Failed to fetch all budgets");
  }

  return await res.json();
}

export async function getOneBudget(id) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }
  if (!id) {
    throw new Error("Budget id is required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/budget/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(res.message || "Failed to get budget");
  }

  return await res.json();
}

export async function addBudget(
  amount,
  purpose,
  startDate,
  endDate,
  thresholdAmount,
  note,
) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/budget`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      purpose,
      startDate,
      endDate,
      thresholdAmount,
      note,
    }),
    cache: "no-store",
  });

  const data = await res.json();
  if (res.status === 201) {
    return true;
  }

  throw new Error(data.message || "Failed to create new Budget ");
}

export async function updateBudget(
  id,
  amount,
  purpose,
  startDate,
  endDate,
  thresholdAmount,
  note,
) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }
  if (!id) {
    throw new Error("Budget id is required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/budget/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        purpose,
        startDate,
        endDate,
        thresholdAmount,
        note,
      }),
      cache: "no-store",
    },
  );

  const data = await res.json();
  if (res.status === 200) {
    return true;
  }

  throw new Error(data.message || "Failed to update Budget ");
}

export async function deleteBudget(id) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }
  if (!id) {
    throw new Error("Budget id is required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/budget/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (res.status === 200) return true;

  throw new Error(data.message || `Failed to delete budget (${res.status})`);
}
