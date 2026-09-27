function VeloraLogo({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8D568" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      <path
        d="M12 10 L24 50 L36 22 L52 10 L40 54 L24 54 Z"
        fill="url(#goldGradient)"
      />

      <circle
        cx="46"
        cy="18"
        r="7"
        fill="#0B0F19"
        stroke="url(#goldGradient)"
        strokeWidth="2"
      />

      <circle cx="43" cy="15" r="1.2" fill="#D4AF37" />
      <circle cx="49" cy="15" r="1.2" fill="#D4AF37" />
      <circle cx="43" cy="21" r="1.2" fill="#D4AF37" />
      <circle cx="49" cy="21" r="1.2" fill="#D4AF37" />
    </svg>
  );
}

export default VeloraLogo;