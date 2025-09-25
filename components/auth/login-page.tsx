"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Link, Loader2 } from "lucide-react"
import { Logo } from "@/components/ui/logo";

const GoogleIcon = () => <svg role="img" viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.99 1.9-4.23 0-7.61-3.38-7.61-7.61s3.38-7.61 7.61-7.61c2.38 0 3.89.96 4.8 1.88l2.53-2.53C18.22.86 15.61 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.02 0 12.24-4.8 12.24-12.24 0-.82-.07-1.62-.2-2.4z"></path></svg>

const Showcase = () => (
  <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
    <div className="absolute inset-0 overflow-hidden">
        <div className="aurora-circle" style={{'--x-start': '50%', '--y-start': '50%', '--x-end': '10%', '--y-end': '90%', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(13, 99, 128, 0.4) 0%, rgba(13, 99, 128, 0) 60%)', animationDuration: '25s' } as React.CSSProperties}></div>
        <div className="aurora-circle" style={{'--x-start': '10%', '--y-start': '90%', '--x-end': '70%', '--y-end': '10%', top: '0%', left: '0%', width: '150%', height: '150%', background: 'radial-gradient(circle, rgba(217, 119, 6, 0.3) 0%, rgba(217, 119, 6, 0) 70%)', animationDuration: '30s', animationDelay: '5s' } as React.CSSProperties}></div>
    </div>
    
    <div className="relative z-20 flex items-center gap-2 text-lg font-medium text-black">
      <Logo />
    </div>
    <div className="relative z-20 mt-auto">
      <blockquote className="space-y-2">
        <p className="text-lg text-black">
          “AuraHub has transformed the way I manage my digital life. Finances, automation, and calendar, all in one place.”
        </p>
        <footer className="text-sm text-cyan-900">Satisfied User</footer>
      </blockquote>
    </div>
  </div>
);

export function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const { login, register, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const success = isLoginView
        ? await login(formData.email, formData.password)
        : await register(formData.name, formData.email, formData.password)

      if (!success) {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again later.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold font-montserrat">
                {isLoginView ? "Sign In to Your Account" : "Create Your Account"}
              </h1>
              <p className="text-balance text-muted-foreground">
                {isLoginView ? "Enter your email to sign in." : "Enter your details to get started."}
              </p>
            </div>
          
            <form onSubmit={handleSubmit} className="grid gap-4">
               {!isLoginView && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required={!isLoginView} />
                </div>
               )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                   {isLoginView && (
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} required />
                   <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

               {error && <p className="text-sm text-destructive text-center">{error}</p>}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoginView ? "Sign In" : "Create Account and Access"}
              </Button>
              <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign in with</span></div>
              </div>
              <Button variant="outline" className="w-full" type="button"><GoogleIcon /> <span className="ml-2">Google</span></Button>
            </form>
            <div className="mt-4 text-center text-sm">
               <Button
                  variant="link"
                  className="p-0"
                  onClick={() => {
                    setIsLoginView(!isLoginView)
                    setError("")
                    setFormData({ name: "", email: "", password: "" })
                  }}
                >
                  {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
            </div>
          </div>
      </div>
      <Showcase />
    </div>
  )
}