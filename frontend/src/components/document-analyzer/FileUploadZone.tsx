"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload } from "lucide-react"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

type FileUploadZoneProps = {
  onFilesAdded: (files: File[]) => void
  onProcessAll: () => void
  onExportResults: () => void
  pendingCount: number
  completedCount: number
}

export default function FileUploadZone({
  onFilesAdded,
  onProcessAll,
  onExportResults,
  pendingCount,
  completedCount,
}: FileUploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles)
    },
    [onFilesAdded]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: true,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>Drag & drop or click to select files</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-blue-600">Drop files here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">Drop files here or click to browse</p>
              <p className="text-sm text-gray-500">Supports: PDF, DOC, DOCX, TXT</p>
            </div>
          )}
        </div>

        {pendingCount > 0 && (
          <Button onClick={onProcessAll} className="w-full mt-4">
            Process All ({pendingCount})
          </Button>
        )}

        {completedCount > 0 && (
          <Button onClick={onExportResults} variant="outline" className="w-full mt-2">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
