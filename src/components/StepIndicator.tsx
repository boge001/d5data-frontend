import { CheckIcon } from './Icons'

type StepIndicatorProps = {
  currentStep: 2 | 3
  complete?: boolean
}

const steps = ['Profile', 'Review', 'Resume']

export default function StepIndicator({
  currentStep,
  complete = false,
}: StepIndicatorProps) {
  return (
    <nav className="steps" aria-label="Application progress">
      <ol
        className="steps__list"
        data-current-step={currentStep}
        data-complete={complete}
      >
        {steps.map((label, index) => {
          const number = index + 1
          const done = complete || number < currentStep
          return (
            <li
              key={label}
              className={`steps__item${done ? ' steps__item--done' : ''}`}
              aria-current={number === currentStep ? 'step' : undefined}
            >
              <span className="steps__circle" aria-hidden="true">
                {done ? <CheckIcon /> : number}
              </span>
              <span className="sr-only">
                {`Step ${number}: ${label}${done ? ', complete' : ''}`}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
