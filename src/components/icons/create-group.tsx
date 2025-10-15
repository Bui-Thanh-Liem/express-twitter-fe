export function CreateGroupIcon({ size }: { size?: number }) {
  return (
    <svg
      width={size ? size : 20}
      height={size ? size : 20}
      viewBox="0 0 36 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="1" y1="8" x2="7" y2="8" />
      <line x1="4" y1="5" x2="4" y2="11" />

      <path d="M24 21v-2a4 4 0 0 0-4-4h-6a4 4 0 0 0-4 4v2" />
      <path d="M24 3.128a4 4 0 0 1 0 7.744" />
      <path d="M30 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="17" cy="7" r="4" />
    </svg>
  );
}
