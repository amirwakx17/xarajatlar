export async function api(path, options = {}) {
  const { method = "GET", body } = options;

  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: "include",
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const error = new Error("network");
    error.code = "network";
    throw error;
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error || "server_error");
    error.code = data?.error || "server_error";
    error.status = response.status;
    throw error;
  }
  return data;
}
