"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dna } from "lucide-react"
import AnimalResultCard from "@/components/animal-result-card"

interface AnimalResult {
  id: number
  name: string
  matchScore: number
  imageUrl: string
}

export default function DNAMatcher() {
  const [dnaSequence, setDnaSequence] = useState("")
  const [results, setResults] = useState<AnimalResult[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!dnaSequence.trim()) return

    setIsSearching(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock results - in a real app, this would come from your API
      const mockResults: AnimalResult[] = [
        { id: 1, name: "Harimau Sumatera", matchScore: 98.7, imageUrl: "/placeholder.svg?height=200&width=200" },
        { id: 2, name: "Orangutan", matchScore: 92.3, imageUrl: "/placeholder.svg?height=200&width=200" },
        { id: 3, name: "Komodo", matchScore: 87.5, imageUrl: "/placeholder.svg?height=200&width=200" },
        { id: 4, name: "Badak Jawa", matchScore: 82.1, imageUrl: "/placeholder.svg?height=200&width=200" },
        { id: 5, name: "Gajah Sumatera", matchScore: 79.8, imageUrl: "/placeholder.svg?height=200&width=200" },
        { id: 6, name: "Burung Cendrawasih", matchScore: 75.4, imageUrl: "/placeholder.svg?height=200&width=200" },
      ]

      setResults(mockResults)
      setIsSearching(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Dna className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">DNA Animal Matcher</h1>
          </div>
          <p className="text-slate-600">Animal identification based on DNA sequences</p>
        </div>

        {/* DNA Input Form */}
        <Card className="shadow-lg border-slate-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <label htmlFor="dna-input" className="block text-lg font-medium text-slate-700">
                Enter DNA Sequence:
              </label>
              <textarea
                id="dna-input"
                // Tambahkan text-slate-900 dan placeholder:text-slate-400 di sini
                className="w-full h-40 p-4 border border-slate-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                placeholder="Example: ATGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCT..."
                value={dnaSequence}
                onChange={(e) => setDnaSequence(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !dnaSequence.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSearching ? "Searching..." : "Search Animal"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Area */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Search Results</h2>

          {!results && !isSearching && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
              <div className="flex justify-center mb-4">
                <Dna className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-slate-500">Enter the DNA sequence and click the "Search Animal" button to see the results.</p>
            </div>
          )}

          {isSearching && (
            <div className="text-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <Dna className="h-12 w-12 text-emerald-500 animate-spin" />
                <p className="mt-4 text-slate-600">Menganalisis sekuens DNA...</p>
              </div>
            </div>
          )}

          {results && !isSearching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((animal) => (
                <AnimalResultCard
                  key={animal.id}
                  name={animal.name}
                  matchScore={animal.matchScore}
                  imageUrl={animal.imageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
