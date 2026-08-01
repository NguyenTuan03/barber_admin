export interface AuthUser {
  id: number | string;
  email: string;
  name?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user: AuthUser;
  error?: string;
}
