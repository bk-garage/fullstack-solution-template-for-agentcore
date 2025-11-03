"use client"

import { MessageSquare, Plus, Home } from "lucide-react"
import Link from "next/link"
import { ChatSession } from "./types"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

type ChatSidebarProps = {
  sessions: ChatSession[]
  currentSessionId?: string
  onSessionSelect: (session: ChatSession) => void
  onNewChat: () => void
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewChat,
}: ChatSidebarProps) {
  const { state } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader className="p-4 space-y-2">
        {state === "expanded" && (
          <Button asChild variant="outline" className="w-full justify-start gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        )}
        <Button onClick={onNewChat} className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sessions.map(session => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton
                    onClick={() => onSessionSelect(session)}
                    isActive={currentSessionId === session.id}
                    className="w-full justify-start gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="truncate">{session.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
