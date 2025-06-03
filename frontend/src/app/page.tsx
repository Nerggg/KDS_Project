"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dna } from "lucide-react"
import AnimalResultCard from "@/components/animal-result-card"

interface AnimalResult {
  header_info: {
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
  sequence: string
  similarity_score: number
}

export default function DNAMatcher() {
  const [dnaSequence, setDnaSequence] = useState("")
  const [kValue, setKValue] = useState<string>("10")
  const [results, setResults] = useState<AnimalResult[] | null>(null)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!dnaSequence.trim()) {
      setError("DNA sequence cannot be empty")
      return
    }
    const k = Number(kValue)
    if (isNaN(k) || k <= 0) {
      setError("K value must be a positive integer")
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const response = await fetch("http://127.0.0.1:8080/kmer_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query_sequence: dnaSequence,
          k: k,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch results")
      }

      const data = await response.json()
      setResults(data.results)
      setExecutionTime(data.execution_time)
    } catch (err) {
      console.error('Error fetching results:', err)
      if (err instanceof Error) {
        setError(`Error fetching results: ${err.message}`)
      } else {
        setError("Error fetching results. Please try again.")
      }
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e') {
      e.preventDefault()
    }
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
                className="w-full h-40 p-4 border border-slate-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                placeholder="Example: ATGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCT..."
                value={dnaSequence}
                onChange={(e) => setDnaSequence(e.target.value)}
              />
              <label htmlFor="k-input" className="block text-lg font-medium text-slate-700">
                K-mer Size:
              </label>
              <input
                id="k-input"
                type="number"
                min="1"
                step="1"
                className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                placeholder="Enter K value"
                value={kValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/^0+/, "")
                  setKValue(value)
                }}
                onKeyDown={handleKeyDown}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !dnaSequence.trim() || !kValue || Number(kValue) <= 0}
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

          {error && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-red-300">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!results && !isSearching && !error && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
              <div className="flex justify-center mb-4">
                <Dna className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-slate-500">Enter the DNA sequence and K value, then click the "Search Animal" button to see the results.</p>
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

          {results && !isSearching && !error && (
            <div className="space-y-4">
              {executionTime !== null && (
                <div className="text-center text-slate-600">
                  <p>Execution time: {executionTime.toFixed(1)} seconds</p>
                </div>
              )}
              {results.map((animal, index) => (
                <AnimalResultCard
                  key={index}
                  header_info={animal.header_info}
                  sequence={animal.sequence}
                  similarity_score={animal.similarity_score}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}