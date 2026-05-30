import { Platform } from 'react-native';
import { localStorageService } from './storage';

const DEFAULT_LOCALHOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://10.41.11.245:3000';
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_LOCALHOST;
// helpful dev log to surface which base URL the app is using
if (typeof console !== 'undefined' && API_URL) {
  // eslint-disable-next-line no-console
  console.log(`[api] using base URL: ${API_URL}`);
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = API_URL;
  if (!base) {
    throw new Error('EXPO_PUBLIC_API_URL no está configurado y no se pudo resolver un valor por defecto.');
  }
  const response = await fetch(`${base}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json() as Promise<T>;
}

export async function graphqlFetch<T = any>(query: string, variables?: Record<string, any>, token?: string): Promise<T> {
  const base = API_URL;
  if (!base) throw new Error('API URL no disponible');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${base}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
  } catch (err: any) {
    throw new Error(`Network error connecting to ${base}/graphql: ${err?.message ?? String(err)}`);
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const message = json?.errors?.map((e: any) => e.message).join('; ') ?? `API error ${res.status}`;
    throw new Error(message);
  }
  if (json?.errors && json.errors.length) {
    throw new Error(json.errors.map((e: any) => e.message).join('; '));
  }
  return json.data as T;
}

async function getDeviceContext() {
  let deviceToken = await localStorageService.getItem('deviceToken');
  if (!deviceToken) {
    deviceToken = `${Platform.OS}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await localStorageService.setItem('deviceToken', deviceToken);
  }
  return {
    deviceToken,
    platform: Platform.OS,
  };
}

export async function loginRequest(email: string, password: string) {
  const device = await getDeviceContext();
  const modernQuery = `mutation Login($data: LoginDTO!) { login(data: $data) { accessToken refreshToken user { id name email role createdAt } } }`;
  try {
    return await graphqlFetch<{ login: { accessToken: string; refreshToken: string; user: any } }>(modernQuery, {
      data: { email, password, deviceToken: device.deviceToken, platform: device.platform },
    });
  } catch (err: any) {
    const legacyQuery = `mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { accessToken refreshToken user { id name email role createdAt } } }`;
    const message = err?.message ?? '';
    if (message.includes('Unknown argument') || message.includes('Unknown type') || message.includes('LoginDTO')) {
      return graphqlFetch<{ login: { accessToken: string; refreshToken: string; user: any } }>(legacyQuery, { email, password });
    }
    throw err;
  }
}

export async function refreshRequest(refreshToken: string) {
  const query = `mutation Refresh($refreshToken: String!) { refreshToken(refreshToken: $refreshToken) { accessToken refreshToken user { id name email role createdAt } } }`;
  return graphqlFetch<{ refreshToken: { accessToken: string; refreshToken: string; user: any } }>(query, { refreshToken });
}

export async function registerRequest(params: { name: string; email: string; password: string; role: 'ELDERLY' | 'FAMILY' }) {
  const modernQuery = `mutation Register($data: CreateUserDTO!) { createUser(data: $data) { id name email role createdAt } }`;
  try {
    return await graphqlFetch<{ createUser: { id: number; name: string; email: string; role: string } }>(modernQuery, {
      data: params,
    });
  } catch (err: any) {
    const legacyQuery = `mutation Register($data: CrearUsuarioDTO!) { createUser(data: $data) { id name email role createdAt } }`;
    const message = err?.message ?? '';
    if (message.includes('Unique constraint failed') || message.includes('User_email_key') || message.includes('email')) {
      throw new Error('Este correo ya está registrado. Inicia sesión o usa otro correo.');
    }
    if (message.includes('Unknown type') || message.includes('CreateUserDTO')) {
      return graphqlFetch<{ createUser: { id: number; name: string; email: string; role: string } }>(legacyQuery, {
        data: params,
      });
    }
    throw err;
  }
}
