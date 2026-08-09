/** Marca da Boston Iron Works, redesenhada em vetor. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 118"
      className={className}
      role="img"
      aria-label="Boston Iron Works"
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      <text
        x="170"
        y="46"
        textAnchor="middle"
        fill="#1F9D57"
        fontFamily="Georgia,'Times New Roman',serif"
        fontSize="46"
        fontWeight="700"
        letterSpacing="1.5"
      >
        BOSTON
      </text>
      {/* mesa superior da viga */}
      <path d="M14 55 L336 60 L336 66 L14 68 Z" fill="#1F9D57" />
      {/* alma da viga, que faz o "I" de IRON */}
      <path d="M32 55 L52 55 L52 104 L32 108 Z" fill="#1F9D57" />
      {/* mesa inferior */}
      <path d="M14 100 L336 92 L336 100 L14 112 Z" fill="#1F9D57" />
      <text
        x="58"
        y="96"
        fill="#1F9D57"
        fontFamily="Georgia,'Times New Roman',serif"
        fontSize="40"
        fontWeight="700"
        letterSpacing="0.5"
      >
        RON WORKS
      </text>
    </svg>
  );
}

/** Versão compacta (viga I) usada na barra lateral. */
export function LogoMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ width: 22, height: 22 }}
    >
      <path d="M2 6h20M2 19h20M4.5 6v13M19.5 6v13" />
      <path d="M9 8v9M15 8v9" strokeWidth="1.5" />
    </svg>
  );
}
