"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { DocumentFile } from "./types"

type ResultsDisplayProps = {
  documents: DocumentFile[]
}

export default function ResultsDisplay({ documents }: ResultsDisplayProps) {
  const completedDocuments = documents.filter(doc => doc.status === "completed")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>AI-generated insights from your documents</CardDescription>
      </CardHeader>
      <CardContent>
        {completedDocuments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>Upload and process documents to see analysis results</p>
          </div>
        ) : (
          <div className="space-y-6">
            {completedDocuments.map(doc => (
              <div key={doc.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {doc.file.name}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Summary</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {doc.results?.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Key Points</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {doc.results?.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t text-sm text-gray-500">
                  <span>
                    Sentiment:{" "}
                    <span className="font-medium text-green-600">{doc.results?.sentiment}</span>
                  </span>
                  <span>
                    Word Count: <span className="font-medium">{doc.results?.wordCount}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
