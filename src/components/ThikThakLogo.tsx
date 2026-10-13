import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  showSubtitle?: boolean;
  className?: string;
  horizontal?: boolean;
}

export const ThikThakLogo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  showSubtitle = false,
  className = '',
  horizontal = false,
}) => {
  const iconSizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };

  const HouseIllustration = (
    <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Sun rays / sparkles around house */}
        <path d="M42 62L28 54" stroke="#E5A93C" strokeWidth="6" strokeLinecap="round" />
        <path d="M52 46L44 32" stroke="#E5A93C" strokeWidth="6" strokeLinecap="round" />
        <path d="M158 54L172 46" stroke="#E5A93C" strokeWidth="6" strokeLinecap="round" />
        <path d="M166 70L180 76" stroke="#E5A93C" strokeWidth="6" strokeLinecap="round" />

        {/* House outline */}
        <path
          d="M100 24L38 78V166C38 171.5 42.5 176 48 176H152C157.5 176 162 171.5 162 166V78L100 24Z"
          fill="#FAF8F3"
          stroke="#1E3932"
          strokeWidth="9"
          strokeLinejoin="round"
        />

        {/* Chimney */}
        <path
          d="M136 54V34H152V68"
          fill="#FAF8F3"
          stroke="#1E3932"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Roommate 1: Top Left (Green shirt, wavy hair) */}
        <g transform="translate(56, 70)">
          {/* Hair */}
          <path d="M8 20C4 10 14 0 24 2C34 0 44 10 40 20C44 26 38 32 36 34H12C10 32 4 26 8 20Z" fill="#1F2923" />
          {/* Face */}
          <circle cx="24" cy="22" r="14" fill="#FCE5CE" />
          {/* Eyes & smile */}
          <circle cx="20" cy="22" r="1.8" fill="#1F2923" />
          <circle cx="28" cy="22" r="1.8" fill="#1F2923" />
          <path d="M21 26C22.5 28 25.5 28 27 26" stroke="#1F2923" strokeWidth="1.8" strokeLinecap="round" />
          {/* Body */}
          <path d="M12 34C12 34 16 33 24 33C32 33 36 34 36 34C40 37 42 46 42 46H6C6 46 8 37 12 34Z" fill="#5F8D76" />
        </g>

        {/* Roommate 2: Top Right (Yellow shirt, long dark hair) */}
        <g transform="translate(102, 68)">
          {/* Long Hair */}
          <path d="M10 22C6 10 18 2 28 2C38 2 50 10 46 22C50 36 48 48 48 48L40 46V36H16V46L8 48C8 48 6 36 10 22Z" fill="#1F2923" />
          {/* Face */}
          <circle cx="28" cy="24" r="13" fill="#FCE5CE" />
          {/* Eyes & smile */}
          <circle cx="24" cy="24" r="1.8" fill="#1F2923" />
          <circle cx="32" cy="24" r="1.8" fill="#1F2923" />
          <path d="M25 28C26.5 30 29.5 30 31 28" stroke="#1F2923" strokeWidth="1.8" strokeLinecap="round" />
          {/* Body */}
          <path d="M16 35C16 35 21 34 28 34C35 34 40 35 40 35C44 38 46 46 46 46H10C10 46 12 38 16 35Z" fill="#E5A93C" />
        </g>

        {/* Roommate 3: Bottom Left (Blue shirt, round glasses) */}
        <g transform="translate(52, 115)">
          {/* Hair */}
          <path d="M6 18C4 8 16 0 26 2C36 0 46 8 44 18C46 22 42 26 38 28H12C8 26 4 22 6 18Z" fill="#1F2923" />
          {/* Face */}
          <circle cx="25" cy="22" r="13" fill="#FCE5CE" />
          {/* Glasses */}
          <circle cx="20" cy="21" r="5" fill="none" stroke="#1F2923" strokeWidth="1.6" />
          <circle cx="30" cy="21" r="5" fill="none" stroke="#1F2923" strokeWidth="1.6" />
          <line x1="25" y1="21" x2="25" y2="21" stroke="#1F2923" strokeWidth="1.6" />
          <circle cx="20" cy="21" r="1.5" fill="#1F2923" />
          <circle cx="30" cy="21" r="1.5" fill="#1F2923" />
          {/* Smile */}
          <path d="M22 27C23.5 29 26.5 29 28 27" stroke="#1F2923" strokeWidth="1.6" strokeLinecap="round" />
          {/* Body */}
          <path d="M12 32C12 32 17 31 25 31C33 31 38 32 38 32C42 35 44 45 44 45H6C6 45 8 35 12 32Z" fill="#4C829E" />
        </g>

        {/* Roommate 4: Bottom Right (Terracotta/Orange shirt) */}
        <g transform="translate(98, 114)">
          {/* Hair */}
          <path d="M6 18C4 8 16 2 26 2C36 2 46 8 44 18C46 22 42 26 38 28H12C8 26 4 22 6 18Z" fill="#1F2923" />
          {/* Face */}
          <circle cx="25" cy="22" r="13" fill="#FCE5CE" />
          {/* Eyes & smile */}
          <circle cx="21" cy="22" r="1.8" fill="#1F2923" />
          <circle cx="29" cy="22" r="1.8" fill="#1F2923" />
          <path d="M22 26C23.5 28 26.5 28 28 26" stroke="#1F2923" strokeWidth="1.8" strokeLinecap="round" />
          {/* Body */}
          <path d="M12 32C12 32 17 31 25 31C33 31 38 32 38 32C42 35 44 45 44 45H6C6 45 8 35 12 32Z" fill="#C86A4B" />
        </g>

        {/* Receipt and Coin (bottom right outside house) */}
        <g transform="translate(130, 110)">
          {/* Receipt paper */}
          <rect
            x="0"
            y="4"
            width="38"
            height="50"
            rx="4"
            fill="#FFFFFF"
            stroke="#1E3932"
            strokeWidth="5"
            transform="rotate(6 19 25)"
          />
          <line x1="8" y1="16" x2="26" y2="18" stroke="#1E3932" strokeWidth="4" strokeLinecap="round" />
          <line x1="8" y1="26" x2="22" y2="28" stroke="#1E3932" strokeWidth="4" strokeLinecap="round" />
          <line x1="8" y1="36" x2="16" y2="37" stroke="#1E3932" strokeWidth="4" strokeLinecap="round" />

          {/* Coin */}
          <circle cx="34" cy="42" r="17" fill="#E5A93C" stroke="#1E3932" strokeWidth="5" />
          {/* Taka/Dollar symbol on coin */}
          <text
            x="34"
            y="48"
            textAnchor="middle"
            fill="#1E3932"
            fontSize="18"
            fontWeight="900"
            fontFamily="'Outfit', sans-serif"
          >
            ৳
          </text>
        </g>
      </svg>
    </div>
  );

  return (
    <div
      id="thikthak-brand-header"
      className={`flex ${horizontal ? 'flex-row items-center gap-3' : 'flex-col items-center'} ${className}`}
    >
      {HouseIllustration}
      <div className={`${horizontal ? 'text-left' : 'text-center'} mt-1`}>
        <h1
          className={`font-extrabold tracking-tight text-[#1E3932] font-heading ${titleSizes[size]} leading-none`}
        >
          ThikThak
        </h1>
        {showTagline && (
          <p className="text-xs sm:text-sm font-semibold text-[#1E3932]/85 mt-1 tracking-wide">
            Split. Settle. Stay Friendly.
          </p>
        )}
        {showSubtitle && (
          <p className="text-xs text-[#526057] mt-1 max-w-[260px] leading-relaxed">
            AI expense-splitting + negotiation assistant for shared living.
          </p>
        )}
      </div>
    </div>
  );
};
