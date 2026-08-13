/**
 * 인라인 SVG 아이콘.
 * 이모지(🚶🚗📍💡)는 OS마다 제각각 렌더되고 조악해 보여서 쓰지 않는다.
 * 전부 currentColor + stroke 방식이라 글자색만 맞추면 톤이 붙는다.
 */
type IconProps = { className?: string }

const base = 'stroke-current fill-none'

export function WalkIcon({ className = 'w-3.5 h-3.5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="13" cy="4" r="1.6" />
      <path d="M11.5 21l1.2-5.4-2.7-2.4.9-4.6 3.1 2.1 2.6.7" />
      <path d="M10.9 8.6L8.2 9.8 6.6 13" />
      <path d="M12.7 15.6L15.9 21" />
    </svg>
  )
}

export function CarIcon({ className = 'w-3.5 h-3.5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 15.5h16" />
      <path d="M5.5 15.5V19a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5v-3.5" />
      <path d="M20.5 15.5V19a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-3.5" />
      <path d="M4 15.5l1.4-5A2 2 0 017.3 9h9.4a2 2 0 011.9 1.5l1.4 5" />
      <path d="M7 12.5h.01M17 12.5h.01" />
    </svg>
  )
}

export function PinIcon({ className = 'w-3.5 h-3.5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-5.7 7-11a7 7 0 10-14 0c0 5.3 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

export function TrainIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="3.5" width="14" height="12" rx="3" />
      <path d="M5 10h14" />
      <path d="M9 13.2h.01M15 13.2h.01" />
      <path d="M8 15.5L6 20.5M16 15.5l2 5" />
    </svg>
  )
}

export function BulbIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 17.5h5" />
      <path d="M10 20.5h4" />
      <path d="M9 14.6a5.5 5.5 0 116 0c-.6.5-1 1.2-1 2H10c0-.8-.4-1.5-1-2z" />
    </svg>
  )
}

export function ChevronIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  )
}

export function PlaneIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.5 13.5L3 11V9l7.5 1.2V5.2a1.7 1.7 0 013.4 0v5L21 9v2l-7.1 2.5.6 4.6 2.5 1.2v1.3l-4.3-1-4.3 1v-1.3l2.5-1.2z" />
    </svg>
  )
}

export function SunIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </svg>
  )
}

export function BedIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 18v-9M3 13h18v5M21 18v-4" />
      <path d="M7 13v-2.5a1 1 0 011-1h9a3 3 0 013 3" />
      <circle cx="7.5" cy="10.5" r="0.01" />
    </svg>
  )
}

export function WalletIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M16.5 14.5h.01" />
    </svg>
  )
}

export function CalendarIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </svg>
  )
}

export function BookIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4.5h6a2.5 2.5 0 012.5 2.5v13A2 2 0 0010.5 18H4z" />
      <path d="M20 4.5h-6A2.5 2.5 0 0011.5 7v13A2 2 0 0113.5 18H20z" />
    </svg>
  )
}

export function SearchIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8L20 20" />
    </svg>
  )
}

export function CardIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M6.5 14.5h4" />
    </svg>
  )
}

export function PhoneIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </svg>
  )
}

export function PassportIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2.8" width="14" height="18.4" rx="2.5" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9.5 17.5h5" />
    </svg>
  )
}

export function HomeIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19z" />
      <path d="M9.5 20.5v-6h5v6" />
    </svg>
  )
}

export function StarIcon({ className = 'w-3 h-3' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
      <path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.3l6.1-.9z" />
    </svg>
  )
}
