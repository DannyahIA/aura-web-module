import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === 'google') {
        try {
          // Verificar se o usuário já existe no backend
          const checkUserResponse = await fetch('/api/graphql', {
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
                  }
                }
              `,
              variables: {
                email: user.email
              }
            })
          })

          const { data: userData } = await checkUserResponse.json()

          // Se o usuário não existe, criar um novo
          if (!userData?.userByEmail) {
            const createUserResponse = await fetch('/api/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: `
                  mutation CreateUser($input: CreateUserInput!) {
                    createUser(input: $input) {
                      id
                      name
                      email
                    }
                  }
                `,
                variables: {
                  input: {
                    name: user.name || user.email?.split('@')[0] || 'Usuário Google',
                    email: user.email,
                    password: Math.random().toString(36).substring(2, 15), // Password temporária
                    phoneNumber: ''
                  }
                }
              })
            })

            const { data: newUserData, errors } = await createUserResponse.json()
            
            if (errors) {
              console.error('Erro ao criar usuário:', errors)
              return false
            }

            console.log('Novo usuário criado:', newUserData.createUser)
          }
          
          return true
        } catch (error) {
          console.error('Erro durante signIn:', error)
          return false
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
}

export default NextAuth(authOptions)
