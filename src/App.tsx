import { useEffect, useMemo, useState } from 'react'
import { fetchProjects } from './api'
import type { Project } from './types'

type SortOption = 'name' | 'date'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('name')

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      const dateA = a.metadata?.lastUpdated ? new Date(a.metadata.lastUpdated).getTime() : 0
      const dateB = b.metadata?.lastUpdated ? new Date(b.metadata.lastUpdated).getTime() : 0
      return dateB - dateA // Most recent first
    })
  }, [projects, sortBy])

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Corporate Services Test Coverage</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="name">Name</option>
              <option value="date">Last Updated</option>
            </select>
          </div>
        </div>

        {sortedProjects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {sortedProjects.map((project, index) => (
              <div
                key={project.name}
                className={`flex items-center justify-between px-4 py-3 ${
                  index !== sortedProjects.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {project.metadata?.sourceRepo ? (
                  <a
                    href={`https://github.com/${project.metadata.sourceRepo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {project.name}
                  </a>
                ) : (
                  <span className="font-medium text-gray-900">{project.name}</span>
                )}
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
