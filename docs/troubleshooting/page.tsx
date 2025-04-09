import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

export default function Troubleshooting() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Troubleshooting API OtakuDesu</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Masalah Umum dengan Endpoint Episode</h2>

          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error 404 pada Endpoint Episode</AlertTitle>
            <AlertDescription>
              Banyak pengguna melaporkan error 404 saat mengakses endpoint episode. Ini biasanya disebabkan oleh
              perubahan struktur URL pada website OtakuDesu.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Penyebab Umum</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Perubahan Format URL:</strong> OtakuDesu terkadang mengubah format URL untuk episode anime.
                </li>
                <li>
                  <strong>Variasi Format URL:</strong> Ada beberapa variasi format URL yang digunakan untuk episode.
                </li>
                <li>
                  <strong>Redirect:</strong> Website mungkin melakukan redirect yang tidak diikuti oleh scraper.
                </li>
                <li>
                  <strong>Anti-Scraping:</strong> Website mungkin menerapkan mekanisme anti-scraping.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Format URL Episode yang Diketahui</h3>
              <div className="bg-muted p-4 rounded-md space-y-2">
                <p>
                  <code>/episode/[anime-id]-episode-[number]-sub-indo/</code> (Format Umum)
                </p>
                <p>
                  <code>/nonton/[anime-id]-episode-[number]-sub-indo/</code> (Format Alternatif)
                </p>
                <p>
                  <code>/episode/[anime-id]-eps-[number]-sub-indo/</code> (Variasi dengan "eps")
                </p>
                <p>
                  <code>/watch/[anime-id]-episode-[number]-sub-indo/</code> (Format dengan "watch")
                </p>
                <p>
                  <code>/anime/[anime-id]/episode/[number]/</code> (Format Terstruktur)
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Solusi</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Periksa Format URL Terbaru:</strong> Buka website OtakuDesu dan periksa format URL episode
                  terbaru.
                </li>
                <li>
                  <strong>Gunakan Episode Debugger:</strong> Gunakan alat Episode Debugger di halaman beranda untuk
                  menguji berbagai format URL.
                </li>
                <li>
                  <strong>Tambahkan User-Agent:</strong> Pastikan untuk menyertakan header User-Agent yang valid dalam
                  permintaan Anda.
                </li>
                <li>
                  <strong>Ikuti Redirect:</strong> Pastikan scraper Anda mengikuti redirect (set{" "}
                  <code>redirect: 'follow'</code> dalam fetch).
                </li>
                <li>
                  <strong>Coba Beberapa Format:</strong> Implementasikan fallback untuk mencoba beberapa format URL jika
                  satu format gagal.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Contoh Implementasi Fallback</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                {`async function getEpisode(animeId, episodeNumber) {
  // Array of URL patterns to try
  const patterns = [
    \`https://otakudesu.cloud/episode/\${animeId}-episode-\${episodeNumber}-sub-indo/\`,
    \`https://otakudesu.cloud/nonton/\${animeId}-episode-\${episodeNumber}-sub-indo/\`,
    \`https://otakudesu.cloud/episode/\${animeId}-eps-\${episodeNumber}-sub-indo/\`,
    \`https://otakudesu.cloud/watch/\${animeId}-episode-\${episodeNumber}-sub-indo/\`,
    \`https://otakudesu.cloud/anime/\${animeId}/episode/\${episodeNumber}/\`
  ];

  // Try each pattern until one works
  for (const url of patterns) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://otakudesu.cloud/'
        },
        redirect: 'follow'
      });
      
      if (response.ok) {
        const html = await response.text();
        // Process the HTML here
        return { success: true, html, url };
      }
    } catch (error) {
      console.error(\`Error with URL \${url}:\`, error);
      // Continue to the next pattern
    }
  }
  
  // If all patterns fail
  return { success: false, error: 'All URL patterns failed' };
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Tips Tambahan</h2>

          <div className="flex items-start gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Pantau Perubahan Website</h3>
              <p className="text-sm mt-1">
                Website seperti OtakuDesu sering mengubah struktur mereka. Pantau perubahan secara berkala dan perbarui
                scraper Anda.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Gunakan Delay antara Request</h3>
              <p className="text-sm mt-1">Untuk menghindari rate limiting, tambahkan delay antara request berurutan.</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Pertimbangkan Penggunaan Puppeteer/Playwright</h3>
              <p className="text-sm mt-1">
                Jika website menggunakan banyak JavaScript untuk memuat konten, pertimbangkan untuk menggunakan
                Puppeteer atau Playwright untuk scraping.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/docs/errors">Kembali ke Error</Link>
        </Button>
        <Button asChild>
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  )
}
