import { getUrl } from "./config";

export async function request(
  path,
  {
    method = "GET",
    body = undefined,
    headers = {},
    fallbackMessage = null
  } = {}
) {
  try {
    const res = await fetch(getUrl(path), {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      ...(body !== undefined && {
        body: JSON.stringify(body)
      })
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(
        data?.detail ||
          data?.message ||
          fallbackMessage ||
          `Request failed with status ${res.status}`
      );
    }

    return data;
  } catch (err) {
    console.error(`${method} ${path} failed:`, err);
    throw err;
  }
}
