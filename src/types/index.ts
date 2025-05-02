// types/index.ts

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  user: string; // user ID
  createdAt: string;
  updatedAt: string;
}
