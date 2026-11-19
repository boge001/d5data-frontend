export const MAX_FILE_BYTES = 10 * 1024 * 1024
export const ACCEPTED_RESUME_TYPES =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const EXTENSIONS = new Set(['pdf', 'doc', 'docx'])

export function validateResume(files: readonly File[]): string | null {
  if (files.length !== 1) return 'Please choose one resume at a time.'

  const file = files[0]
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''

  if (!EXTENSIONS.has(extension)) {
    return 'Please choose a PDF, DOC, or DOCX file.'
  }
  if (file.size === 0)
    return 'This file is empty. Please choose another resume.'
  if (file.size > MAX_FILE_BYTES) {
    return 'Your resume must be 10 MB or smaller.'
  }

  return null
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
