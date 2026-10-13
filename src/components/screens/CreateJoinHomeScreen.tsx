import React, { useState } from 'react';
import { ArrowLeft, Home, Users, ChevronRight } from 'lucide-react';
import { SmallHouseIllustration } from '../Illustrations';

interface CreateJoinHomeScreenProps {
  onBack: () => void;
  onSelectOption: (option: 'create' | 'join', data?: { name: string; code?: string }) => void;
}

export const CreateJoinHomeScreen: React.FC<CreateJoinHomeScreenProps> = ({
  onBack,
  onSelectOption,
}) => {
  const [modalMode, setModalMode] = useState<'create' | 'join' | null>(null);
  const [homeName, setHomeName] = useState('');
  const [homeCode, setHomeCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create' && homeName.trim()) {
      onSelectOption('create', { name: homeName.trim(), code: homeCode.trim() || '12C, IUT' });
    } else if (modalMode === 'join' && homeCode.trim()) {
      onSelectOption('join', { name: 'Green House', code: homeCode.trim() });
    }
  };

  return (
    <div
      id="screen-create-join-home"
      className="flex flex-col justify-between min-h-full px-6 py-6 max-w-md mx-auto relative"
    >
      <div>
        {/* Navigation header */}
        <button
          id="btn-back-from-create-join"
          onClick={onBack}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#1E3932] hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Title and subtitle */}
        <div className="mt-4 mb-6">
          <h2 className="text-2xl font-bold font-heading text-[#1E3932]">
            Create / Join Home
          </h2>
          <p className="text-sm text-[#526057] mt-1.5 leading-relaxed">
            Start by creating a home or join an existing one with your roommates.
          </p>
        </div>

        {/* Action cards */}
        <div className="space-y-4">
          {/* Card 1: Create a New Home */}
          <button
            id="btn-option-create-home"
            onClick={() => setModalMode('create')}
            className="w-full text-left bg-white border border-[#E8E2D5] hover:border-[#1E3932]/40 rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#1E3932] text-white flex items-center justify-center shrink-0">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold font-heading text-[#1E3932] group-hover:text-[#152722]">
                  Create a New Home
                </h3>
                <p className="text-xs text-[#526057] mt-0.5 leading-snug">
                  Set up your shared living space and invite your roommates.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8A958E] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
          </button>

          {/* Card 2: Join an Existing Home */}
          <button
            id="btn-option-join-home"
            onClick={() => setModalMode('join')}
            className="w-full text-left bg-white border border-[#E8E2D5] hover:border-[#1E3932]/40 rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#2D5046] text-white flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold font-heading text-[#1E3932] group-hover:text-[#152722]">
                  Join an Existing Home
                </h3>
                <p className="text-xs text-[#526057] mt-0.5 leading-snug">
                  Enter the invite link from your roommate.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8A958E] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
          </button>
        </div>
      </div>

      {/* Bottom illustration with motto */}
      <div className="flex flex-col items-center justify-center my-6">
        <SmallHouseIllustration className="w-48 h-32" />
        <p className="text-sm font-medium italic text-[#1E3932] mt-1 font-heading text-center">
          Same roof. Same bills. Less drama.
        </p>
      </div>

      {/* Direct continue button for quick demo */}
      <div className="pb-2">
        <button
          onClick={() => onSelectOption('create', { name: 'Green House', code: '12C, IUT' })}
          className="w-full py-3 rounded-full bg-[#1E3932] text-white font-heading font-medium text-sm hover:bg-[#152722] transition-colors cursor-pointer"
        >
          Enter Green House Demo
        </button>
      </div>

      {/* Popup modal for Create or Join */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E8E2D5] shadow-xl">
            <h3 className="text-lg font-bold font-heading text-[#1E3932]">
              {modalMode === 'create' ? 'Create a New Home' : 'Join Existing Home'}
            </h3>
            <p className="text-xs text-[#526057] mt-1">
              {modalMode === 'create'
                ? 'Name your flat/mess (e.g. Green House, Flat 4B)'
                : 'Enter your roommate’s household code or invite code'}
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {modalMode === 'create' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3932] mb-1">
                      Home Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Green House"
                      value={homeName}
                      onChange={(e) => setHomeName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D2C5] text-sm focus:outline-none focus:border-[#1E3932]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3932] mb-1">
                      Location / Flat No. (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12C, IUT"
                      value={homeCode}
                      onChange={(e) => setHomeCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D2C5] text-sm focus:outline-none focus:border-[#1E3932]"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-[#1E3932] mb-1">
                    Household Invite Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12C-IUT-98"
                    value={homeCode}
                    onChange={(e) => setHomeCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D2C5] text-sm focus:outline-none focus:border-[#1E3932]"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D9D2C5] text-xs font-semibold text-[#526057] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1E3932] text-white text-xs font-semibold hover:bg-[#152722] cursor-pointer"
                >
                  {modalMode === 'create' ? 'Create' : 'Join'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
