import { useEffect, useState } from 'react'
import { fetchProjects } from './api'
import type { Project } from './types'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Corporate Services Test Coverage</h1>

        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {projects.map((project, index) => (
              <div
                key={project.name}
                className={`flex items-center justify-between px-4 py-3 ${
                  index !== projects.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="font-medium text-gray-900">{project.name}</span>
                <div className="flex items-center gap-6">
                  <span className="text-gray-700">{project.coverage.percentage.toFixed(1)}%</span>
                  <span className="text-gray-500 text-sm">
                    {project.metadata?.lastUpdated
                      ? formatDate(project.metadata.lastUpdated)
                      : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
