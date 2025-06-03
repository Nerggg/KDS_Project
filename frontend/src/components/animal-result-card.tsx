import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Eye } from "lucide-react"

interface HeaderInfo {
  primary_id: string
  kingdom: string
  phylum: string
  class_: string
  order: string
  family: string
  genus: string
  species: string
  other_info: string
}

interface AnimalResultCardProps {
  header_info: HeaderInfo
  sequence: string
  similarity_score: number
}

export default function AnimalResultCard({ header_info, sequence, similarity_score }: AnimalResultCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(sequence)
      .then(() => alert("DNA sequence copied to clipboard!"))
      .catch(() => alert("Failed to copy sequence"))
  }

  const searchTerm = header_info.species.replace(/\s+/g, '+')
  const wikiUrl = `https://en.wikipedia.org/w/index.php?fulltext=1&search=${searchTerm}`

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-slate-800">{header_info.species}</h3>
              <div className="relative group">
                <Eye className="h-4 w-4 text-slate-600 cursor-pointer" />
                <div className="absolute hidden group-hover:block bg-slate-800 text-white text-xs rounded-md p-3 w-64 z-10 -top-2 left-6 shadow-lg">
                  <p><span className="font-semibold">Kingdom:</span> {header_info.kingdom}</p>
                  <p><span className="font-semibold">Phylum:</span> {header_info.phylum}</p>
                  <p><span className="font-semibold">Class:</span> {header_info.class_}</p>
                  <p><span className="font-semibold">Order:</span> {header_info.order}</p>
                  <p><span className="font-semibold">Family:</span> {header_info.family}</p>
                  <p><span className="font-semibold">Genus:</span> {header_info.genus}</p>
                  <p><span className="font-semibold">Species:</span> {header_info.species}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600">Family: {header_info.family}</p>
            <p className="text-sm text-slate-600">Genus: {header_info.genus}</p>
            <div className="flex items-center">
              <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${similarity_score * 100}%` }}
                />
              </div>
              <span className="ml-2 text-sm font-medium text-slate-600">
                {(similarity_score * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex-1 cursor-pointer"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Sequence
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(wikiUrl, '_blank')}
              className="flex-1 cursor-pointer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Wikipedia
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
