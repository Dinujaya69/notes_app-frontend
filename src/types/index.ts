
export interface User {
  _id: string;
  username: string;
  email: string;
    password?: string;
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
  user: string; 
  createdAt: string;
  updatedAt: string;
}
