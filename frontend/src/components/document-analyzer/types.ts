export type DocumentFile = {
  id: string
  file: File
  status: "pending" | "processing" | "completed" | "error"
  progress: number
  results?: {
    summary: string
    keyPoints: string[]
    sentiment: string
    wordCount: number
  }
}