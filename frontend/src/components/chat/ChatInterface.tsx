"use client"

import { useEffect, useRef, useState } from "react"
import { ChatHeader } from "./ChatHeader"
import { ChatInput } from "./ChatInput"
import { ChatMessages } from "./ChatMessages"
import { ChatSidebar } from "./ChatSidebar"
import { Message, ChatSession } from "./types"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

import { useGlobal } from "@/app/context/GlobalContext"

/**
 * REMOVE THIS FUNCTION WHEN YOU'RE READY TO INTEGRATE WITH YOUR BACKEND!
 * This is a mock function to simulate a delay in the response from the backend.
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock data for demonstration
const mockSessions: ChatSession[] = [
  {
    id: "1",
    name: "Adding ShadCN Components Guide",
    history: [
      { role: "user", content: "How do I add new ShadCN components to this starter kit?", timestamp: new Date(Date.now() - 86400000).toISOString() },
      { role: "assistant", content: "To add ShadCN components to this starter kit, you can use these example prompts:\n\n**Adding a new component:**\n\"Add a ShadCN dialog component for user settings\"\n\"Create a data table component using ShadCN table\"\n\"Add a toast notification system using ShadCN toast\"\n\n**Adding multiple components:**\n\"Add ShadCN accordion, tabs, and tooltip components for a FAQ page\"\n\"Create a form with ShadCN input, select, checkbox, and button components\"\n\n**Component with functionality:**\n\"Add a ShadCN calendar component with date picker functionality\"\n\"Create a ShadCN command palette for navigation\"\n\nThe AI will automatically install the components and create the necessary files in the components directory following the project's TypeScript and styling conventions.", timestamp: new Date(Date.now() - 86400000 + 3600000).toISOString() }
    ],
    startDate: new Date(Date.now() - 86400000).toISOString(),
    endDate: new Date(Date.now() - 86400000 + 3600000).toISOString()
  },
  {
    id: "2",
    name: "TailwindCSS Styling Tips",
    history: [
      { role: "user", content: "How should I prompt for styling updates using TailwindCSS?", timestamp: new Date(Date.now() - 172800000).toISOString() },
      { role: "assistant", content: "Here are effective prompts for TailwindCSS styling updates:\n\n**Layout changes:**\n\"Make the chat interface have a dark theme using Tailwind classes\"\n\"Update the sidebar to be sticky and add hover effects\"\n\"Change the button styles to use rounded-full and shadow-lg\"\n\n**Responsive design:**\n\"Make the chat layout responsive for mobile devices\"\n\"Add responsive grid layout for the dashboard page\"\n\n**Component styling:**\n\"Style the chat messages with better spacing and typography\"\n\"Add gradient backgrounds and animations to the loading spinner\"\n\"Update the form inputs to have focus states and validation styling\"\n\n**Color and theme:**\n\"Change the color scheme to use blue-600 as primary color\"\n\"Add custom CSS variables for consistent theming\"\n\nBe specific about the visual changes you want - the AI will apply the appropriate Tailwind classes while following the project's design system.", timestamp: new Date(Date.now() - 172800000 + 1800000).toISOString() }
    ],
    startDate: new Date(Date.now() - 172800000).toISOString(),
    endDate: new Date(Date.now() - 172800000 + 1800000).toISOString()
  },
  {
    id: "3",
    name: "React, TailwindCSS & ShadCN Benefits",
    history: [
      { role: "user", content: "How to build a React app?", timestamp: new Date(Date.now() - 259200000).toISOString() },
      { role: "assistant", content: "To build a React app, you can use Create React App or Next.js. This starter kit uses Next.js with TypeScript, TailwindCSS, and ShadCN components for a modern development experience.", timestamp: new Date(Date.now() - 259200000 + 1200000).toISOString() },
      { role: "user", content: "What are the benefits of using TailwindCSS and ShadCN?", timestamp: new Date(Date.now() - 259200000 + 1800000).toISOString() },
      { role: "assistant", content: "**TailwindCSS Benefits:**\n• Utility-first approach for rapid development\n• No CSS file bloat - only used classes are included\n• Consistent design system with predefined spacing, colors, and typography\n• Responsive design made easy with built-in breakpoint prefixes\n• Easy customization through configuration\n\n**ShadCN Benefits:**\n• Copy-paste components that you own and control\n• Built on Radix UI primitives for accessibility\n• Fully customizable with Tailwind classes\n• TypeScript support out of the box\n• No runtime dependencies - components become part of your codebase\n• Consistent design language across your application\n\nTogether, they provide a powerful combination for building modern, accessible, and maintainable React applications with excellent developer experience.", timestamp: new Date(Date.now() - 259200000 + 2400000).toISOString() }
    ],
    startDate: new Date(Date.now() - 259200000).toISOString(),
    endDate: new Date(Date.now() - 259200000 + 2400000).toISOString()
  }
]

export default function ChatInterface() {
  // State for chat messages and user input
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions)
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>()

  const { isLoading, setIsLoading } = useGlobal()

  // Ref for message container to enable auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Mock function to simulate sending a message to backend
  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return

    // Add user message to chat
    const newUserMessage: Message = { role: "user", content: userMessage, timestamp: new Date().toISOString() }

    // If this is the first message and no current session, create new session
    if (messages.length === 0 && !currentSessionId) {
      createNewSession(newUserMessage)
    }

    setMessages(prev => [...prev, newUserMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API delay
    await sleep(5000)

    // Mock assistant response
    const assistantResponse: Message = {
      role: "assistant",
      content: `This is a mock response to: "${userMessage}". In a real implementation, this would be replaced with an actual API call to your GenAI backend.`,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, assistantResponse])
    setIsLoading(false)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    sendMessage(input)
  }

  // Start a new chat
  const startNewChat = () => {
    // Save current session if it has messages
    if (messages.length > 0 && currentSessionId) {
      const sessionToUpdate = sessions.find(s => s.id === currentSessionId)
      if (sessionToUpdate) {
        setSessions(prev =>
          prev.map(s =>
            s.id === currentSessionId
              ? { ...s, history: messages, endDate: new Date().toISOString() }
              : s
          )
        )
      }
    }

    setMessages([])
    setInput("")
    setCurrentSessionId(undefined)
  }

  // Handle session selection
  const handleSessionSelect = (session: ChatSession) => {
    // Save current session before switching
    if (messages.length > 0 && currentSessionId) {
      setSessions(prev =>
        prev.map(s =>
          s.id === currentSessionId
            ? { ...s, history: messages, endDate: new Date().toISOString() }
            : s
        )
      )
    }

    setMessages(session.history)
    setCurrentSessionId(session.id)
  }

  // Create new session when first message is sent
  const createNewSession = (firstMessage: Message) => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      name: firstMessage.content.slice(0, 50) + (firstMessage.content.length > 50 ? "..." : ""),
      history: [firstMessage],
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    }
    setSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
  }

  // Check if this is the initial state (no messages)
  const isInitialState = messages.length === 0

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={startNewChat}
        />
        <SidebarInset className="flex flex-col">
          {/* Fixed header */}
          <div className="flex-none">
            <ChatHeader />
          </div>

          {/* Conditional layout based on whether there are messages */}
          {isInitialState ? (
            // Initial state - input in the middle
            <>
              {/* Empty space above */}
              <div className="flex-grow" />

              {/* Centered welcome message */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Welcome to GenAI Chat</h2>
                <p className="text-gray-600 mt-2">Ask me anything to get started</p>
              </div>

              {/* Centered input */}
              <div className="px-4 mb-16 max-w-4xl mx-auto w-full">
                <ChatInput
                  input={input}
                  setInput={setInput}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>

              {/* Empty space below */}
              <div className="flex-grow" />
            </>
          ) : (
            // Chat in progress - normal layout
            <>
              {/* Scrollable message area */}
              <div className="flex-grow overflow-hidden">
                <div className="max-w-4xl mx-auto w-full h-full">
                  <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
                </div>
              </div>

              {/* Fixed input area at bottom */}
              <div className="flex-none">
                <div className="max-w-4xl mx-auto w-full">
                  <ChatInput
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
