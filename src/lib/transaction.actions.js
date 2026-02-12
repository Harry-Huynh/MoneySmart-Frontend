import { getToken } from "./user.actions";

export async function getAllTransactions(type) {
  const token = await getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  const url = type
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions?type=${type}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch transactions");
  return data;
}

export async function getAllTransactionsByMonthAndYear(month, year) {
  const token = await getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions?month=${month}&year=${year}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error(data.message || "Failed to fetch transactions");
  return await res.json();
}
export async function getOneTransaction(id) {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");
  if (!id) throw new Error("Transaction id is required");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/${id}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  throw new Error(data.message || "Failed to get transaction");
  
}

export async function addTransaction(payload) {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  const data = await res.json().catch(() => ({}));
  if (res.status === 201) return true;
  throw new Error(data.message || "Failed to add transaction");
}

export async function updateTransaction(id, payload) {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");
  if (!id) throw new Error("Transaction id is required");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  throw new Error(data.message || "Failed to update transaction");
}

export async function deleteTransaction(id) {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated");
  if (!id) throw new Error("Transaction id is required");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  const data = await res.json().catch(() => ({}));
  if (res.status === 200) return true;
  throw new Error(data.message || "Failed to delete transaction");
}
