import { useEffect, useState } from 'react'
import { fetchProjects } from './api'
import { ProjectCard } from './components/ProjectCard'
import { ProjectDetail } from './components/ProjectDetail'
import type { Project } from './types'

export default function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading coverage data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-xl mx-auto bg-red-50 text-red-700 p-6 rounded-xl">
          <h2 className="font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm">
            Make sure the config values in <code>src/config.ts</code> are correct and the repository is public.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
          />
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Coverage Aggregator</h1>
            <p className="text-gray-600 mb-8">Test coverage reports from all projects</p>

            {projects.length === 0 ? (
              <p className="text-gray-500">No projects found. Push some coverage data first!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.name}
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
