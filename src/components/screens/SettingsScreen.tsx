import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Home,
  Users,
  CreditCard,
  Bell,
  HelpCircle,
  Info,
  Sparkles,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { Member, Household } from '../../types';
import { addMember, deleteMember, resetDatabase } from '../../services/api';

interface SettingsScreenProps {
  household: Household | null;
  members: Member[];
  onBack: () => void;
  onOpenUpgrade: () => void;
  onRefreshData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  household,
  members,
  onBack,
  onOpenUpgrade,
  onRefreshData,
}) => {
  const [activeSubModal, setActiveSubModal] = useState<
    'roommates' | 'payment' | 'home' | null
  >(null);
  const [newRoommateName, setNewRoommateName] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('bKash (0171XXXXXXX)');

  const handleAddRoommate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoommateName.trim()) return;
    try {
      await addMember(newRoommateName.trim());
      setNewRoommateName('');
      onRefreshData();
    } catch (err) {
      console.error('Failed to add roommate:', err);
    }
  };

  const handleDeleteRoommate = async (id: string) => {
    if (!confirm('Remove roommate from household?')) return;
    try {
      await deleteMember(id);
      onRefreshData();
    } catch (err) {
      console.error('Failed to remove roommate:', err);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset to default Green House demo data?')) {
      await resetDatabase();
      onRefreshData();
      alert('Data reset to default!');
    }
  };

  return (
    <div
      id="screen-settings"
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
        <h2 className="text-base font-bold font-heading text-[#1E3932]">Settings</h2>
        <div className="w-9" />
      </div>

      <div className="p-5 space-y-4">
        {/* User profile card matching wireframe */}
        <div className="bg-white rounded-3xl p-4 border border-[#E8E2D5] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#1E3932] text-white flex items-center justify-center font-bold text-base shadow-xs">
              KB
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-[#1E3932]">
                Kazi Badrul
              </h3>
              <p className="text-xs text-[#7A887E]">kazibadrul@iut.ac.bd</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8A958E]" />
        </div>

        {/* Upgrade / Support Banner */}
        <button
          onClick={onOpenUpgrade}
          className="w-full bg-gradient-to-r from-[#1E3932] to-[#2C5248] text-white p-4 rounded-3xl flex items-center justify-between shadow-sm hover:opacity-95 transition-opacity cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#E5A93C]" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-heading">Support ThikThak</h4>
              <p className="text-xs text-white/80">Upgrade to unlimited AI & zero fees</p>
            </div>
          </div>
          <span className="text-xs bg-[#E5A93C] text-[#1E3932] font-bold px-2.5 py-1 rounded-full">
            ৳ 49/mo
          </span>
        </button>

        {/* Menu Items List */}
        <div className="bg-white rounded-3xl border border-[#E8E2D5] divide-y divide-[#F0EDE5] overflow-hidden shadow-xs">
          {/* Home Settings */}
          <button
            onClick={() => setActiveSubModal('home')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FAF8F3] text-[#1E3932] flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E3932]">Home Settings</p>
                <p className="text-[11px] text-[#7A887E]">{household?.name || 'Green House'} • {household?.code || '12C, IUT'}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A958E]" />
          </button>

          {/* Roommates */}
          <button
            onClick={() => setActiveSubModal('roommates')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FAF8F3] text-[#1E3932] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E3932]">Roommates</p>
                <p className="text-[11px] text-[#7A887E]">{members.length} members in house</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A958E]" />
          </button>

          {/* Payment Method */}
          <button
            onClick={() => setActiveSubModal('payment')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FAF8F3] text-[#1E3932] flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E3932]">Payment Method</p>
                <p className="text-[11px] text-[#7A887E]">{selectedPayment}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A958E]" />
          </button>

          {/* Notifications */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FAF8F3] text-[#1E3932] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E3932]">Notifications</p>
                <p className="text-[11px] text-[#7A887E]">Bill dues & AI split updates</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#3D7A4C] bg-[#EBF3E8] px-2 py-0.5 rounded-full">
              Enabled
            </span>
          </div>

          {/* Help & Support */}
          <div className="p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FAF8F3] text-[#1E3932] flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-[#1E3932]">Help & Support</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A958E]" />
          </div>

          {/* About ThikThak */}
          <div className="p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FAF8F3] text-[#1E3932] flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E3932]">About ThikThak</p>
                <p className="text-[11px] text-[#7A887E]">v1.0.0 • AI Living Assistant</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A958E]" />
          </div>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-2xl border border-[#E8E2D5] text-xs font-semibold text-[#7A887E] hover:text-[#1E3932] hover:bg-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Demo Data to Initial State
        </button>

        {/* Motto footer matching wireframe */}
        <div className="pt-4 text-center">
          <p className="text-xs text-[#7A887E] font-medium flex items-center justify-center gap-1">
            <span>❤️</span>
            <span className="font-heading font-semibold text-[#1E3932]">
              Better bills. Better vibes.
            </span>
            <span>ThikThak</span>
          </p>
        </div>
      </div>

      {/* Roommates Modal */}
      {activeSubModal === 'roommates' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-[#E8E2D5] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-heading text-[#1E3932]">
                Manage Roommates
              </h3>
              <button
                onClick={() => setActiveSubModal(null)}
                className="text-xs text-[#7A887E] hover:text-[#1E3932] cursor-pointer"
              >
                Done
              </button>
            </div>

            <form onSubmit={handleAddRoommate} className="flex gap-2">
              <input
                type="text"
                placeholder="New roommate name..."
                value={newRoommateName}
                onChange={(e) => setNewRoommateName(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#D9D2C5] text-xs focus:outline-none focus:border-[#1E3932]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1E3932] text-white text-xs font-bold hover:bg-[#152722] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            <div className="divide-y divide-[#F0EDE5] max-h-60 overflow-y-auto">
              {members.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: m.avatarColor }}
                    >
                      {m.initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1E3932]">
                        {m.name} {m.isCurrentUser ? '(You)' : ''}
                      </p>
                      <p className="text-[10px] text-[#7A887E]">{m.email}</p>
                    </div>
                  </div>
                  {!m.isCurrentUser && (
                    <button
                      onClick={() => handleDeleteRoommate(m.id)}
                      className="text-[#C45E3D] p-1 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {activeSubModal === 'payment' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-[#E8E2D5] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-heading text-[#1E3932]">
                Payment Methods
              </h3>
              <button
                onClick={() => setActiveSubModal(null)}
                className="text-xs text-[#7A887E] hover:text-[#1E3932] cursor-pointer"
              >
                Done
              </button>
            </div>

            <div className="space-y-2">
              {['bKash (0171XXXXXXX)', 'Nagad (0182XXXXXXX)', 'City Bank Account', 'Cash settlement'].map((pm) => (
                <div
                  key={pm}
                  onClick={() => setSelectedPayment(pm)}
                  className={`p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                    selectedPayment === pm
                      ? 'border-[#1E3932] bg-[#FAF8F3] text-[#1E3932]'
                      : 'border-[#E8E2D5] text-[#526057] hover:border-[#1E3932]/40'
                  }`}
                >
                  {pm}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Home Details Modal */}
      {activeSubModal === 'home' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-[#E8E2D5] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-heading text-[#1E3932]">
                Home Details
              </h3>
              <button
                onClick={() => setActiveSubModal(null)}
                className="text-xs text-[#7A887E] hover:text-[#1E3932] cursor-pointer"
              >
                Done
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#FAF8F3] p-3 rounded-2xl border border-[#E8E2D5]">
                <span className="text-[#7A887E] block text-[10px] uppercase font-bold">Household Name</span>
                <span className="font-bold text-[#1E3932] text-sm">{household?.name}</span>
              </div>
              <div className="bg-[#FAF8F3] p-3 rounded-2xl border border-[#E8E2D5]">
                <span className="text-[#7A887E] block text-[10px] uppercase font-bold">Address / Unit</span>
                <span className="font-bold text-[#1E3932] text-sm">{household?.code}</span>
              </div>
              <div className="bg-[#FAF8F3] p-3 rounded-2xl border border-[#E8E2D5]">
                <span className="text-[#7A887E] block text-[10px] uppercase font-bold">Default Currency</span>
                <span className="font-bold text-[#1E3932] text-sm">Bangladeshi Taka (BDT ৳)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
