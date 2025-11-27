export interface FileCoverage {
  path: string
  linesHit: number
  linesTotal: number
  lines: Record<number, number>
}

export interface CoverageData {
  files: FileCoverage[]
  totalHit: number
  totalLines: number
  percentage: number
}

export interface ProjectMetadata {
  project: string
  lastUpdated: string
  sourceRepo: string
  sourceCommit: string
  sourceBranch: string
  workflowRun?: string
}

export interface Project {
  name: string
  coverage: CoverageData
  metadata: ProjectMetadata | null
}
