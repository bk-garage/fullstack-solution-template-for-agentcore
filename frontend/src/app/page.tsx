"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

type PatternCardProps = {
  title: string
  description: string
  href: string
  features: string[]
}

const PatternCard = ({ title, description, href, features }: PatternCardProps) => (
  <Card className="h-full bg-white/95 backdrop-blur-sm border-brand-yellow/20 hover:bg-white transition-colors">
    <CardHeader>
      <CardTitle className="text-brand-dark">{title}</CardTitle>
      <CardDescription className="text-brand-teal">{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <ul className="text-sm text-brand-dark/80 space-y-1">
        {features.map((feature, index) => (
          <li key={index}>• {feature}</li>
        ))}
      </ul>
      <Link href={href}>
        <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white">
          Try Pattern
        </Button>
      </Link>
    </CardContent>
  </Card>
)

export default function Home() {
  const { signOut } = useAuth()

  const patterns = [
    {
      title: "Chat Interface",
      description: "Real-time conversational AI with streaming responses",
      href: "/chat",
      features: ["Message history", "Streaming responses", "Loading states", "Auto-scroll"],
    },
    {
      title: "Form Generator",
      description: "Submit forms and process with GenAI workflows",
      href: "/form-generator",
      features: ["Form validation", "Job processing", "Progress tracking", "Results display"],
    },
    {
      title: "Document Analyzer",
      description: "Upload and analyze documents with AI-powered insights",
      href: "/document-analyzer",
      features: ["Drag & drop upload", "Batch processing", "Export results", "Progress tracking"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-teal to-brand-dark">
      {/* Header */}
      <header className="w-full bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">GenAI React Launch Kit</h1>
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in-up">
            GenAI React Launch Kit
          </h1>
          <p className="text-xl text-white/90 mb-6">
            A collection of GenAI interface patterns built with React, Tailwind CSS, and Shadcn
            components
          </p>
          <div className="bg-brand-yellow/20 border border-brand-yellow/30 rounded-lg p-4 max-w-3xl mx-auto backdrop-blur-sm">
            <p className="text-white">
              💡 <strong>Pro Tip:</strong> This starter kit is designed to work seamlessly with
              Amazon Q Developer and other coding assistants to accelerate your GenAI frontend
              development.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {patterns.map((pattern, index) => (
            <PatternCard key={index} {...pattern} />
          ))}
        </div>

        <div className="text-center text-white/70">
          <p>
            Built with Next.js, React, TypeScript,
            <a href="https://tailwindcss.com/" target="_blank">
              Tailwind CSS
            </a>
            , and{" "}
            <a href="https://ui.shadcn.com/docs/components" target="_blank">
              Shadcn UI components
            </a>
            - fully customizable yet time-saving
          </p>
        </div>
      </div>
    </div>
  )
}
