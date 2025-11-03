"use client"

import FormGenerator from "@/components/form-generator/FormGenerator"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

export default function FormGeneratorPage() {
  const { isAuthenticated, signIn } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-4xl">Please sign in</p>
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <Link href="/">
          <Button variant="outline" size="sm">← Back to Home</Button>
        </Link>
      </div>
      <FormGenerator />
    </div>
  )
}