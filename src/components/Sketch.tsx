/**
 * Desenhos de exemplo usados no lugar das fotos enquanto não há
 * imagem enviada. Quando existe foto real, o componente Photo mostra
 * a imagem e estes desenhos não aparecem.
 */

const S = {
  vert: (
    <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M2 16h60M2 62h60M6 16v46M58 16v46" />
      <g strokeWidth="1.6">
        <path d="M16 18v42M25 18v42M34 18v42M43 18v42M52 18v42" />
      </g>
    </g>
  ),
  glass: (
    <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M2 14h60M2 64h60M6 14v50M32 14v50M58 14v50" />
      <g strokeWidth="1.1" opacity=".45">
        <path d="M11 58l14-38M18 58l14-38M39 58l14-38M46 58l12-32" />
      </g>
    </g>
  ),
  cable: (
    <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M2 14h60M6 14v50M58 14v50M32 18v46" />
      <g strokeWidth="1.5">
        <path d="M6 24h52M6 33h52M6 42h52M6 51h52M6 60h52" />
      </g>
    </g>
  ),
  cross: (
    <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M2 16h60M2 62h60M6 16v46M32 16v46M58 16v46" />
      <g strokeWidth="1.6">
        <path d="M8 60l22-42M30 60L8 18M36 60l22-42M58 60L36 18" />
      </g>
    </g>
  ),
  panel: (
    <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M2 16h60M2 62h60M6 16v46M58 16v46" />
      <g strokeWidth="1.6">
        <rect x="13" y="24" width="17" height="30" rx="2" />
        <rect x="34" y="24" width="17" height="30" rx="2" />
      </g>
    </g>
  ),
} as const;

const SCENES = {
  stair: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 84h112" strokeWidth="2.4" />
      <path d="M14 84V70h16V58h16V46h16V34h18" opacity=".85" />
      <path d="M14 56l68-38" strokeWidth="2.6" />
      <path d="M14 70l58-32" opacity=".5" />
      <g strokeWidth="1.4" opacity=".8">
        <path d="M22 78V60M34 72V52M46 66V45M58 60V38M70 54V31" />
      </g>
      <g strokeWidth="1.2" opacity=".35">
        <path d="M92 8v76M104 14v70M92 30h26M92 52h26" />
      </g>
    </g>
  ),
  balcony: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <g strokeWidth="1.2" opacity=".35">
        <path d="M8 6v78M112 6v78M8 6h104M8 30h104" />
        <rect x="20" y="12" width="20" height="13" rx="1" />
        <rect x="80" y="12" width="20" height="13" rx="1" />
      </g>
      <path d="M6 56h108" strokeWidth="2.6" />
      <path d="M6 82h108" strokeWidth="2.6" />
      <path d="M10 56v26M110 56v26" />
      <g strokeWidth="1.4" opacity=".85">
        <path d="M24 58v22M38 58v22M52 58v22M66 58v22M80 58v22M94 58v22" />
      </g>
    </g>
  ),
  deck: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <g strokeWidth="1.1" opacity=".3">
        <path d="M0 26h120M0 34h120" />
        <circle cx="98" cy="16" r="8" />
      </g>
      <path d="M4 50h112" strokeWidth="2.6" />
      <path d="M4 72h112" strokeWidth="2.2" />
      <path d="M10 50v24M60 50v24M110 50v24" />
      <g strokeWidth="1.3" opacity=".75">
        <path d="M4 57h112M4 64h112" />
      </g>
      <g strokeWidth="1.2" opacity=".45">
        <path d="M0 78h120M0 84h120M14 72v18M40 72v18M76 72v18M102 72v18" />
      </g>
    </g>
  ),
  porch: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <g strokeWidth="1.2" opacity=".35">
        <path d="M18 84V16h84v68" />
        <rect x="50" y="30" width="22" height="40" rx="1.5" />
        <path d="M14 16L60 2l46 14" />
      </g>
      <path d="M28 84V60h64v24" opacity=".55" />
      <path d="M24 62h30M24 78h30" strokeWidth="2.4" />
      <path d="M26 62v16M52 62v16" />
      <g strokeWidth="1.3" opacity=".8">
        <path d="M32 63v14M38 63v14M44 63v14" />
      </g>
      <path d="M66 62h30M66 78h30" strokeWidth="2.4" />
      <path d="M68 62v16M94 62v16" />
      <g strokeWidth="1.3" opacity=".8">
        <path d="M74 63v14M80 63v14M86 63v14" />
      </g>
      <path d="M4 84h112" strokeWidth="2.2" />
    </g>
  ),
} as const;

export type SketchName = keyof typeof S | keyof typeof SCENES;

export function Sketch({ name }: { name?: string | null }) {
  const key = (name ?? "vert") as SketchName;
  if (key in SCENES) {
    return (
      <svg
        viewBox="0 0 120 90"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {SCENES[key as keyof typeof SCENES]}
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 64 76"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {S[(key in S ? key : "vert") as keyof typeof S]}
    </svg>
  );
}
