import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Star } from "lucide-react"

interface ModCardProps {
  id: string
  title: string
  author: string
  description: string
  downloads: number
  rating: number
  category: string
  imageUrl: string
}

export function ModCard({ id, title, author, description, downloads, rating, category, imageUrl }: ModCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">by {author}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full" variant="secondary" size="sm" asChild>
          <Link href={`/mod/${id}`}>View Mod</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

