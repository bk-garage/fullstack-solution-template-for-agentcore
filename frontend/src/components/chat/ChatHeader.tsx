import { SidebarTrigger } from "@/components/ui/sidebar"

export function ChatHeader() {
  return (
    <header className="flex items-center p-4 border-b w-full">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-xl font-bold">GenAI Chat</h1>
      </div>
    </header>
  )
}