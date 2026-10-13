import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Check, Edit2, AlertCircle } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { Expense, Member } from '../../types';

interface SplitDetailsModalProps {
  expense: Partial<Expense>;
  members: Member[];
  onClose: () => void;
  onConfirm?: (updatedExpense: Partial<Expense>) => void;
  readOnly?: boolean;
}

export const SplitDetailsModal: React.FC<SplitDetailsModalProps> = ({
  expense,
  members,
  onClose,
  onConfirm,
  readOnly = false,
}) => {
  const [splits, setSplits] = useState(expense.splits || []);
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  const getMemberInitials = (name: string) => {
    const mem = members.find((m) => m.name.toLowerCase() === name.toLowerCase());
    return mem ? mem.initials : name.slice(0, 2).toUpperCase();
  };

  const getMemberColor = (name: string) => {
    const mem = members.find((m) => m.name.toLowerCase() === name.toLowerCase());
    return mem ? mem.avatarColor : '#1E3932';
  };

  const handleCustomOwesChange = (index: number, newOwes: number) => {
    const updated = [...splits];
    updated[index] = { ...updated[index], owes: Math.max(0, newOwes) };
    setSplits(updated);
  };

  const currentTotalCalculated = splits.reduce((acc, s) => acc + (s.owes || 0), 0);
  const totalDifference = Math.round(((expense.total || 0) - currentTotalCalculated) * 100) / 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F6F0] flex flex-col max-w-md mx-auto overflow-y-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#E8E2D5] bg-white sticky top-0 z-10">
        <button
          onClick={onClose}
          className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-[#1E3932] hover:bg-black/5 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold font-heading text-[#1E3932]">Split Details</h2>
        <div className="w-9" />
      </div>

      <div className="p-5 flex-1 space-y-6">
        {/* Bill Summary Hero Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5] flex flex-col items-center text-center shadow-xs">
          <CategoryIcon category={expense.category || expense.merchant || ''} size="lg" />
          <h3 className="text-xl font-bold font-heading text-[#1E3932] mt-3">
            {expense.merchant || 'Expense'}
          </h3>
          <div className="text-3xl font-extrabold font-heading text-[#1E3932] mt-1">
            ৳ {Number(expense.total || 0).toLocaleString()}
          </div>
          <p className="text-xs font-medium text-[#7A887E] mt-1">
            {expense.date || new Date().toISOString().split('T')[0]}
            {expense.is_recurring && ' • Recurring'}
          </p>
          {expense.confidence && (
            <span
              className={`mt-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                expense.confidence === 'high'
                  ? 'bg-[#EBF3E8] text-[#2E683C]'
                  : 'bg-[#FFF4E5] text-[#B87A14]'
              }`}
            >
              AI Confidence: {expense.confidence.toUpperCase()}
            </span>
          )}
        </div>

        {/* Line items if available */}
        {expense.line_items && expense.line_items.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-[#E8E2D5] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A887E]">
              Extracted Line Items
            </h4>
            <div className="divide-y divide-[#F0EDE5]">
              {expense.line_items.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between text-xs text-[#1E3932]">
                  <span>{item.name}</span>
                  <span className="font-semibold">৳ {item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Split between list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-bold font-heading text-[#1E3932]">Split between</h4>
            {!readOnly && (
              <button
                type="button"
                onClick={() => setIsEditingCustom(!isEditingCustom)}
                className="text-xs font-medium text-[#1E3932] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                {isEditingCustom ? 'Done' : 'Adjust split'}
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl p-2 border border-[#E8E2D5] divide-y divide-[#F0EDE5]">
            {splits.map((s, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                    style={{ backgroundColor: getMemberColor(s.name) }}
                  >
                    {getMemberInitials(s.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1E3932] leading-tight">
                      {s.name}
                    </p>
                    {s.name === expense.paid_by ? (
                      <p className="text-[11px] text-[#3D7A4C] font-medium">Paid full bill</p>
                    ) : (
                      <p className="text-[11px] text-[#7A887E]">
                        Owes {s.owes_to || expense.paid_by}
                      </p>
                    )}
                  </div>
                </div>

                {isEditingCustom ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#1E3932]">৳</span>
                    <input
                      type="number"
                      value={s.owes}
                      onChange={(e) => handleCustomOwesChange(idx, parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-right text-sm font-bold rounded-lg border border-[#D9D2C5] focus:outline-none focus:border-[#1E3932]"
                    />
                  </div>
                ) : (
                  <div className="text-sm font-bold font-heading text-[#1E3932]">
                    ৳ {Number(s.owes).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditingCustom && Math.abs(totalDifference) > 0.05 && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
              <span>
                Sum of splits is {totalDifference > 0 ? `৳ ${totalDifference} less` : `৳ ${Math.abs(totalDifference)} more`} than the total (৳ {expense.total}).
              </span>
            </div>
          )}
        </div>

        {/* Helpful reminder note banner */}
        <div className="bg-[#FAF8F3] border border-[#E8E2D5] rounded-2xl p-3.5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#1E3932] shrink-0 mt-0.5" />
          <p className="text-xs text-[#526057] leading-relaxed">
            {expense.is_recurring
              ? 'This is a recurring bill. ThikThak will automatically track balances and remind everyone before the due date.'
              : 'All balances will be updated immediately. Roommates will see this in their activity ledger.'}
          </p>
        </div>
      </div>

      {/* Bottom action button */}
      {!readOnly && onConfirm && (
        <div className="p-5 bg-white border-t border-[#E8E2D5] sticky bottom-0">
          <button
            onClick={() => onConfirm({ ...expense, splits })}
            className="w-full py-3.5 rounded-full bg-[#1E3932] text-white font-heading font-semibold text-sm hover:bg-[#152722] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <Check className="w-4 h-4" />
            Confirm & Save Expense
          </button>
        </div>
      )}
    </div>
  );
};
