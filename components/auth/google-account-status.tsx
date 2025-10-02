"use client"

import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, AlertCircle, User } from "lucide-react"

export function GoogleAccountStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conta Google</CardTitle>
          <CardDescription>Carregando informações...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Conta Google
          </CardTitle>
          <CardDescription>
            Conecte sua conta Google para facilitar o acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Não conectado</Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Conta Google
        </CardTitle>
        <CardDescription>
          Sua conta Google está conectada e sincronizada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{session.user?.name}</p>
            <p className="text-xs text-muted-foreground">{session.user?.email}</p>
            <Badge variant="default" className="bg-green-100 text-green-800">
              Conectado
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
