/**
 * Decorative SVG illustration for auth pages.
 * Shows a person studying with books, flashcards, and multi-language elements.
 */
export function StudyIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Desk */}
      <rect x="80" y="280" width="340" height="12" rx="6" fill="#86efac" />
      <rect x="120" y="292" width="12" height="60" rx="4" fill="#4ade80" />
      <rect x="368" y="292" width="12" height="60" rx="4" fill="#4ade80" />

      {/* Laptop */}
      <rect x="180" y="220" width="140" height="60" rx="6" fill="#166534" />
      <rect x="188" y="228" width="124" height="44" rx="3" fill="#dcfce7" />
      {/* Screen content — globe icon representing all languages */}
      <circle cx="250" cy="250" r="14" stroke="#166534" strokeWidth="2" fill="none" />
      <ellipse cx="250" cy="250" rx="6" ry="14" stroke="#166534" strokeWidth="1.5" fill="none" />
      <line x1="236" y1="250" x2="264" y2="250" stroke="#166534" strokeWidth="1.5" />
      <line x1="250" y1="236" x2="250" y2="264" stroke="#166534" strokeWidth="1.5" />
      {/* Laptop base */}
      <path d="M165 280 L180 270 L320 270 L335 280 Z" fill="#4ade80" />

      {/* Book stack (left) */}
      <rect x="100" y="258" width="60" height="10" rx="2" fill="#5eead4" />
      <rect x="104" y="248" width="56" height="10" rx="2" fill="#2dd4bf" />
      <rect x="102" y="238" width="54" height="10" rx="2" fill="#14b8a6" />

      {/* Flashcards (right) */}
      <rect
        x="340" y="240" width="50" height="38" rx="4"
        fill="#bbf7d0" transform="rotate(-5 365 259)"
      />
      <rect
        x="345" y="242" width="50" height="38" rx="4"
        fill="#86efac" transform="rotate(3 370 261)"
      />
      {/* "ABC" on flashcard */}
      <text
        x="370" y="267" textAnchor="middle"
        fontSize="13" fontWeight="bold" fill="#15803d"
        transform="rotate(3 370 261)"
      >
        ABC
      </text>

      {/* Coffee mug */}
      <rect x="140" y="264" width="20" height="16" rx="3" fill="#f97316" />
      <path
        d="M160 268 Q168 268 168 274 Q168 280 160 280"
        stroke="#f97316" strokeWidth="2.5" fill="none"
      />
      {/* Steam */}
      <path d="M147 260 Q149 254 147 248" stroke="#d1d5db" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M153 258 Q155 252 153 246" stroke="#d1d5db" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Person — Head */}
      <circle cx="250" cy="150" r="32" fill="#fcd34d" />
      {/* Hair */}
      <path d="M220 142 Q220 115 250 112 Q280 115 280 142" fill="#1e293b" />
      {/* Eyes */}
      <circle cx="240" cy="152" r="3" fill="#1e293b" />
      <circle cx="260" cy="152" r="3" fill="#1e293b" />
      {/* Smile */}
      <path d="M242 163 Q250 170 258 163" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Person — Body */}
      <path d="M230 180 Q250 195 270 180 L275 230 L225 230 Z" fill="#166534" />
      {/* Arms */}
      <path d="M230 195 Q200 210 195 240" stroke="#fcd34d" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M270 195 Q300 210 305 240" stroke="#fcd34d" strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* Floating elements — language bubbles */}
      {/* Chat bubble — "Hi" */}
      <g opacity="0.85">
        <rect x="60" y="55" width="44" height="30" rx="12" fill="#5eead4" />
        <polygon points="82,85 88,85 80,93" fill="#5eead4" />
        <text x="82" y="75" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#134e4a">Hi!</text>
      </g>

      {/* Chat bubble — "Hola" */}
      <g opacity="0.8">
        <rect x="385" y="42" width="56" height="30" rx="12" fill="#86efac" />
        <polygon points="400,72 406,72 398,80" fill="#86efac" />
        <text x="413" y="62" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#14532d">Hola</text>
      </g>

      {/* Chat bubble — "Xin chào" */}
      <g opacity="0.75">
        <rect x="55" y="170" width="70" height="28" rx="12" fill="#fde68a" />
        <polygon points="100,198 106,198 98,206" fill="#fde68a" />
        <text x="90" y="189" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400e">Xin chào</text>
      </g>

      {/* Chat bubble — "Bonjour" */}
      <g opacity="0.7">
        <rect x="390" y="180" width="66" height="28" rx="12" fill="#fbcfe8" />
        <polygon points="410,208 416,208 408,216" fill="#fbcfe8" />
        <text x="423" y="199" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#9d174d">Bonjour</text>
      </g>

      {/* Decorative dots */}
      <circle cx="120" cy="120" r="4" fill="#14b8a6" opacity="0.7" />
      <circle cx="400" cy="120" r="3" fill="#4ade80" opacity="0.6" />
      <circle cx="370" cy="150" r="5" fill="#6ee7b7" opacity="0.5" />
      <circle cx="140" cy="135" r="3" fill="#2dd4bf" opacity="0.6" />
    </svg>
  );
}
