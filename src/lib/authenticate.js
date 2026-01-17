function setToken(token) {
  localStorage.setItem("access_token", token);
}

export function getToken() {
  try {
    return localStorage.getItem("access_token");
  } catch (error) {
    return null;
  }
}

export function removeToken() {
  localStorage.removeItem("access_token");
}

export function isAuthenticated() {
  const token = getToken();
  return token ? true : false;
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
    setToken(data.token);
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
  currency,
  dateFormat
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
      currency,
      dateFormat,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return true;
  } else {
    throw new Error(data.message);
  }
}
