import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Aqui você pode adicionar lógica adicional de middleware
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acesso se houver token NextAuth ou token personalizado no localStorage
        const { pathname } = req.nextUrl
        
        // Rotas públicas que não precisam de autenticação
        const publicRoutes = ['/auth/signin', '/auth/error', '/api/auth']
        
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }
        
        // Verificar se há token NextAuth
        if (token) {
          return true
        }
        
        // Se não há token NextAuth, redirecionar para login
        return false
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
