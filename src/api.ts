import { CONFIG } from './config'
import { parseLcov } from './lcov'
import type { Project, ProjectMetadata } from './types'

interface GitHubContent {
  name: string
  type: 'file' | 'dir'
}

export async function fetchProjects(): Promise<Project[]> {
  const { owner, repo, branch, projectsPath } = CONFIG

  const contentsUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${projectsPath}?ref=${branch}`
  const contentsRes = await fetch(contentsUrl)

  if (!contentsRes.ok) {
    throw new Error(`Failed to fetch projects: ${contentsRes.status}`)
  }

  const contents: GitHubContent[] = await contentsRes.json()
  const projectDirs = contents.filter((item) => item.type === 'dir')

  const projects = await Promise.all(
    projectDirs.map(async (dir): Promise<Project | null> => {
      try {
        const lcovUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${projectsPath}/${dir.name}/lcov.info`
        const lcovRes = await fetch(lcovUrl)

        if (!lcovRes.ok) return null

        const lcovContent = await lcovRes.text()
        const coverage = parseLcov(lcovContent)

        let metadata: ProjectMetadata | null = null
        try {
          const metaUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${projectsPath}/${dir.name}/metadata.json`
          const metaRes = await fetch(metaUrl, { cache: 'no-store' })
          if (metaRes.ok) {
            const text = await metaRes.text()
            metadata = JSON.parse(text)
          }
        } catch (e) {
          console.error('Metadata fetch error:', e)
        }

        return {
          name: dir.name,
          coverage,
          metadata,
        }
      } catch (e) {
        console.error(`Error loading ${dir.name}:`, e)
        return null
      }
    })
  )

  return projects.filter((p): p is Project => p !== null)
}
