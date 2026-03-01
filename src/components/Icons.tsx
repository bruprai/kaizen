export const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
export const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
export const SystemIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <mask id="moonMask">
      <rect x="0" y="0" width="100%" height="100%" fill="white" />

      <circle cx="18" cy="6" r="8" fill="black" />
    </mask>

    <circle cx="12" cy="12" r="6" fill="currentColor" mask="url(#moonMask)" />

    <g stroke="currentColor" stroke-width="1" stroke-linecap="round">
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </g>
  </svg>
);

export const CategoriesIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="currentColor"
      stroke="none"
      stroke-width="7"
      stroke-linejoin="round"
    >
      <rect x="12" y="12" width="32" height="32" rx="10" />

      <rect x="53" y="12" width="32" height="32" rx="10" />

      <rect x="12" y="53" width="32" height="32" rx="10" />

      <rect x="53" y="53" width="31" height="32" rx="10" stroke="orange" />
    </g>
  </svg>
);

export const CategoriesIconAll = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="currentColor"
      stroke="none"
      stroke-width="7"
      stroke-linejoin="round"
    >
      <rect x="12" y="12" width="32" height="32" rx="10" />

      <rect x="53" y="12" width="32" height="32" rx="10" />

      <rect x="12" y="53" width="32" height="32" rx="10" />

      <rect x="53" y="53" width="31" height="32" rx="10" />
    </g>
  </svg>
);

export const SortAscIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <rect x="32" y="42" width="32" height="10" rx="5" />
      <rect x="32" y="58" width="42" height="10" rx="5" />
      <rect x="32" y="74" width="52" height="10" rx="5" />
    </g>
  </svg>
);

export const SortDescIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <rect x="32" y="42" width="52" height="10" rx="5" />
      <rect x="32" y="58" width="42" height="10" rx="5" />
      <rect x="32" y="74" width="32" height="10" rx="5" />
    </g>
  </svg>
);
