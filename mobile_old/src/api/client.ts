import { API_BASE_URL } from "../constants/config";
import { useAuthStore } from "../store/authStore";
import type { ApiError } from "../types";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClientError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, params } = options;
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Token ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiClientError(0, "Connection lost. We'll retry when you're back online.");
  }

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = data as ApiError;
    throw new ApiClientError(response.status, err.detail ?? "Something went wrong.");
  }
  return data as T;
}

export { ApiClientError };