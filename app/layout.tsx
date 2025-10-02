// app/layout.tsx

"use client";

import type React from "react"
import { ApolloProvider } from "@apollo/client/react";
import client from "@/lib/apollo-client";

import { NextAuthProvider } from "@/contexts/next-auth-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { LayoutProvider } from "@/contexts/layout-context"
import { MainLayout } from "@/components/layout/main-layout"
import "./globals.css"
import { Montserrat, Open_Sans } from "next/font/google"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <head>
        <title>AuraHub - Personal Automation System</title>
        <meta name="description" content="Complete financial and home automation system" />
      </head>
      <body>
        <NextAuthProvider>
          <ApolloProvider client={client}>
            <AuthProvider>
              <LayoutProvider>
                <MainLayout>
                  {children}
                </MainLayout>
              </LayoutProvider>
            </AuthProvider>
          </ApolloProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}