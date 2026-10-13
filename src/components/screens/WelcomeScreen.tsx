import React from 'react';
import { ThikThakLogo } from '../ThikThakLogo';
import { RoommatesTableIllustration } from '../Illustrations';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onAlreadyHaveAccount: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onAlreadyHaveAccount,
}) => {
  return (
    <div
      id="screen-welcome"
      className="flex flex-col justify-between min-h-full px-6 py-8 max-w-md mx-auto"
    >
      {/* Top Logo & Tagline */}
      <div className="pt-4 flex flex-col items-center text-center">
        <ThikThakLogo size="xl" showTagline={true} showSubtitle={true} />
      </div>

      {/* Center Roommates Illustration */}
      <div className="my-6 flex items-center justify-center">
        <RoommatesTableIllustration className="w-72 h-52" />
      </div>

      {/* Bottom CTA Buttons */}
      <div className="flex flex-col gap-3 pb-4">
        <button
          id="btn-get-started"
          onClick={onGetStarted}
          className="w-full py-3.5 px-6 rounded-full bg-[#1E3932] text-white font-heading font-semibold text-base shadow-sm hover:bg-[#152722] active:scale-[0.99] transition-all cursor-pointer"
        >
          Get Started
        </button>

        <button
          id="btn-already-have-account"
          onClick={onAlreadyHaveAccount}
          className="w-full py-2.5 px-4 text-center text-sm font-medium text-[#526057] hover:text-[#1E3932] transition-colors cursor-pointer"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
};
