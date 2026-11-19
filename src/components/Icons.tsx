import uploadCloud from '../assets/upload-cloud.svg'

type IconProps = { className?: string }

export function UploadIcon({ className }: IconProps) {
  return (
    <img
      aria-hidden="true"
      className={className}
      src={uploadCloud}
      alt=""
      width="58"
      height="39"
    />
  )
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 48 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M28 4H11a4 4 0 0 0-4 4v40a4 4 0 0 0 4 4h26a4 4 0 0 0 4-4V17L28 4Z" />
      <path d="M28 4v13h13M16 29h16M16 37h12" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
    >
      <path
        d="M8.49373 0.258435C8.83831 -0.0861451 9.39698 -0.0861451 9.74156 0.258435C10.0861 0.603015 10.0861 1.16169 9.74156 1.50627L4.44745 6.80039C4.10287 7.14497 3.54419 7.14497 3.19961 6.80039L0.258435 3.85921C-0.0861451 3.51463 -0.0861451 2.95596 0.258435 2.61138C0.603015 2.2668 1.16169 2.2668 1.50627 2.61138L3.82353 4.92863L8.49373 0.258435Z"
        fill="#2A4CFE"
        style={{ fill: 'color(display-p3 0.1647 0.2980 0.9961)' }}
      />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="m5 5 10 10M15 5 5 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
