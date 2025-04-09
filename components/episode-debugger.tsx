"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EpisodeDebugger() {
  const [animeId, setAnimeId] = useState("shiunji-kodomotachi")
  const [episodeNumber, setEpisodeNumber] = useState("1")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [currentTest, setCurrentTest] = useState("")

  const runTests = async () => {
    setLoading(true)
    setResults([])

    // Test different URL patterns for episodes
    const patterns = [
      {
        name: "Pattern 1 (Standard)",
        url: `https://otakudesu.cloud/episode/${animeId}-episode-${episodeNumber}-sub-indo/`,
      },
      {
        name: "Pattern 2 (Alternative)",
        url: `https://otakudesu.cloud/nonton/${animeId}-episode-${episodeNumber}-sub-indo/`,
      },
      {
        name: "Pattern 3 (With Hyphen)",
        url: `https://otakudesu.cloud/episode/${animeId}-eps-${episodeNumber}-sub-indo/`,
      },
      {
        name: "Pattern 4 (Without Sub-Indo)",
        url: `https://otakudesu.cloud/episode/${animeId}-episode-${episodeNumber}/`,
      },
      {
        name: "Pattern 5 (With Anime Prefix)",
        url: `https://otakudesu.cloud/anime/${animeId}/episode/${episodeNumber}/`,
      },
      {
        name: "Pattern 6 (With Watch Prefix)",
        url: `https://otakudesu.cloud/watch/${animeId}-episode-${episodeNumber}-sub-indo/`,
      },
    ]

    for (const pattern of patterns) {
      setCurrentTest(pattern.name)
      try {
        // Use a proxy to avoid CORS issues
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(pattern.url)}&method=GET`
        const res = await fetch(proxyUrl)
        const status = res.status

        setResults((prev) => [
          ...prev,
          {
            name: pattern.name,
            url: pattern.url,
            status,
            success: status >= 200 && status < 300,
          },
        ])
      } catch (err) {
        setResults((prev) => [
          ...prev,
          {
            name: pattern.name,
            url: pattern.url,
            status: 0,
            success: false,
            error: err instanceof Error ? err.message : "Terjadi kesalahan",
          },
        ])
      }
    }

    setCurrentTest("")
    setLoading(false)
  }

  const extractPatternFromUrl = (url: string) => {
    // Extract the pattern from a successful URL to help understand the structure
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname

      // Replace the anime ID and episode number with placeholders
      const pattern = path.replace(animeId, "[anime-id]").replace(episodeNumber, "[episode-number]")

      return pattern
    } catch {
      return url
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="animeId" className="text-sm font-medium">
            ID Anime
          </label>
          <Input
            id="animeId"
            value={animeId}
            onChange={(e) => setAnimeId(e.target.value)}
            placeholder="contoh: shiunji-kodomotachi"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="episodeNumber" className="text-sm font-medium">
            Nomor Episode
          </label>
          <Input
            id="episodeNumber"
            value={episodeNumber}
            onChange={(e) => setEpisodeNumber(e.target.value)}
            placeholder="contoh: 1"
          />
        </div>
      </div>

      <Button onClick={runTests} disabled={loading}>
        {loading ? `Menguji... (${currentTest})` : "Uji Semua Pola URL"}
      </Button>

      {results.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium">Hasil Pengujian</h3>

          {results.some((r) => r.success) && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Pola URL yang Berhasil Ditemukan!</AlertTitle>
              <AlertDescription className="text-green-700">
                {results
                  .filter((r) => r.success)
                  .map((r) => (
                    <div key={r.name} className="mt-2">
                      <p>
                        <strong>{r.name}:</strong> {r.url}
                      </p>
                      <p className="text-sm mt-1">Pattern: {extractPatternFromUrl(r.url)}</p>
                    </div>
                  ))}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Semua Hasil ({results.length})</TabsTrigger>
              <TabsTrigger value="success">Berhasil ({results.filter((r) => r.success).length})</TabsTrigger>
              <TabsTrigger value="failed">Gagal ({results.filter((r) => !r.success).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-2">
                {results.map((result, index) => (
                  <Card key={index} className={result.success ? "border-green-200" : "border-red-200"}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{result.name}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {result.status} {result.success ? "OK" : "Failed"}
                        </span>
                      </div>
                      <p className="text-sm mt-2 break-all">{result.url}</p>
                      {result.error && <p className="text-sm text-red-600 mt-1">{result.error}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="success">
              <div className="space-y-2">
                {results
                  .filter((r) => r.success)
                  .map((result, index) => (
                    <Card key={index} className="border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{result.name}</h4>
                          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                            {result.status} OK
                          </span>
                        </div>
                        <p className="text-sm mt-2 break-all">{result.url}</p>
                        <p className="text-sm mt-1 text-gray-600">Pattern: {extractPatternFromUrl(result.url)}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="failed">
              <div className="space-y-2">
                {results
                  .filter((r) => !r.success)
                  .map((result, index) => (
                    <Card key={index} className="border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{result.name}</h4>
                          <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                            {result.status} Failed
                          </span>
                        </div>
                        <p className="text-sm mt-2 break-all">{result.url}</p>
                        {result.error && <p className="text-sm text-red-600 mt-1">{result.error}</p>}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Tips Debugging Episode</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>Periksa struktur URL episode di website OtakuDesu secara manual</li>
                <li>Pastikan ID anime yang digunakan sudah benar (biasanya dalam format slug)</li>
                <li>Coba beberapa variasi format URL (seperti yang diuji di atas)</li>
                <li>Periksa apakah ada perubahan struktur URL baru-baru ini</li>
                <li>Periksa apakah ada redirect yang terjadi saat mengakses episode</li>
                <li>Periksa apakah ada parameter tambahan yang diperlukan</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
