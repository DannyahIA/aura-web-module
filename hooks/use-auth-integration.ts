import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function useAuthIntegration() {
  const { data: session, status } = useSession()
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setIsGoogleUser(true)
      
      // Aqui você pode fazer a sincronização com seu backend
      // Por exemplo, buscar dados adicionais do usuário
      syncWithBackend(session.user)
    } else {
      setIsGoogleUser(false)
    }
  }, [session])

  const syncWithBackend = async (googleUser: any) => {
    try {
      // Verificar se o usuário existe no backend
      const response = await fetch('/api/graphql', {
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

      const { data } = await response.json()
      
      if (data?.userByEmail) {
        // Usuário existe, salvar dados no localStorage
        localStorage.setItem("aura-user", JSON.stringify(data.userByEmail))
        localStorage.setItem("aura-google-session", "true")
      }
    } catch (error) {
      console.error('Erro ao sincronizar com backend:', error)
    }
  }

  return {
    session,
    status,
    isGoogleUser,
    isLoading: status === "loading"
  }
}
