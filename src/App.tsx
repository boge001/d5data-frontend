import { useEffect, useRef, useState } from 'react'
import resumeIllustration from './assets/resume-illustration.png'
import ResumeDropzone from './components/ResumeDropzone'
import StepIndicator from './components/StepIndicator'
import { CheckIcon, FileIcon } from './components/Icons'
import { formatFileSize } from './lib/resume'

type View = 'upload' | 'review' | 'complete'

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [view, setView] = useState<View>('upload')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousView = useRef(view)

  useEffect(() => {
    if (previousView.current !== view) headingRef.current?.focus()
    previousView.current = view
  }, [view])

  const heading =
    view === 'upload'
      ? 'Upload file'
      : view === 'review'
        ? 'Review your resume'
        : 'All set!'

  return (
    <main className="resume-page">
      <section className="introduction" aria-labelledby="page-title">
        <h1 id="page-title">
          Finish!
          <br />
          Upload Your Resume
        </h1>
        <p className="introduction__description">
          Upload your resume, the platform will help you parse and optimize, you
          can also skip this step
        </p>
        <div className="illustration" aria-hidden="true">
          <img src={resumeIllustration} alt="" width="800" height="600" />
        </div>
      </section>

      <section className="upload-card" aria-labelledby="card-title">
        <h2 id="card-title" ref={headingRef} tabIndex={-1}>
          {heading}
        </h2>

        {view === 'upload' ? (
          <>
            <ResumeDropzone file={file} onFileChange={setFile} />
            <div className="actions">
              <button
                className="button button--secondary"
                type="button"
                onClick={() => setView('review')}
              >
                Last step
              </button>
              <button
                className="button button--primary"
                type="button"
                onClick={() => setView('complete')}
              >
                Finish
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="summary" aria-live="polite">
              {view === 'complete' ? (
                <span className="summary__success-icon">
                  <CheckIcon />
                </span>
              ) : (
                <FileIcon className="summary__file-icon" />
              )}
              <h3>
                {view === 'complete'
                  ? file
                    ? 'Your resume is ready'
                    : 'You can add a resume later'
                  : file
                    ? 'Your selected resume'
                    : 'A resume is optional'}
              </h3>
              {file ? (
                <>
                  <p className="summary__filename">{file.name}</p>
                  <p className="summary__description">
                    {formatFileSize(file.size)}
                  </p>
                </>
              ) : (
                <p className="summary__description">
                  {view === 'review'
                    ? 'Choose a file in the next step, or continue without one.'
                    : 'You have finished this step without selecting a file.'}
                </p>
              )}
            </div>
            <div className="actions actions--single">
              <button
                type="button"
                className="button button--primary"
                onClick={() => setView('upload')}
              >
                {view === 'review' ? 'Continue' : 'Back to upload'}
              </button>
            </div>
          </>
        )}

        <StepIndicator
          currentStep={view === 'review' ? 2 : 3}
          complete={view === 'complete'}
        />
      </section>
    </main>
  )
}
