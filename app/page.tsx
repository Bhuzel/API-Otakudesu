"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import EndpointTester from "@/components/endpoint-tester"
import EpisodeDebugger from "@/components/episode-debugger"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">OtakuDesu API Debugger</h1>

      <Tabs defaultValue="tester">
        <TabsList className="mb-4">
          <TabsTrigger value="tester">Endpoint Tester</TabsTrigger>
          <TabsTrigger value="episode-debugger">Episode Debugger</TabsTrigger>
          <TabsTrigger value="common-issues">Masalah Umum</TabsTrigger>
        </TabsList>

        <TabsContent value="tester">
          <Card>
            <CardHeader>
              <CardTitle>Test Endpoint API</CardTitle>
              <CardDescription>Uji endpoint API untuk melihat respons dan status</CardDescription>
            </CardHeader>
            <CardContent>
              <EndpointTester />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="episode-debugger">
          <Card>
            <CardHeader>
              <CardTitle>Episode Debugger</CardTitle>
              <CardDescription>Alat khusus untuk mendiagnosis masalah dengan endpoint episode</CardDescription>
            </CardHeader>
            <CardContent>
              <EpisodeDebugger />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="common-issues">
          <Card>
            <CardHeader>
              <CardTitle>Masalah Umum dan Solusi</CardTitle>
              <CardDescription>Panduan untuk mengatasi masalah umum saat scraping OtakuDesu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error 404 pada Endpoint Episode</AlertTitle>
                <AlertDescription>
                  Kemungkinan penyebab:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Format URL episode telah berubah</li>
                    <li>Struktur path episode berbeda dari yang diharapkan</li>
                    <li>Website melakukan redirect yang tidak diikuti</li>
                    <li>Rate limiting atau proteksi anti-scraping</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Solusi yang Disarankan:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Periksa struktur URL episode terbaru di website</li>
                  <li>Gunakan browser untuk memeriksa request yang berhasil dan bandingkan dengan API Anda</li>
                  <li>Tambahkan header User-Agent yang valid</li>
                  <li>Periksa apakah website menggunakan JavaScript untuk memuat konten</li>
                  <li>Implementasikan delay antara request untuk menghindari rate limiting</li>
                </ol>
              </div>

              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="font-medium mb-2">Pola URL yang Umum:</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Anime List:</strong> <code>/anime-list/</code>
                  </p>
                  <p>
                    <strong>Detail Anime:</strong> <code>/anime/[slug]-sub-indo/</code>
                  </p>
                  <p>
                    <strong>Episode:</strong> <code>/episode/[anime-name]-episode-[number]-sub-indo/</code>
                  </p>
                  <p>
                    <strong>Batch:</strong> <code>/batch/[anime-name]-sub-indo/</code>
                  </p>
                  <p>
                    <strong>Genre:</strong> <code>/genres/[genre-name]/</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
