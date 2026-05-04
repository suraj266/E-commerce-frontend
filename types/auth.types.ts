export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserSnippet {
  id: string;
  email: string;
  name?: string;
  role: {
    id: string;
    name: string;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: UserSnippet;
}
