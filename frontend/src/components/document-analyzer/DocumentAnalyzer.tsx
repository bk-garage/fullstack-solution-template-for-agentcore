"use client"

import { useState } from "react"
import { DocumentFile } from "./types"
import FileUploadZone from "./FileUploadZone"
import ProcessingQueue from "./ProcessingQueue"
import ResultsDisplay from "./ResultsDisplay"

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default function DocumentAnalyzer() {
  const [documents, setDocuments] = useState<DocumentFile[]>([])

  const handleFilesAdded = (files: File[]) => {
    const newDocs: DocumentFile[] = files.map(file => ({
      id: `${Date.now()}-${file.name}`,
      file,
      status: "pending",
      progress: 0,
    }))
    setDocuments(prev => [...prev, ...newDocs])
  }

  const processDocument = async (docId: string) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === docId ? { ...doc, status: "processing", progress: 0 } : doc))
    )

    // Simulate processing with progress updates
    for (let i = 0; i <= 100; i += 10) {
      await sleep(200)
      setDocuments(prev => prev.map(doc => (doc.id === docId ? { ...doc, progress: i } : doc)))
    }

    // Mock results
    const mockResults = {
      summary:
        "This document discusses key business strategies and market analysis with focus on growth opportunities.",
      keyPoints: [
        "Market expansion opportunities identified",
        "Revenue growth projected at 15% annually",
        "Customer satisfaction metrics improved",
        "Operational efficiency recommendations provided",
      ],
      sentiment: "Positive",
      wordCount: Math.floor(Math.random() * 5000) + 1000,
    }

    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              status: "completed",
              progress: 100,
              results: mockResults,
            }
          : doc
      )
    )
  }

  const processAllPending = () => {
    documents.filter(doc => doc.status === "pending").forEach(doc => processDocument(doc.id))
  }

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId))
  }

  const exportResults = () => {
    const completedDocs = documents.filter(doc => doc.status === "completed")
    const results = completedDocs.map(doc => ({
      filename: doc.file.name,
      ...doc.results,
    }))

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document-analysis-results.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const completedCount = documents.filter(doc => doc.status === "completed").length
  const pendingCount = documents.filter(doc => doc.status === "pending").length

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Analyzer</h1>
        <p className="text-gray-600">Upload documents for AI-powered analysis and insights</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <FileUploadZone
            onFilesAdded={handleFilesAdded}
            onProcessAll={processAllPending}
            onExportResults={exportResults}
            pendingCount={pendingCount}
            completedCount={completedCount}
          />

          <ProcessingQueue
            documents={documents}
            onProcessDocument={processDocument}
            onRemoveDocument={removeDocument}
          />
        </div>

        <div className="lg:col-span-2">
          <ResultsDisplay documents={documents} />
        </div>
      </div>
    </div>
  )
}
