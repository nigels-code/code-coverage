import { useEffect, useMemo, useState } from 'react'
import { fetchProjects } from './api'
import type { Project } from './types'

type SortField = 'name' | 'coverage' | 'date'
type SortDirection = 'asc' | 'desc'

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

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  return (
    <span className="ml-1 inline-block w-4">
      {active ? (direction === 'asc' ? '▲' : '▼') : ''}
    </span>
  )
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'coverage':
          comparison = a.coverage.percentage - b.coverage.percentage
          break
        case 'date':
          const dateA = a.metadata?.lastUpdated ? new Date(a.metadata.lastUpdated).getTime() : 0
          const dateB = b.metadata?.lastUpdated ? new Date(b.metadata.lastUpdated).getTime() : 0
          comparison = dateA - dateB
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [projects, sortField, sortDirection])

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

        {sortedProjects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600">
              <button
                onClick={() => handleSort('name')}
                className="hover:text-gray-900 cursor-pointer flex items-center"
              >
                Project
                <SortIcon active={sortField === 'name'} direction={sortDirection} />
              </button>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleSort('coverage')}
                  className="hover:text-gray-900 cursor-pointer flex items-center"
                >
                  Coverage
                  <SortIcon active={sortField === 'coverage'} direction={sortDirection} />
                </button>
                <button
                  onClick={() => handleSort('date')}
                  className="hover:text-gray-900 cursor-pointer flex items-center min-w-[180px] justify-end"
                >
                  Last Updated
                  <SortIcon active={sortField === 'date'} direction={sortDirection} />
                </button>
              </div>
            </div>
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
                  <span className="text-gray-500 text-sm min-w-[180px] text-right">
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
