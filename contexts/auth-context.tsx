"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { LoginInput, RegisterInput } from "@/lib/types"
import { getGraphQLUrl } from "@/lib/config"

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
      // Usuário logado via Google - precisamos registrar/buscar no backend
      handleGoogleUser(session.user)
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

  const handleGoogleUser = async (googleUser: any) => {
    try {
      // Primeiro, tentar fazer login com o email do Google
      const loginResponse = await fetch(getGraphQLUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetUserByEmail($email: String!) {
              userByEmail(email: $email) {
                id
                name
                email
                phoneNumber
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            email: googleUser.email
          }
        })
      })

      const loginData = await loginResponse.json()

      if (loginData.data?.userByEmail) {
        // Usuário já existe, usar os dados do backend
        const backendUser: User = {
          id: loginData.data.userByEmail.id,
          name: loginData.data.userByEmail.name,
          email: loginData.data.userByEmail.email,
          phoneNumber: loginData.data.userByEmail.phoneNumber,
          avatar: googleUser.image || "/diverse-user-avatars.png"
        }
        setUser(backendUser)
        localStorage.setItem("aura-user", JSON.stringify(backendUser))
      } else {
        // Usuário não existe, criar no backend
        const registerResponse = await fetch(getGraphQLUrl(), {
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
              input: {
                name: googleUser.name || '',
                email: googleUser.email,
                password: 'google-auth-' + Date.now(), // Senha temporária para usuários do Google
                phoneNumber: ''
              }
            }
          })
        })

        const registerData = await registerResponse.json()

        if (registerData.data?.register) {
          const newUser: User = {
            id: registerData.data.register.user.id,
            name: registerData.data.register.user.name,
            email: registerData.data.register.user.email,
            phoneNumber: registerData.data.register.user.phoneNumber,
            avatar: googleUser.image || "/diverse-user-avatars.png"
          }
          setUser(newUser)
          localStorage.setItem("aura-user", JSON.stringify(newUser))
          localStorage.setItem("aura-token", registerData.data.register.token)
        }
      }
    } catch (error) {
      console.error('Erro ao processar usuário do Google:', error)
      // Fallback: usar dados do Google como estavam antes
      const googleUserFallback: User = {
        id: googleUser.email || '',
        name: googleUser.name || '',
        email: googleUser.email || '',
        avatar: googleUser.image || "/diverse-user-avatars.png"
      }
      setUser(googleUserFallback)
    } finally {
      setIsLoading(false)
    }
  }

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
      const response = await fetch(getGraphQLUrl(), {
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
      const response = await fetch(getGraphQLUrl(), {
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
