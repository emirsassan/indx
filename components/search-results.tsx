"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SearchResultsProps {
  onClose: () => void
  term: string
}

// thanks claude very cool 👏
export function SearchResults({ onClose, term }: SearchResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchResults() {
      if (!term) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`https://raw.githubusercontent.com/CubeWhyMC/weave-index/refs/heads/master/index-by-developers.json`)
        const data = await res.json()
        
        const transformedResults = Object.entries(data.developers).flatMap(([_, developer]: [string, any]) =>
          developer.projects.map((project: any) => ({
            ...project,
            author: developer.name,
            id: project.repository
          }))
        ).filter(project => 
          project.name.toLowerCase().includes(term.toLowerCase())
        )

        setResults(transformedResults)
      } catch (error) {
        console.error('Error fetching search results:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchResults()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [term])

  if (!term) return null

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 max-h-96 overflow-auto z-50">
      <CardContent className="p-2">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        ) : results.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No results found</div>
        ) : (
          results.map((project) => (
            <a 
              key={project.id} 
              href={"/mod/" + project.repository.replace("/", ":")}
              className="block p-2 hover:bg-accent rounded-md" 
              onClick={onClose}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">by {project.author}</p>
                </div>
                <Badge variant="secondary">
                  {project.newWeave ? 'New Weave' : 'Legacy'}
                </Badge>
              </div>
            </a>
          ))
        )}
      </CardContent>
    </Card>
  )
}

