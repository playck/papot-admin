// 사용자 관련 타입 정의

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  role: "admin" | "customer";
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  address?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
