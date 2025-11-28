import { parseLcov } from './lcov'
import type { Project, ProjectMetadata } from './types'

const S3_BUCKET_URL = 'https://coverage-demo-np1086.s3.amazonaws.com'

export async function fetchProjects(): Promise<Project[]> {
  // Fetch the project index file from S3
  const indexRes = await fetch(`${S3_BUCKET_URL}/projects/index.json`, { cache: 'no-store' })

  if (!indexRes.ok) {
    throw new Error(`Failed to fetch project index: ${indexRes.status}`)
  }

  const projectNames: string[] = await indexRes.json()

  const projects = await Promise.all(
    projectNames.map(async (name): Promise<Project | null> => {
      try {
        const lcovRes = await fetch(`${S3_BUCKET_URL}/projects/${name}/lcov.info`, { cache: 'no-store' })

        if (!lcovRes.ok) return null

        const lcovContent = await lcovRes.text()
        const coverage = parseLcov(lcovContent)

        let metadata: ProjectMetadata | null = null
        try {
          const metaRes = await fetch(`${S3_BUCKET_URL}/projects/${name}/metadata.json`, { cache: 'no-store' })
          if (metaRes.ok) {
            metadata = await metaRes.json()
          }
        } catch (e) {
          console.error('Metadata fetch error:', e)
        }

        return {
          name,
          coverage,
          metadata,
        }

      } catch (e) {
        console.error(`Error loading ${name}:`, e)
        return null
      }
    })
  )

  return projects.filter((p): p is Project => p !== null)
}
