import React from 'react';

export const RoommatesTableIllustration: React.FC<{ className?: string }> = ({ className = 'w-64 h-48' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Table */}
        <ellipse cx="160" cy="160" rx="90" ry="24" fill="#E8DFD1" stroke="#1E3932" strokeWidth="4" />
        <path d="M152 184V204H168V184" fill="#E8DFD1" stroke="#1E3932" strokeWidth="4" />

        {/* Laptop on table */}
        <path d="M142 152L178 152L174 162L146 162Z" fill="#78909C" stroke="#1E3932" strokeWidth="2.5" />
        <rect x="146" y="136" width="28" height="17" rx="2" fill="#CFD8DC" stroke="#1E3932" strokeWidth="2.5" />
        <circle cx="160" cy="144" r="2.5" fill="#E5A93C" />

        {/* Coffee Mug & small plant */}
        <rect x="122" y="148" width="10" height="12" rx="2" fill="#FFFFFF" stroke="#1E3932" strokeWidth="2" />
        <path d="M120 152H117C115 152 115 156 117 156H120" stroke="#1E3932" strokeWidth="2" />

        {/* Person 1 (Far Left, dark wavy hair, green top) */}
        <g transform="translate(64, 76)">
          <path d="M12 36C4 20 20 6 34 8C48 6 62 20 54 36H12Z" fill="#1F2923" />
          <circle cx="34" cy="36" r="18" fill="#FCE5CE" />
          <circle cx="28" cy="36" r="2.5" fill="#1F2923" />
          <circle cx="40" cy="36" r="2.5" fill="#1F2923" />
          <path d="M30 43C32 46 36 46 38 43" stroke="#1F2923" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 54C18 54 26 52 34 52C42 52 50 54 50 54C56 60 58 76 58 76H10C10 76 12 60 18 54Z" fill="#5F8D76" stroke="#1E3932" strokeWidth="3" />
        </g>

        {/* Person 2 (Center Left, curly hair, teal shirt, leaning forward) */}
        <g transform="translate(112, 60)">
          <circle cx="32" cy="28" r="19" fill="#1F2923" />
          <circle cx="32" cy="34" r="17" fill="#FCE5CE" />
          {/* Glasses */}
          <circle cx="26" cy="33" r="5.5" fill="none" stroke="#1F2923" strokeWidth="2" />
          <circle cx="38" cy="33" r="5.5" fill="none" stroke="#1F2923" strokeWidth="2" />
          <line x1="31.5" y1="33" x2="32.5" y2="33" stroke="#1F2923" strokeWidth="2" />
          <circle cx="26" cy="33" r="2" fill="#1F2923" />
          <circle cx="38" cy="33" r="2" fill="#1F2923" />
          <path d="M28 41C30 43 34 43 36 41" stroke="#1F2923" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 51C14 51 22 48 32 48C42 48 50 51 50 51C56 58 58 84 58 84H6C6 84 8 58 14 51Z" fill="#4C829E" stroke="#1E3932" strokeWidth="3" />
        </g>

        {/* Person 3 (Center Right, white t-shirt, cheerful smile) */}
        <g transform="translate(170, 64)">
          <path d="M8 30C6 14 20 4 34 6C48 4 60 14 56 30H8Z" fill="#1F2923" />
          <circle cx="32" cy="34" r="17" fill="#FCE5CE" />
          <circle cx="26" cy="34" r="2.5" fill="#1F2923" />
          <circle cx="38" cy="34" r="2.5" fill="#1F2923" />
          <path d="M28 41C30 44 34 44 36 41" stroke="#1F2923" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 51C14 51 22 48 32 48C42 48 50 51 50 51C56 58 58 82 58 82H6C6 82 8 58 14 51Z" fill="#FFFFFF" stroke="#1E3932" strokeWidth="3" />
        </g>

        {/* Person 4 (Far Right, long hair, yellow ochre sweater) */}
        <g transform="translate(218, 72)">
          <path d="M10 32C6 14 22 4 34 6C46 4 60 14 56 32C60 52 56 68 56 68L48 64V48H18V64L10 68C10 68 6 52 10 32Z" fill="#1F2923" />
          <circle cx="33" cy="36" r="17" fill="#FCE5CE" />
          <circle cx="28" cy="36" r="2.5" fill="#1F2923" />
          <circle cx="38" cy="36" r="2.5" fill="#1F2923" />
          <path d="M29 43C31 46 35 46 37 43" stroke="#1F2923" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 53C16 53 24 51 33 51C42 51 49 53 49 53C54 60 56 76 56 76H9C9 76 11 60 16 53Z" fill="#E5A93C" stroke="#1E3932" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
};

export const SmallHouseIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-36' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Ground grass line */}
        <path d="M15 130H185" stroke="#1E3932" strokeWidth="3.5" strokeLinecap="round" />

        {/* Trees */}
        <path d="M35 130V95" stroke="#1E3932" strokeWidth="3.5" />
        <circle cx="35" cy="85" r="20" fill="#7BAE7F" stroke="#1E3932" strokeWidth="3.5" />

        <path d="M168 130V105" stroke="#1E3932" strokeWidth="3.5" />
        <circle cx="168" cy="98" r="16" fill="#88C296" stroke="#1E3932" strokeWidth="3.5" />

        {/* Cozy House */}
        {/* Chimney */}
        <rect x="118" y="44" width="14" height="26" fill="#FAF8F3" stroke="#1E3932" strokeWidth="3.5" />
        <path d="M115 44H135" stroke="#1E3932" strokeWidth="3.5" strokeLinecap="round" />

        {/* Roof */}
        <path d="M60 74L102 38L144 74H60Z" fill="#1E3932" stroke="#1E3932" strokeWidth="3.5" strokeLinejoin="round" />

        {/* Body */}
        <rect x="66" y="74" width="72" height="56" fill="#FAF8F3" stroke="#1E3932" strokeWidth="3.5" />

        {/* Windows */}
        <rect x="74" y="84" width="14" height="16" rx="2" fill="#E5A93C" stroke="#1E3932" strokeWidth="2" />
        <line x1="81" y1="84" x2="81" y2="100" stroke="#1E3932" strokeWidth="1.5" />
        <line x1="74" y1="92" x2="88" y2="92" stroke="#1E3932" strokeWidth="1.5" />

        <rect x="95" y="84" width="14" height="16" rx="2" fill="#E5A93C" stroke="#1E3932" strokeWidth="2" />
        <line x1="102" y1="84" x2="102" y2="100" stroke="#1E3932" strokeWidth="1.5" />
        <line x1="95" y1="92" x2="109" y2="92" stroke="#1E3932" strokeWidth="1.5" />

        <rect x="116" y="84" width="14" height="16" rx="2" fill="#E5A93C" stroke="#1E3932" strokeWidth="2" />
        <line x1="123" y1="84" x2="123" y2="100" stroke="#1E3932" strokeWidth="1.5" />
        <line x1="116" y1="92" x2="130" y2="92" stroke="#1E3932" strokeWidth="1.5" />

        {/* Door */}
        <path d="M96 130V112H110V130" fill="#5F8D76" stroke="#1E3932" strokeWidth="2.5" />
        <circle cx="106" cy="122" r="1.5" fill="#E5A93C" />
      </svg>
    </div>
  );
};

export const RobotMascotIllustration: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Floating coins */}
        <circle cx="28" cy="54" r="12" fill="#E5A93C" stroke="#1E3932" strokeWidth="3" />
        <text x="28" y="58" textAnchor="middle" fill="#1E3932" fontSize="13" fontWeight="bold">৳</text>

        <circle cx="134" cy="50" r="13" fill="#E5A93C" stroke="#1E3932" strokeWidth="3" />
        <text x="134" y="55" textAnchor="middle" fill="#1E3932" fontSize="14" fontWeight="bold">৳</text>

        {/* Sparkles */}
        <path d="M36 28L32 20L40 24L36 28Z" fill="#E5A93C" />
        <path d="M124 24L128 16L120 20L124 24Z" fill="#E5A93C" />

        {/* Antenna */}
        <line x1="80" y1="36" x2="80" y2="48" stroke="#1E3932" strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="32" r="6" fill="#E5A93C" stroke="#1E3932" strokeWidth="3" />

        {/* Robot Head */}
        <rect x="42" y="48" width="76" height="58" rx="20" fill="#FAF8F3" stroke="#1E3932" strokeWidth="4" />

        {/* Ears */}
        <rect x="34" y="66" width="8" height="18" rx="4" fill="#5F8D76" stroke="#1E3932" strokeWidth="3" />
        <rect x="118" y="66" width="8" height="18" rx="4" fill="#5F8D76" stroke="#1E3932" strokeWidth="3" />

        {/* Visor / Eyes */}
        <rect x="52" y="62" width="56" height="24" rx="10" fill="#1E3932" />
        <circle cx="64" cy="74" r="5" fill="#4FD1C5" />
        <circle cx="96" cy="74" r="5" fill="#4FD1C5" />

        {/* Smile */}
        <path d="M72 90C76 94 84 94 88 90" stroke="#1E3932" strokeWidth="3" strokeLinecap="round" />

        {/* Body */}
        <path d="M54 108C54 108 62 106 80 106C98 106 106 108 106 108C114 116 116 136 116 136H44C44 136 46 116 54 108Z" fill="#5F8D76" stroke="#1E3932" strokeWidth="4" />
        <circle cx="80" cy="120" r="4" fill="#E5A93C" />
      </svg>
    </div>
  );
};
