"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, FileText, XCircle } from "lucide-react"
import { DocumentFile } from "./types"

type ProcessingQueueProps = {
  documents: DocumentFile[]
  onProcessDocument: (docId: string) => void
  onRemoveDocument: (docId: string) => void
}

const getStatusIcon = (status: DocumentFile["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "error":
      return <XCircle className="h-5 w-5 text-red-500" />
    case "processing":
      return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
    default:
      return <FileText className="h-5 w-5 text-gray-400" />
  }
}

export default function ProcessingQueue({
  documents,
  onProcessDocument,
  onRemoveDocument,
}: ProcessingQueueProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {documents.length === 0 ? (
          <p className="text-gray-500 text-sm">No documents uploaded</p>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {getStatusIcon(doc.status)}
                <span className="text-sm truncate">{doc.file.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {doc.status === "processing" && (
                  <div className="w-16">
                    <Progress value={doc.progress} className="h-2" />
                  </div>
                )}
                {doc.status === "pending" && (
                  <Button size="sm" onClick={() => onProcessDocument(doc.id)}>
                    Process
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => onRemoveDocument(doc.id)}>
                  ×
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
