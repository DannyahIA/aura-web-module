"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { LoginInput, RegisterInput } from "@/lib/types"

interface User {
  id: string
  name: string
  email: string
  phoneNumber?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      // Usuário logado via Google
      const googleUser: User = {
        id: session.user.email || '', // Usar email como ID temporário
        name: session.user.name || '',
        email: session.user.email || '',
        avatar: session.user.image || "/diverse-user-avatars.png"
      }
      setUser(googleUser)
      setIsLoading(false)
    } else {
      // Verificar se há usuário logado via método tradicional
      const storedUser = localStorage.getItem("aura-user")
      const storedToken = localStorage.getItem("aura-token")
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }
  }, [session, status])

  const loginWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Erro no login com Google:', error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Make GraphQL request directly
      const response = await fetch('http://200.103.188.216:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Login($input: LoginInput!) {
              login(input: $input) {
                token
                user {
                  id
                  name
                  email
                  phoneNumber
                  createdAt
                  updatedAt
                }
              }
            }
          `,
          variables: {
            input: { email, password }
          }
        })
      })

      const { data, errors } = await response.json()

      if (data?.login && !errors) {
        const { token, user: userData } = data.login
        
        // Store token and user data
        localStorage.setItem("aura-token", token)
        localStorage.setItem("aura-user", JSON.stringify(userData))
        
        // Set user state with avatar placeholder
        const userWithAvatar = {
          ...userData,
          avatar: "/diverse-user-avatars.png"
        }
        
        setUser(userWithAvatar)
        setIsLoading(false)
        return true
      } else {
        console.error("Login errors:", errors)
      }
    } catch (error) {
      console.error("Login error:", error)
    }

    setIsLoading(false)
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Make GraphQL request directly
      const response = await fetch('http://200.103.188.216:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Register($input: RegisterInput!) {
              register(input: $input) {
                token
                user {
                  id
                  name
                  email
                  phoneNumber
                  createdAt
                  updatedAt
                }
              }
            }
          `,
          variables: {
            input: { name, email, password }
          }
        })
      })

      const { data, errors } = await response.json()

      if (data?.register && !errors) {
        const { token, user: userData } = data.register
        
        // Store token and user data
        localStorage.setItem("aura-token", token)
        localStorage.setItem("aura-user", JSON.stringify(userData))
        
        // Set user state with avatar placeholder
        const userWithAvatar = {
          ...userData,
          avatar: "/diverse-user-avatars.png"
        }
        
        setUser(userWithAvatar)
        setIsLoading(false)
        return true
      } else {
        console.error("Register errors:", errors)
      }
    } catch (error) {
      console.error("Register error:", error)
    }

    setIsLoading(false)
    return false
  }

  const logout = async () => {
    // Logout do NextAuth se houver sessão
    if (session) {
      await signOut({ callbackUrl: '/auth/signin' })
    }
    
    // Cleanup do localStorage
    setUser(null)
    localStorage.removeItem("aura-user")
    localStorage.removeItem("aura-token")
  }

  return <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
