import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react';
import { Expense, Member } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';

interface ExpensesHistoryScreenProps {
  expenses: Expense[];
  members: Member[];
  onBack: () => void;
  onSelectExpense: (expense: Expense) => void;
  onAddNew: () => void;
}

export const ExpensesHistoryScreen: React.FC<ExpensesHistoryScreenProps> = ({
  expenses,
  members,
  onBack,
  onSelectExpense,
  onAddNew,
}) => {
  const [filter, setFilter] = useState<'all' | 'you_owe' | 'owed_to_you'>('all');

  const filteredExpenses = expenses.filter((exp) => {
    const isPayer = exp.paid_by.toLowerCase() === 'you' || exp.paid_by.toLowerCase().includes('kazi');
    const userSplit = exp.splits.find(
      (s) => s.name.toLowerCase() === 'you' || s.name.toLowerCase().includes('kazi')
    );
    const userOwesInThis = userSplit ? userSplit.owes > 0 : false;

    if (filter === 'you_owe') {
      return !isPayer && userOwesInThis;
    }
    if (filter === 'owed_to_you') {
      return isPayer;
    }
    return true;
  });

  return (
    <div
      id="screen-expenses-history"
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
        <h2 className="text-base font-bold font-heading text-[#1E3932]">Expenses</h2>
        <button
          onClick={onAddNew}
          className="w-8 h-8 rounded-full bg-[#1E3932] text-white flex items-center justify-center hover:bg-[#152722] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Filter tabs: All | You owe | Owed to you */}
        <div className="bg-[#EBE6DC] p-1 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-[#1E3932] shadow-xs'
                : 'text-[#526057] hover:text-[#1E3932]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('you_owe')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'you_owe'
                ? 'bg-white text-[#1E3932] shadow-xs'
                : 'text-[#526057] hover:text-[#1E3932]'
            }`}
          >
            You owe
          </button>
          <button
            type="button"
            onClick={() => setFilter('owed_to_you')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'owed_to_you'
                ? 'bg-white text-[#1E3932] shadow-xs'
                : 'text-[#526057] hover:text-[#1E3932]'
            }`}
          >
            Owed to you
          </button>
        </div>

        {/* Expenses list */}
        <div className="space-y-2.5">
          {filteredExpenses.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#E8E2D5] text-center text-xs text-[#7A887E]">
              No expenses in this filter.
            </div>
          ) : (
            filteredExpenses.map((exp) => {
              const isPayer =
                exp.paid_by.toLowerCase() === 'you' || exp.paid_by.toLowerCase().includes('kazi');

              return (
                <div
                  key={exp.id}
                  onClick={() => onSelectExpense(exp)}
                  className="bg-white rounded-2xl p-3.5 border border-[#E8E2D5] flex items-center justify-between shadow-xs hover:border-[#1E3932]/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={exp.category || exp.merchant} size="md" />
                    <div>
                      <h3 className="text-sm font-bold font-heading text-[#1E3932] group-hover:text-[#152722]">
                        {exp.merchant}
                      </h3>
                      <p className="text-xs text-[#7A887E] mt-0.5">
                        {exp.date} {exp.is_recurring && '• Recurring'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <p className="text-sm font-bold font-heading text-[#1E3932]">
                        ৳ {exp.total.toLocaleString()}
                      </p>
                      <span
                        className={`text-[10px] font-semibold block ${
                          isPayer ? 'text-[#3D7A4C]' : 'text-[#C45E3D]'
                        }`}
                      >
                        {isPayer ? 'Owed to you' : 'You owe'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8A958E] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
