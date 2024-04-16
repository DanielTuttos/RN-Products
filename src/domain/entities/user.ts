export interface User {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}