import { useId, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import {
  ACCEPTED_RESUME_TYPES,
  formatFileSize,
  validateResume,
} from '../lib/resume'
import { CloseIcon, FileIcon, UploadIcon } from './Icons'

type ResumeDropzoneProps = {
  file: File | null
  onFileChange: (file: File | null) => void
}

export default function ResumeDropzone({
  file,
  onFileChange,
}: ResumeDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const descriptionId = useId()
  const errorId = useId()

  function selectFiles(files: File[]) {
    const message = validateResume(files)
    setError(message)
    if (!message) onFileChange(files[0])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? [])
    if (files.length) selectFiles(files)
    event.currentTarget.value = ''
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (!event.dataTransfer.types.includes('Files')) return
    dragDepth.current += 1
    setDragging(true)
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    if (!event.dataTransfer.types.includes('Files')) return
    selectFiles(Array.from(event.dataTransfer.files))
  }

  function clearFile() {
    onFileChange(null)
    setError(null)
    buttonRef.current?.focus()
  }

  return (
    <div className="upload-field">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_RESUME_TYPES}
        onChange={handleInputChange}
        tabIndex={-1}
        hidden
        aria-label="Resume file"
      />
      <div
        className={`dropzone${dragging ? ' dropzone--dragging' : ''}${file ? ' dropzone--selected' : ''}${error ? ' dropzone--error' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'copy'
        }}
        onDrop={handleDrop}
      >
        <svg className="dropzone__border" aria-hidden="true" fill="none">
          <rect x="0.5" y="0.5" />
        </svg>
        <button
          ref={buttonRef}
          type="button"
          className="dropzone__button"
          onClick={() => inputRef.current?.click()}
          aria-label={
            file ? `Replace resume: ${file.name}` : 'Choose your resume'
          }
          aria-describedby={`${descriptionId}${error ? ` ${errorId}` : ''}`}
          aria-invalid={Boolean(error)}
        >
          <span className="dropzone__content">
            {file ? (
              <>
                <FileIcon className="dropzone__file-icon" />
                <span className="dropzone__filename" title={file.name}>
                  {file.name}
                </span>
                <span className="dropzone__metadata">
                  {`${file.name.split('.').pop()?.toUpperCase()} · ${formatFileSize(file.size)}`}
                </span>
                <span className="dropzone__replace">
                  Click or drop a file to replace
                </span>
              </>
            ) : (
              <>
                <UploadIcon className="dropzone__upload-icon" />
                <span className="dropzone__hint" id={descriptionId}>
                  {dragging ? (
                    'Drop your resume here'
                  ) : (
                    <>
                      Drag your resume file to this area, or click on the area
                      to select
                      <br className="desktop-break" /> the appropriate file to
                      upload
                    </>
                  )}
                </span>
              </>
            )}
          </span>
        </button>
        {file && (
          <button
            type="button"
            className="dropzone__remove"
            aria-label="Remove resume"
            onClick={clearFile}
          >
            <CloseIcon />
          </button>
        )}
      </div>
      {file && (
        <span className="sr-only" id={descriptionId}>
          PDF, DOC, or DOCX. Maximum file size: 10 MB.
        </span>
      )}
      <p className="upload-field__error" id={errorId} role="alert">
        {error}
      </p>
      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {file
          ? `${file.name} selected, ${formatFileSize(file.size)}.`
          : 'No resume selected.'}
      </p>
    </div>
  )
}
