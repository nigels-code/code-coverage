import type { Project } from '../types'
import { CoverageBar, getCoverageTextColor } from './CoverageBar'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { coverage, metadata } = project

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h2>

      <div className={`text-3xl font-bold mb-2 ${getCoverageTextColor(coverage.percentage)}`}>
        {coverage.percentage.toFixed(1)}%
      </div>

      <CoverageBar percentage={coverage.percentage} />

      <p className="text-sm text-gray-500 mt-3">
        {coverage.totalHit} / {coverage.totalLines} lines covered
      </p>

      {metadata && (
        <p className="text-xs text-gray-400 mt-1">
          Updated: {new Date(metadata.lastUpdated).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
