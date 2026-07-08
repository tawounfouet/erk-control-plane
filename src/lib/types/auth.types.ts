export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  is_active: boolean
  is_staff: boolean
  is_tenant: boolean
  full_name: string
  role_display: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user?: User
}

export interface TokenRefresh {
  access: string
}

export interface TokenVerify {
  token: string
}
