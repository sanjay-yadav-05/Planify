"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wand2, FileText, Award, BarChart } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AIToolsProps {
  clubId: string
}

export default function AITools({ clubId }: AIToolsProps) {
  const [contentPrompt, setContentPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [contentLoading, setContentLoading] = useState(false)

  const [eventName, setEventName] = useState("")
  const [certificatePrompt, setCertificatePrompt] = useState("")
  const [certificatePreview, setCertificatePreview] = useState("")
  const [certificateLoading, setCertificateLoading] = useState(false)

  const [sentimentData, setSentimentData] = useState<any>(null)
  const [sentimentLoading, setSentimentLoading] = useState(false)

  const handleGenerateContent = async () => {
    if (!contentPrompt.trim()) return

    setContentLoading(true)
    setGeneratedContent("")

    try {
      // Mock AI content generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Sample generated content
      const sampleContent = `# ${contentPrompt.split(" ").slice(0, 3).join(" ")}

## Introduction
We're excited to announce our upcoming event that will focus on ${contentPrompt}. This will be a great opportunity for all members to learn and collaborate.

## Details
- Date: [Insert Date]
- Time: [Insert Time]
- Location: [Insert Location]

## What to Expect
Participants will engage in hands-on activities, listen to expert speakers, and network with peers who share similar interests.

## How to Register
Please register through our community platform to secure your spot. Limited seats available!

Looking forward to seeing you there!`

      setGeneratedContent(sampleContent)

      toast({
        title: "Content generated",
        description: "Your content has been generated successfully",
      })
    } catch (error) {
      console.error("Failed to generate content:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setContentLoading(false)
    }
  }

  const handleGenerateCertificate = async () => {
    if (!eventName.trim() || !certificatePrompt.trim()) return

    setCertificateLoading(true)
    setCertificatePreview("")

    try {
      // Mock certificate generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would be an actual certificate preview
      setCertificatePreview("/placeholder.svg?height=300&width=500")

      toast({
        title: "Certificate template generated",
        description: "Your certificate template has been generated successfully",
      })
    } catch (error) {
      console.error("Failed to generate certificate:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating the certificate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCertificateLoading(false)
    }
  }

  const handleAnalyzeSentiment = async () => {
    setSentimentLoading(true)
    setSentimentData(null)

    try {
      // Mock sentiment analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Sample sentiment data
      const sampleData = {
        overall: {
          positive: 75,
          neutral: 15,
          negative: 10,
        },
        topics: [
          { name: "Content", sentiment: 85 },
          { name: "Organization", sentiment: 70 },
          { name: "Speakers", sentiment: 90 },
          { name: "Venue", sentiment: 65 },
        ],
        recommendations: [
          "Consider improving venue facilities based on feedback",
          "The content was well-received, maintain similar quality for future events",
          "Speakers were highly appreciated, consider inviting them again",
        ],
      }

      setSentimentData(sampleData)

      toast({
        title: "Analysis complete",
        description: "Sentiment analysis has been completed successfully",
      })
    } catch (error) {
      console.error("Failed to analyze sentiment:", error)
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the sentiment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSentimentLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Tools</CardTitle>
          <CardDescription>Leverage AI to enhance your club activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="content" className="gap-2">
                <FileText className="h-4 w-4" />
                Content Generator
              </TabsTrigger>
              <TabsTrigger value="certificates" className="gap-2">
                <Award className="h-4 w-4" />
                Certificate Generator
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="gap-2">
                <BarChart className="h-4 w-4" />
                Sentiment Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contentPrompt">Content Prompt</Label>
                <Textarea
                  id="contentPrompt"
                  placeholder="Describe the content you want to generate (e.g., 'A social media post for our upcoming web development workshop')"
                  value={contentPrompt}
                  onChange={(e) => setContentPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleGenerateContent}
                disabled={contentLoading || !contentPrompt.trim()}
                className="gap-2"
              >
                <Wand2 className="h-4 w-4" />
                {contentLoading ? "Generating..." : "Generate Content"}
              </Button>

              {generatedContent && (
                <div className="mt-4 space-y-2">
                  <Label>Generated Content</Label>
                  <div className="p-4 border rounded-md bg-muted whitespace-pre-wrap font-mono text-sm">
                    {generatedContent}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent)
                      toast({
                        title: "Copied to clipboard",
                        description: "The generated content has been copied to your clipboard",
                      })
                    }}
                    className="mt-2"
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="certificates" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    placeholder="Enter the event name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificatePrompt">Certificate Style</Label>
                  <Textarea
                    id="certificatePrompt"
                    placeholder="Describe the certificate style (e.g., 'Professional certificate with blue theme and the club logo')"
                    value={certificatePrompt}
                    onChange={(e) => setCertificatePrompt(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleGenerateCertificate}
                  disabled={certificateLoading || !eventName.trim() || !certificatePrompt.trim()}
                  className="gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  {certificateLoading ? "Generating..." : "Generate Certificate Template"}
                </Button>

                {certificatePreview && (
                  <div className="mt-4 space-y-2">
                    <Label>Certificate Preview</Label>
                    <div className="border rounded-md overflow-hidden">
                      <img
                        src={certificatePreview || "/placeholder.svg"}
                        alt="Certificate Preview"
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline">Download Template</Button>
                      <Button>Generate for All Participants</Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-muted">
                  <p className="text-sm">
                    This tool analyzes feedback from event participants to provide insights on sentiment and areas for
                    improvement.
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <Label>Select Event for Analysis</Label>
                  <select className="p-2 border rounded-md">
                    <option value="event1">Web Development Workshop (Oct 25, 2023)</option>
                    <option value="event2">JavaScript Fundamentals (Sep 15, 2023)</option>
                  </select>
                </div>

                <Button onClick={handleAnalyzeSentiment} disabled={sentimentLoading} className="gap-2">
                  <BarChart className="h-4 w-4" />
                  {sentimentLoading ? "Analyzing..." : "Analyze Feedback"}
                </Button>

                {sentimentData && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Overall Sentiment</Label>
                      <div className="flex h-4 rounded-full overflow-hidden">
                        <div className="bg-green-500" style={{ width: `${sentimentData.overall.positive}%` }}></div>
                        <div className="bg-gray-400" style={{ width: `${sentimentData.overall.neutral}%` }}></div>
                        <div className="bg-red-500" style={{ width: `${sentimentData.overall.negative}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Positive: {sentimentData.overall.positive}%</span>
                        <span>Neutral: {sentimentData.overall.neutral}%</span>
                        <span>Negative: {sentimentData.overall.negative}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Topic Sentiment</Label>
                      <div className="space-y-2">
                        {sentimentData.topics.map((topic: any, index: number) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{topic.name}</span>
                              <span>{topic.sentiment}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-primary rounded-full"
                                style={{ width: `${topic.sentiment}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Recommendations</Label>
                      <ul className="list-disc pl-5 space-y-1">
                        {sentimentData.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="outline">Download Full Report</Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

