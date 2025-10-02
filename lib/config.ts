// URLs da API
export const API_CONFIG = {
  GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  GRAPHQL_PROXY: '/api/graphql', // Proxy local para evitar CORS
} as const

// URLs de NextAuth
export const AUTH_CONFIG = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
} as const

// Configurações do Google OAuth
export const GOOGLE_CONFIG = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
} as const

// Configurações da aplicação
export const APP_CONFIG = {
  NAME: 'AuraHub',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de gestão financeira integrado',
} as const

// Função helper para obter a URL correta da API GraphQL
export function getGraphQLUrl(): string {
  // No cliente, usar sempre o proxy para evitar CORS
  if (typeof window !== 'undefined') {
    return API_CONFIG.GRAPHQL_PROXY
  }
  
  // No servidor, usar a URL direta
  return API_CONFIG.GRAPHQL_ENDPOINT
}

// Função helper para fazer requests GraphQL
export function getGraphQLConfig() {
  return {
    url: getGraphQLUrl(),
    headers: {
      'Content-Type': 'application/json',
    }
  }
}
