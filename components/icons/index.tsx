// Wireframe + chrome icons for the Altana UI. Ported 1:1 from the
// altana-wireframes reference so the Velt wireframe templates and the app
// chrome (document toolbar, sidebar toggle) render the exact same glyphs.

export function FilterLinesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 4.5h11M4.5 8h7M6.5 11.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m3.2 8.6 3.1 3.1L12.8 4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ResolveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="m6.1 9.2 2 2 3.8-4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReopenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4.5 3.5v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.9 7.4a5.6 5.6 0 1 1-.65 4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ReplyArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.00882 7.67633L6.80134 3.24323C7.08393 2.98186 7.54227 3.18226 7.54227 3.56717V5.64679C7.54227 5.80926 7.67641 5.94071 7.83886 5.94329C12.596 6.01895 13.8672 7.95351 13.8672 12.8542C13.0025 11.1248 12.5614 10.1014 7.83945 10.0608C7.67694 10.0594 7.54227 10.1912 7.54227 10.3537V12.4333C7.54227 12.8182 7.08393 13.0186 6.80134 12.7573L2.00882 8.32418C1.81998 8.1495 1.81998 7.85102 2.00882 7.67633Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KebabIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="8" r="1.3" />
      <circle cx="8" cy="8" r="1.3" />
      <circle cx="13" cy="8" r="1.3" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.91919 2.13819C10.7002 1.35713 11.9663 1.35714 12.7473 2.13819L13.8619 3.25212C14.6429 4.03317 14.6429 5.29985 13.8619 6.0809L5.66659 14.2762C5.41651 14.5263 5.07735 14.6668 4.72388 14.6668H1.99992C1.63181 14.6668 1.33338 14.3683 1.33325 14.0002V11.2762C1.33325 10.9226 1.47384 10.5835 1.72388 10.3335L9.91919 2.13819ZM11.8046 3.0809C11.5443 2.82057 11.1222 2.82057 10.8619 3.0809L9.94263 4.00017L11.9999 6.05746L12.9192 5.13819C13.1794 4.8779 13.1793 4.45585 12.9192 4.19548L11.8046 3.0809ZM2.66659 13.3335H4.72388L11.0572 7.00017L8.99992 4.94288L2.66659 11.2762V13.3335Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.19171 6.19851C3.45029 5.93652 3.87236 5.93353 4.13442 6.192C4.39641 6.45058 4.3994 6.87264 4.14093 7.1347L3.64614 7.63601L3.64353 7.63926C2.34093 8.94191 2.34089 11.0534 3.64353 12.3561C4.94616 13.6587 7.05768 13.6587 8.36033 12.3561L8.36358 12.3535L8.86489 11.8587C9.12695 11.6002 9.54901 11.6032 9.80759 11.8652C10.0661 12.1272 10.0631 12.5493 9.80108 12.8079L9.30043 13.302C7.47685 15.1224 4.52317 15.1211 2.70082 13.2988C0.87749 11.4754 0.876866 8.51926 2.70017 6.6959L3.19171 6.19851ZM8.86163 6.19525C9.12198 5.9349 9.54399 5.9349 9.80434 6.19525C10.0647 6.4556 10.0647 6.87761 9.80434 7.13796L7.13767 9.80463C6.87732 10.065 6.45531 10.065 6.19496 9.80463C5.93461 9.54428 5.93461 9.12227 6.19496 8.86192L8.86163 6.19525ZM6.69562 2.70046C8.51886 0.877258 11.4751 0.877449 13.2985 2.70046C15.1208 4.52281 15.1214 7.47648 13.3011 9.30007L13.3017 9.30072L12.8076 9.80137C12.549 10.0634 12.127 10.0664 11.8649 9.80788C11.6029 9.5493 11.5999 9.12724 11.8584 8.86517L12.3532 8.36387L12.3558 8.36062C13.6584 7.05796 13.6584 4.94645 12.3558 3.64382C11.0531 2.34119 8.94163 2.34121 7.63897 3.64382L7.63572 3.64642L7.13442 4.14121C6.87236 4.39968 6.45029 4.39669 6.19171 4.1347C5.93324 3.87264 5.93623 3.45058 6.19822 3.192L6.69562 2.70046Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8.00033 1C9.49326 1 10.755 1.98111 11.18 3.33333H13.667C14.0352 3.33333 14.3337 3.63181 14.3337 4C14.3337 4.36819 14.0352 4.66667 13.667 4.66667H13.3122L12.751 12.804C12.6787 13.8527 11.8067 14.6667 10.7555 14.6667H5.24512C4.19395 14.6667 3.32199 13.8527 3.24967 12.804L2.68848 4.66667H2.33366C1.96547 4.66667 1.66699 4.36819 1.66699 4C1.66699 3.63181 1.96547 3.33333 2.33366 3.33333H4.82064C5.24562 1.9811 6.5074 1 8.00033 1ZM4.57975 12.7122C4.60386 13.0618 4.89472 13.3333 5.24512 13.3333H10.7555C11.1059 13.3333 11.3968 13.0618 11.4209 12.7122L11.9756 4.66667H4.02507L4.57975 12.7122ZM8.00033 2.33333C7.26066 2.33333 6.61519 2.73589 6.26921 3.33333H9.73145C9.38545 2.73589 8.73999 2.33333 8.00033 2.33333Z"
        fill="currentColor"
      />
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

export function PanelToggleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.25" y="4.5" width="17.5" height="15" rx="3.25" stroke="currentColor" strokeWidth="2" />
      <line x1="9.25" y1="5" x2="9.25" y2="19" stroke="currentColor" strokeWidth="2" />
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
