"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function EndpointTester() {
  const [url, setUrl] = useState("https://otakudesu.cloud/anime-list/")
  const [method, setMethod] = useState("GET")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<number | null>(null)
  const [headers, setHeaders] = useState<Record<string, string>>({})

  const handleTest = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)
    setStatus(null)
    setHeaders({})

    try {
      // Use a proxy to avoid CORS issues
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}&method=${method}`

      const res = await fetch(proxyUrl)
      const contentType = res.headers.get("content-type") || ""
      setStatus(res.status)

      // Extract headers
      const headerObj: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        headerObj[key] = value
      })
      setHeaders(headerObj)

      if (contentType.includes("application/json")) {
        const data = await res.json()
        setResponse(data)
      } else {
        const text = await res.text()
        setResponse(text)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menguji endpoint")
    } finally {
      setLoading(false)
    }
  }

  const presetEndpoints = [
    { name: "Anime List", url: "https://otakudesu.cloud/anime-list/" },
    { name: "Ongoing Anime", url: "https://otakudesu.cloud/ongoing/" },
    { name: "Completed Anime", url: "https://otakudesu.cloud/complete/" },
    { name: "Anime Detail", url: "https://otakudesu.cloud/anime/shiunji-kodomotachi-sub-indo/" },
    { name: "Episode", url: "https://otakudesu.cloud/episode/shiunji-kodomotachi-episode-1-sub-indo/" },
    { name: "Genre List", url: "https://otakudesu.cloud/genres/" },
    { name: "Genre Detail", url: "https://otakudesu.cloud/genres/action/" },
    { name: "Search", url: "https://otakudesu.cloud/?s=spy" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="preset" className="text-sm font-medium">
          Preset Endpoint
        </label>
        <Select onValueChange={(value) => setUrl(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih endpoint" />
          </SelectTrigger>
          <SelectContent>
            {presetEndpoints.map((endpoint) => (
              <SelectItem key={endpoint.url} value={endpoint.url}>
                {endpoint.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="url" className="text-sm font-medium">
          URL
        </label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://otakudesu.cloud/..."
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="method" className="text-sm font-medium">
          Method
        </label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue placeholder="GET" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleTest} disabled={loading}>
        {loading ? "Menguji..." : "Uji Endpoint"}
      </Button>

      {status && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">Status:</span>
            {status >= 200 && status < 300 ? (
              <span className="flex items-center text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-1" /> {status}
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" /> {status}
              </span>
            )}
          </div>

          <Tabs defaultValue="response">
            <TabsList>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>
            <TabsContent value="response">
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <div className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                  {typeof response === "object" ? (
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                  ) : (
                    <div className="whitespace-pre-wrap break-words">
                      {response ? response.substring(0, 5000) + (response.length > 5000 ? "..." : "") : "No response"}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="headers">
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                <pre>{JSON.stringify(headers, null, 2)}</pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
