import styles from './CoinScatterBackground.module.css';

function RupeeCoin({ rotate }) {
  const gradientId = `coin-gradient-${rotate}`;
  const shineId = `coin-shine-${rotate}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFF4C7" />
          <stop offset="35%" stopColor="#FFD166" />
          <stop offset="70%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#B86E00" />
        </linearGradient>

        <radialGradient id={shineId}>
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer coin */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill={`url(#${gradientId})`}
        stroke="#FFE8A3"
        strokeWidth="2"
      />

      {/* Inner ring */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#FFF3CF"
        strokeWidth="1.5"
        opacity="0.65"
      />

      {/* Shine */}
      <circle
        cx="37"
        cy="32"
        r="18"
        fill={`url(#${shineId})`}
        opacity="0.45"
      />

      {/* Rupee */}
      <text
        x="50"
        y="64"
        fontSize="36"
        fontWeight="800"
        fill="#805000"
        textAnchor="middle"
        fontFamily="Inter, Sora, sans-serif"
      >
        ₹
      </text>
    </svg>
  );
}

const SCATTER = [
  { top: '5%', left: '4%', size: 44, rotate: -15, opacity: 0.1 },
  { top: '10%', left: '23%', size: 28, rotate: 18, opacity: 0.08 },
  { top: '4%', left: '48%', size: 32, rotate: -10, opacity: 0.07 },
  { top: '8%', left: '80%', size: 38, rotate: 12, opacity: 0.1 },

  { top: '35%', left: '5%', size: 30, rotate: 20, opacity: 0.08 },
  { top: '42%', left: '92%', size: 36, rotate: -14, opacity: 0.1 },

  { top: '70%', left: '10%', size: 38, rotate: -18, opacity: 0.08 },
  { top: '76%', left: '82%', size: 42, rotate: 20, opacity: 0.09 },

  { top: '92%', left: '28%', size: 30, rotate: -8, opacity: 0.07 },
  { top: '90%', left: '68%', size: 26, rotate: 14, opacity: 0.07 },
];

function CoinScatterBackground() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {SCATTER.map((coin, index) => (
        <div
          key={index}
          className={styles.coin}
          style={{
            top: coin.top,
            left: coin.left,
            width: coin.size,
            height: coin.size,
            opacity: coin.opacity,
          }}
        >
          <RupeeCoin rotate={coin.rotate} />
        </div>
      ))}
    </div>
  );
}

export default CoinScatterBackground;