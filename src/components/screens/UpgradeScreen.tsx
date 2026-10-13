import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { RobotMascotIllustration } from '../Illustrations';

interface UpgradeScreenProps {
  onBack: () => void;
}

export const UpgradeScreen: React.FC<UpgradeScreenProps> = ({ onBack }) => {
  const [upgraded, setUpgraded] = useState(false);

  return (
    <div
      id="screen-upgrade"
      className="flex flex-col min-h-full max-w-md mx-auto bg-[#F8F6F0] pb-8"
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#E8E2D5] bg-white sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-[#1E3932] hover:bg-black/5 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold font-heading text-[#1E3932]">
          Transaction Fee / Upgrade
        </h2>
        <div className="w-9" />
      </div>

      <div className="p-5 space-y-5">
        {/* Robot Mascot Illustration */}
        <div className="flex flex-col items-center text-center">
          <RobotMascotIllustration className="w-32 h-32" />
          <h3 className="text-xl font-extrabold font-heading text-[#1E3932] mt-2">
            Support ThikThak
          </h3>
          <p className="text-xs text-[#526057] max-w-xs mt-1 leading-relaxed">
            We keep it free for basic use. Upgrade to remove transaction fees, get advanced AI support and more.
          </p>
        </div>

        {/* Free Tier Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E2D5] space-y-3 shadow-xs">
          <h4 className="text-sm font-bold font-heading text-[#1E3932]">Free Tier</h4>
          <ul className="space-y-2 text-xs text-[#526057]">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#3D7A4C]" />
              <span>Basic expense splitting</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#3D7A4C]" />
              <span>AI mediator (limited queries)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#3D7A4C]" />
              <span>Ad-supported</span>
            </li>
          </ul>
        </div>

        {/* Premium Tier Card */}
        <div className="bg-[#FAF8F3] rounded-3xl p-5 border-2 border-[#E5A93C] space-y-3 relative shadow-md">
          <span className="absolute -top-3 right-5 bg-[#E5A93C] text-[#1E3932] text-[11px] font-extrabold font-heading px-3 py-0.5 rounded-full shadow-xs">
            Most Popular
          </span>

          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E5A93C]" />
              <h4 className="text-base font-extrabold font-heading text-[#1E3932]">
                Premium
              </h4>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold font-heading text-[#1E3932]">
                ৳ 49
              </span>
              <span className="text-xs text-[#7A887E]"> / month</span>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-[#1E3932] font-medium pt-1">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#3D7A4C] shrink-0" />
              <span>No transaction fees</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#3D7A4C] shrink-0" />
              <span>Unlimited AI mediation & dispute solving</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#3D7A4C] shrink-0" />
              <span>Advanced insights & monthly budgeting reports</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#3D7A4C] shrink-0" />
              <span>Priority WhatsApp & in-app support</span>
            </li>
          </ul>
        </div>

        {/* Upgrade Button */}
        <div className="pt-2">
          <button
            onClick={() => setUpgraded(true)}
            className="w-full py-3.5 rounded-full bg-[#1E3932] text-white font-heading font-semibold text-sm hover:bg-[#152722] active:scale-[0.99] transition-all cursor-pointer shadow-sm"
          >
            {upgraded ? '✨ Premium Active!' : 'Upgrade Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
