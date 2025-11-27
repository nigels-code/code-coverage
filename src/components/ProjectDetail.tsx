import type { Project } from '../types'
import { CoverageBar, getCoverageTextColor } from './CoverageBar'

interface ProjectDetailProps {
  project: Project
  onBack: () => void
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const { coverage, metadata } = project

  const sortedFiles = [...coverage.files].sort((a, b) => {
    const aPct = a.linesTotal > 0 ? (a.linesHit / a.linesTotal) * 100 : 0
    const bPct = b.linesTotal > 0 ? (b.linesHit / b.linesTotal) * 100 : 0
    return aPct - bPct
  })

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        ← Back to Projects
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>

      <div className={`text-4xl font-bold mb-3 ${getCoverageTextColor(coverage.percentage)}`}>
        {coverage.percentage.toFixed(1)}% Coverage
      </div>

      <div className="max-w-md mb-4">
        <CoverageBar percentage={coverage.percentage} />
      </div>

      <p className="text-gray-600 mb-2">
        {coverage.totalHit} / {coverage.totalLines} lines covered across {coverage.files.length} files
      </p>

      {metadata && (
        <div className="text-sm text-gray-500 mb-6">
          <p>Source: {metadata.sourceRepo} @ {metadata.sourceCommit.slice(0, 7)}</p>
          <p>Branch: {metadata.sourceBranch}</p>
          <p>Updated: {new Date(metadata.lastUpdated).toLocaleString()}</p>
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Files</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {sortedFiles.map((file, i) => {
          const pct = file.linesTotal > 0 ? (file.linesHit / file.linesTotal) * 100 : 0

          return (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-b-0"
            >
              <span className="font-mono text-sm text-gray-700 truncate max-w-[50%]">
                {file.path}
              </span>

              <div className="flex items-center gap-4">
                <div className="w-24">
                  <CoverageBar percentage={pct} size="sm" />
                </div>
                <span className={`text-sm font-medium w-14 text-right ${getCoverageTextColor(pct)}`}>
                  {pct.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-400 w-16 text-right">
                  {file.linesHit}/{file.linesTotal}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
