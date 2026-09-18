// Wireframe + chrome icons for the Altana UI. Ported 1:1 from the
// altana-wireframes reference so the Velt wireframe templates and the app
// chrome (document toolbar, sidebar toggle) render the exact same glyphs.

export function KebabIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="8" r="1.3" />
      <circle cx="8" cy="8" r="1.3" />
      <circle cx="13" cy="8" r="1.3" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2.5v7m0 0 2.7-2.7M8 9.5 5.3 6.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.8 11.4v1.3c0 .44.36.8.8.8h8.8c.44 0 .8-.36.8-.8v-1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyIllustration() {
  return (
    <svg width="120" height="64" viewBox="0 0 120 64" fill="none" aria-hidden="true">
      <rect x="22" y="6" width="44" height="40" rx="9" fill="#EFEDE8" transform="rotate(-4 22 6)" />
      <rect x="60" y="8" width="40" height="42" rx="9" fill="#EFEDE8" transform="rotate(3 60 8)" />
      <path d="M36 20h18M36 27h12" stroke="#CFCCC4" strokeWidth="2.6" strokeLinecap="round" transform="rotate(-4 36 20)" />
      <circle cx="40" cy="35" r="1.6" fill="#CFCCC4" transform="rotate(-4 40 35)" />
      <circle cx="46" cy="35" r="1.6" fill="#CFCCC4" transform="rotate(-4 46 35)" />
      <path d="M74 22h16M74 29h16M74 36h10" stroke="#CFCCC4" strokeWidth="2.6" strokeLinecap="round" transform="rotate(3 74 22)" />
    </svg>
  );
}

export function CommentPlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M14 9.33333C14 10.0697 13.403 10.6667 12.6667 10.6667H4.66667L2 13.3333V3.33333C2 2.59695 2.59695 2 3.33333 2H12.6667C13.403 2 14 2.59695 14 3.33333V9.33333Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 4.9v3.2M6.4 6.5h3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ChatTeardropIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M132,24A100.11,100.11,0,0,0,32,124v84a16,16,0,0,0,16,16h84a100,100,0,0,0,0-200Z" />
        </svg>
    );
}

export function ChatTeardropOutlineIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M132,24A100.11,100.11,0,0,0,32,124v84a16,16,0,0,0,16,16h84a100,100,0,0,0,0-200Zm0,184H48V124a84,84,0,1,1,84,84Z" />
        </svg>
    );
}
