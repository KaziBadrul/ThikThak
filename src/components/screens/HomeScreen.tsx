import React, { useState } from 'react';
import {
  Home,
  ChevronDown,
  ChevronRight,
  Settings,
  PlusCircle,
  Split,
  Calendar,
  DollarSign,
  Check,
  X,
} from 'lucide-react';
import { Member, Expense, Household, BalancePair } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { settleDebt } from '../../services/api';

interface HomeScreenProps {
  household: Household | null;
  members: Member[];
  expenses: Expense[];
  balances: BalancePair[];
  onOpenAddExpense: (type?: 'one-time' | 'recurring') => void;
  onOpenExpensesList: () => void;
  onOpenSettings: () => void;
  onSelectExpense: (expense: Expense) => void;
  onRefreshData: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  household,
  members,
  expenses,
  balances,
  onOpenAddExpense,
  onOpenExpensesList,
  onOpenSettings,
  onSelectExpense,
  onRefreshData,
}) => {
  const [selectedRoommate, setSelectedRoommate] = useState<Member | null>(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [settling, setSettling] = useState(false);

  // Compute "You are owed" vs "You owe"
  // You are 'm1' / 'You' / 'Kazi Badrul'
  let youAreOwed = 0;
  let youOwe = 0;

  balances.forEach((b) => {
    const isToYou = b.to.toLowerCase() === 'you' || b.to.toLowerCase().includes('kazi');
    const isFromYou = b.from.toLowerCase() === 'you' || b.from.toLowerCase().includes('kazi');
    if (isToYou) {
      youAreOwed += b.amount;
    }
    if (isFromYou) {
      youOwe += b.amount;
    }
  });

  const netBalance = Math.round((youAreOwed - youOwe) * 100) / 100;
  const isNetPositive = netBalance >= 0;

  // Recent 3-4 expenses
  const recentExpenses = expenses.slice(0, 4);

  const handleSettle = async (from: string, to: string, amount: number) => {
    setSettling(true);
    try {
      await settleDebt(from, to, amount);
      onRefreshData();
      setShowBalanceModal(false);
      setSelectedRoommate(null);
    } catch (err) {
      console.error('Failed to settle balance:', err);
    } finally {
      setSettling(false);
    }
  };

  return (
    <div
      id="screen-home-dashboard"
      className="flex flex-col min-h-full max-w-md mx-auto bg-[#F8F6F0] pb-24"
    >
      {/* Top Bar matching wireframe */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between bg-white border-b border-[#E8E2D5] sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1E3932] text-white flex items-center justify-center">
            <Home className="w-4 h-4" />
          </div>
          <div>
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1 text-sm font-bold font-heading text-[#1E3932] hover:opacity-85 cursor-pointer"
            >
              <span>{household?.name || 'Green House'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#526057]" />
            </button>
            <p className="text-[11px] text-[#7A887E]">
              {members.length} members • {household?.code || '12C, IUT'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#526057] hover:bg-black/5 hover:text-[#1E3932] transition-colors cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Total Balance Hero Card matching wireframe */}
        <div
          onClick={() => setShowBalanceModal(true)}
          className="bg-white rounded-3xl p-5 border border-[#E8E2D5] shadow-xs flex items-center justify-between hover:border-[#1E3932]/40 transition-all cursor-pointer group"
        >
          <div>
            <p className="text-xs font-semibold text-[#7A887E]">Total balance</p>
            <h2 className="text-3xl font-extrabold font-heading text-[#1E3932] mt-1">
              ৳ {Math.abs(netBalance).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-xs font-semibold text-[#3D7A4C] mt-1 flex items-center gap-1">
              {isNetPositive ? 'You are owed' : 'You owe'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FAF8F3] group-hover:bg-[#1E3932] group-hover:text-white flex items-center justify-center text-[#8A958E] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Roommates Row matching wireframe */}
        <div className="flex items-center justify-between px-2">
          {members.map((m) => {
            const isYou = m.isCurrentUser;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedRoommate(m)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div
                  className="w-13 h-13 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: m.avatarColor }}
                >
                  {isYou ? 'You' : m.initials}
                </div>
                <span className="text-xs font-semibold text-[#1E3932]">
                  {isYou ? 'You' : m.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Action Cards (3 items) matching wireframe */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Add Expense */}
          <button
            id="btn-quick-add-expense"
            onClick={() => onOpenAddExpense('one-time')}
            className="bg-white border border-[#E8E2D5] hover:border-[#1E3932]/40 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EBF3E8] text-[#3D7A4C] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold font-heading text-[#1E3932]">
              Add Expense
            </span>
          </button>

          {/* Split Bill */}
          <button
            id="btn-quick-split-bill"
            onClick={() => onOpenAddExpense('one-time')}
            className="bg-white border border-[#E8E2D5] hover:border-[#1E3932]/40 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E8F3F8] text-[#2C7A9E] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Split className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold font-heading text-[#1E3932]">
              Split Bill
            </span>
          </button>

          {/* Recurring */}
          <button
            id="btn-quick-recurring"
            onClick={() => onOpenAddExpense('recurring')}
            className="bg-white border border-[#E8E2D5] hover:border-[#1E3932]/40 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF3DC] text-[#B87A14] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold font-heading text-[#1E3932]">
              Recurring
            </span>
          </button>
        </div>

        {/* Recent Activity matching wireframe */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold font-heading text-[#1E3932]">
              Recent Activity
            </h3>
            <button
              onClick={onOpenExpensesList}
              className="text-xs font-semibold text-[#1E3932] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          <div className="space-y-2.5">
            {recentExpenses.map((exp) => (
              <div
                key={exp.id}
                onClick={() => onSelectExpense(exp)}
                className="bg-white rounded-2xl p-3.5 border border-[#E8E2D5] flex items-center justify-between shadow-xs hover:border-[#1E3932]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon category={exp.category || exp.merchant} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1E3932] group-hover:text-[#152722]">
                      {exp.merchant}
                    </h4>
                    <p className="text-[11px] text-[#7A887E] mt-0.5">
                      {exp.date} {exp.is_recurring && '• Recurring'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold font-heading text-[#1E3932]">
                    ৳ {exp.total.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-semibold text-[#7A887E] bg-[#FAF8F3] px-2 py-0.5 rounded-full border border-[#E8E2D5]/70 mt-0.5 inline-block">
                    Split
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Balance Details Breakdown Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E8E2D5] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-heading text-[#1E3932]">
                Household Balances
              </h3>
              <button
                onClick={() => setShowBalanceModal(false)}
                className="text-xs text-[#7A887E] hover:text-[#1E3932] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF8F3] p-4 rounded-2xl border border-[#E8E2D5] text-center">
              <p className="text-xs text-[#7A887E]">Your Net Standing</p>
              <p className="text-2xl font-extrabold font-heading text-[#1E3932] mt-0.5">
                ৳ {Math.abs(netBalance).toLocaleString()}
              </p>
              <p className="text-xs font-bold text-[#3D7A4C] mt-0.5">
                {isNetPositive ? 'You are owed' : 'You owe'} overall
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-[#1E3932]">Active Ledger Pairs</p>
              {balances.length === 0 ? (
                <p className="text-xs text-[#7A887E] text-center py-4">All settled up! No debts.</p>
              ) : (
                balances.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-white border border-[#E8E2D5] rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#1E3932]">{b.from}</span>
                      <span className="text-[#7A887E]"> owes </span>
                      <span className="font-bold text-[#1E3932]">{b.to}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#1E3932]">
                        ৳ {b.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleSettle(b.from, b.to, b.amount)}
                        disabled={settling}
                        className="px-2 py-1 rounded-lg bg-[#1E3932] text-white text-[11px] font-bold hover:bg-[#152722] cursor-pointer"
                      >
                        Settle
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Individual Roommate Balance Drawer */}
      {selectedRoommate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E8E2D5] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                  style={{ backgroundColor: selectedRoommate.avatarColor }}
                >
                  {selectedRoommate.initials}
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-[#1E3932]">
                    {selectedRoommate.name}
                  </h3>
                  <p className="text-xs text-[#7A887E]">{selectedRoommate.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoommate(null)}
                className="text-xs text-[#7A887E] hover:text-[#1E3932] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bilateral math */}
            <div className="p-3 bg-[#FAF8F3] rounded-2xl border border-[#E8E2D5] text-center">
              {(() => {
                const theyOweYou = balances.find(
                  (b) =>
                    b.from.toLowerCase() === selectedRoommate.name.toLowerCase() &&
                    (b.to.toLowerCase() === 'you' || b.to.toLowerCase().includes('kazi'))
                );
                const youOweThem = balances.find(
                  (b) =>
                    (b.from.toLowerCase() === 'you' || b.from.toLowerCase().includes('kazi')) &&
                    b.to.toLowerCase() === selectedRoommate.name.toLowerCase()
                );

                if (theyOweYou) {
                  return (
                    <div>
                      <p className="text-xs text-[#7A887E]">{selectedRoommate.name} owes you</p>
                      <p className="text-2xl font-extrabold font-heading text-[#3D7A4C] mt-0.5">
                        ৳ {theyOweYou.amount.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleSettle(selectedRoommate.name, 'You', theyOweYou.amount)}
                        className="mt-3 w-full py-2.5 rounded-full bg-[#1E3932] text-white text-xs font-bold hover:bg-[#152722] cursor-pointer"
                      >
                        Record bKash / Cash Settlement
                      </button>
                    </div>
                  );
                } else if (youOweThem) {
                  return (
                    <div>
                      <p className="text-xs text-[#7A887E]">You owe {selectedRoommate.name}</p>
                      <p className="text-2xl font-extrabold font-heading text-[#C45E3D] mt-0.5">
                        ৳ {youOweThem.amount.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleSettle('You', selectedRoommate.name, youOweThem.amount)}
                        className="mt-3 w-full py-2.5 rounded-full bg-[#1E3932] text-white text-xs font-bold hover:bg-[#152722] cursor-pointer"
                      >
                        Mark as Paid to {selectedRoommate.name}
                      </button>
                    </div>
                  );
                }
                return (
                  <p className="text-xs text-[#7A887E] py-2">
                    No outstanding balance between you and {selectedRoommate.name}. Everything is even!
                  </p>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
