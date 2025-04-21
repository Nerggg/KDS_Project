import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface AnimalResultCardProps {
  name: string
  matchScore: number
  imageUrl: string
}

export default function AnimalResultCard({ name, matchScore, imageUrl }: AnimalResultCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 w-full bg-slate-100">
        <Image src={imageUrl || "/placeholder.svg"} alt={`Gambar ${name}`} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-slate-800">{name}</h3>
        <div className="mt-2 flex items-center">
          <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${matchScore}%` }} />
          </div>
          <span className="ml-2 text-sm font-medium text-slate-600">{matchScore.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  )
}
