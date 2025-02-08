import { ModCard } from "@/components/mod-card"
import { Layout } from "@/components/layout"

async function getMods() {
  const res = await fetch("https://raw.githubusercontent.com/CubeWhyMC/weave-index/refs/heads/master/index-by-developers.json")
  const data = await res.json()

  // fucking transform shit
  const transformedMods = Object.entries(data.developers).flatMap(([_, developer]: [string, any]) =>
    developer.projects.map((project: any) => ({
      id: project.repository.replace("/", ":"),
      title: project.name,
      author: developer.name,
      description: project.description || `A mod by ${developer.name}`,
      downloads: 0,
      rating: 0,
      category: project.newWeave ? "New Weave" : "Classic",
      imageUrl: "/placeholder.svg?height=300&width=400",
      url: project.url
    }))
  )

  return transformedMods
}

export default async function Home() {
  const mods = await getMods()

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-foreground">Featured Mods</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mods.map((mod) => (
            <ModCard key={mod.id} {...mod} />
          ))}
        </div>
        {/* <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Load More Mods
          </Button>
        </div> */}
      </main>
    </Layout>
  )
}

