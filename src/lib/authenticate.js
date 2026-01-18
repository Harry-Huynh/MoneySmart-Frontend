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

function isTokenExpired(token) {
  try {
    const { exp } = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );

    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);

    return exp <= now;
  } catch (error) {
    return true;
  }
}

export async function isAuthenticated() {
  const token = await getToken();

  if (token && isTokenExpired(token)) {
    await removeToken();
    return false;
  }

  return true;
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
