"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FormData = {
  title: string
  description: string
  category: string
  priority: string
}

type JobResult = {
  id: string
  summary: string
  recommendations: string[]
  confidence: number
}

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default function FormGenerator() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    priority: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<JobResult | null>(null)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setResult(null)

    await sleep(3000)

    const mockResult: JobResult = {
      id: `job_${Date.now()}`,
      summary: `Analyzed "${formData.title}" in ${formData.category} category with ${formData.priority} priority.`,
      recommendations: [
        "Consider implementing automated workflow for similar requests",
        "Review resource allocation for optimal processing",
        "Set up monitoring alerts for this type of task",
      ],
      confidence: Math.floor(Math.random() * 20) + 80,
    }

    setResult(mockResult)
    setIsProcessing(false)
  }

  const resetForm = () => {
    setFormData({ title: "", description: "", category: "", priority: "" })
    setResult(null)
  }

  const isFormValid =
    formData.title && formData.description && formData.category && formData.priority

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GenAI Form Processor</h1>
        <p className="text-gray-600">Submit a form to trigger GenAI analysis and processing</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Form</CardTitle>
            <CardDescription>Fill out the form to start GenAI processing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={e => handleInputChange("title", e.target.value)}
                  placeholder="Enter a title for your request"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={e => handleInputChange("description", e.target.value)}
                  placeholder="Describe what you need help with..."
                  rows={4}
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={value => handleInputChange("category", value)}
                  disabled={isProcessing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analysis">Data Analysis</SelectItem>
                    <SelectItem value="content">Content Generation</SelectItem>
                    <SelectItem value="automation">Process Automation</SelectItem>
                    <SelectItem value="optimization">Optimization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={value => handleInputChange("priority", value)}
                  disabled={isProcessing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={!isFormValid || isProcessing} className="flex-1">
                  {isProcessing ? "Processing..." : "Submit for Analysis"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={isProcessing}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
            <CardDescription>GenAI analysis results will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {isProcessing && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Processing your request with GenAI...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Analysis Complete</h3>
                  <p className="text-green-700 text-sm">Job ID: {result.id}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">{result.summary}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Confidence Score</span>
                    <span className="text-lg font-bold text-blue-900">{result.confidence}%</span>
                  </div>
                </div>
              </div>
            )}

            {!isProcessing && !result && (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <p>Submit the form to see GenAI analysis results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
