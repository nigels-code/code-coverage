import type { CoverageData, FileCoverage } from './types'

export function parseLcov(content: string): CoverageData {
  const files: FileCoverage[] = []
  let currentFile: FileCoverage | null = null

  for (const line of content.split('\n')) {
    if (line.startsWith('SF:')) {
      currentFile = {
        path: line.slice(3),
        linesHit: 0,
        linesTotal: 0,
        lines: {},
      }
    } else if (line.startsWith('DA:')) {
      const parts = line.slice(3).split(',')
      const lineNum = parseInt(parts[0], 10)
      const hits = parseInt(parts[1], 10)

      if (currentFile) {
        currentFile.lines[lineNum] = hits
        currentFile.linesTotal++
        if (hits > 0) currentFile.linesHit++
      }
    } else if (line === 'end_of_record' && currentFile) {
      files.push(currentFile)
      currentFile = null
    }
  }

  const totalHit = files.reduce((sum, f) => sum + f.linesHit, 0)
  const totalLines = files.reduce((sum, f) => sum + f.linesTotal, 0)

  return {
    files,
    totalHit,
    totalLines,
    percentage: totalLines > 0 ? (totalHit / totalLines) * 100 : 0,
  }
}
