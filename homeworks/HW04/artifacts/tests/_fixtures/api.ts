import type { APIRequestContext } from '@playwright/test';

export const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

export interface LoginResult {
  status: number;
  token?: string;
  user?: { id: number; email: string; role: string };
  error?: string;
}

export async function loginViaApi(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<LoginResult> {
  const res = await request.post(`${API_BASE_URL}/api/login`, {
    data: { email, password },
  });
  const body = await res.json();
  return { status: res.status(), ...body };
}

export function authHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
