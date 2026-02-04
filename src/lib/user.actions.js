"use server";

import { cookies } from "next/headers";

async function setToken(token) {
  (await cookies()).set("access_token", token, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}

export async function getToken() {
  try {
    const token = (await cookies()).get("access_token");

    if (token) {
      return token.value;
    }
  } catch (error) {
    return null;
  }
}

export async function removeToken() {
  (await cookies()).delete("access_token");
}

export async function isTokenExpired(token) {
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);

    return exp <= now;
  } catch (error) {
    return true;
  }
}

export async function authenticateUser(username, password) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    await setToken(data.token);
    return true;
  } else {
    throw new Error(data.message);
  }
}

export async function registerUser(
  name,
  username,
  password,
  confirmedPassword,
  email,
  phoneNumber,
  region,
  currencyCode,
  dateFormat,
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
    method: "POST",
    body: JSON.stringify({
      name,
      username,
      password,
      confirmedPassword,
      email,
      phoneNumber,
      region,
      currencyCode,
      dateFormat,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status === 201) {
    return true;
  } else {
    throw new Error(data.message);
  }
}

export async function verifyPassword(password) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/verify-password`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
      cache: "no-store",
    },
  );

  const data = await res.json();
  if (res.status === 200) {
    return data.success;
  }

  throw new Error(data.message || "Failed to verify password");
}

export async function changePassword(newPassword) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/change-password`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword }),
      cache: "no-store",
    },
  );

  const data = await res.json();
  if (res.status === 200) {
    return data.success;
  }

  throw new Error(data.message || "Failed to change password");
}

export async function getLastPasswordChangeDate() {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/change-password/date`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const data = await res.json();
  if (res.status === 200) {
    return data.lastChangeDate;
  }

  throw new Error(
    data.message || "Failed to retrieve last password change date",
  );
}
