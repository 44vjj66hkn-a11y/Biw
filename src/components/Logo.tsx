/**
 * Marca da Boston Iron Works, redesenhada em vetor.
 *
 * Desenha em `currentColor`, então funciona sobre fundo escuro sem
 * precisar de caixa branca atrás — é só definir a cor no elemento pai.
 */
export function Logo({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 340 118"
      className={className}
      role="img"
      aria-label="Boston Iron Works"
      // largura fica a cargo de quem usa (classe ou prop); fixá-la aqui
      // venceria o CSS e estouraria o layout em telas estreitas
      style={{ display: "block", height: "auto", ...style }}
    >
      <text
        x="170"
        y="46"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Georgia,'Times New Roman',serif"
        fontSize="46"
        fontWeight="700"
        letterSpacing="1.5"
      >
        BOSTON
      </text>
      {/* mesa superior da viga */}
      <path d="M14 55 L336 60 L336 66 L14 68 Z" fill="currentColor" />
      {/* alma da viga, que faz o "I" de IRON */}
      <path d="M32 55 L52 55 L52 104 L32 108 Z" fill="currentColor" />
      {/* mesa inferior */}
      <path d="M14 100 L336 92 L336 100 L14 112 Z" fill="currentColor" />
      <text
        x="58"
        y="96"
        fill="currentColor"
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

/**
 * Conjunto de marca usado no topo dos painéis: a logo da empresa e,
 * abaixo, o nome do sistema.
 */
export function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="brand-header">
      <Logo className="brand-header-logo" />
      <div className="brand-header-text">
        <div className="brand-header-name">BIW — Project Management</div>
        {subtitle && <div className="brand-header-sub">{subtitle}</div>}
      </div>
    </header>
  );
}
