import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

interface JWTPayload {
  sub: string
  exp: number
}

export function setToken(token: string) {
  Cookies.set("access_token", token, { 
    expires: 7, 
    sameSite: "Lax"
  })
}

export function getToken(): string | undefined {
  return Cookies.get("access_token")
}

export function removeToken() {
  Cookies.remove("access_token")
}

export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) return false
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    return decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function getUserId(): string | null {
  const token = getToken()
  if (!token) return null
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    return decoded.sub
  } catch {
    return null
  }
}