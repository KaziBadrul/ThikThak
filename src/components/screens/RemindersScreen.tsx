import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Sparkles,
  Loader2,
  Copy,
  Send,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { Reminder, Member } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { draftReminderWithAI, sendReminder } from '../../services/api';

interface RemindersScreenProps {
  reminders: Reminder[];
  members: Member[];
  onBack: () => void;
  onReminderUpdated: () => void;
}

export const RemindersScreen: React.FC<RemindersScreenProps> = ({
  reminders,
  members,
  onBack,
  onReminderUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'sent'>('upcoming');
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  // AI draft modal state
  const [draftTone, setDraftTone] = useState<'gentle' | 'firm'>('gentle');
  const [draftMessage, setDraftMessage] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const filteredList = reminders.filter((r) =>
    activeTab === 'upcoming' ? r.status !== 'sent' : r.status === 'sent'
  );

  const handleOpenDraftModal = async (reminder: Reminder) => {
    setSelectedReminder(reminder);
    const initialTone = reminder.days_overdue >= 7 ? 'firm' : 'gentle';
    setDraftTone(initialTone);
    setIsDrafting(true);

    try {
      const response = await draftReminderWithAI({
        owed_by: reminder.owed_by,
        owed_to: reminder.owed_to || 'You',
        amount: reminder.amount,
        currency: reminder.currency || 'BDT',
        days_overdue: reminder.days_overdue || 0,
        tone: initialTone,
      });
      setDraftMessage(response.message);
    } catch (err) {
      console.error('Failed to generate AI reminder:', err);
      setDraftMessage(
        reminder.message ||
          `Hey ${reminder.owed_by}! Just a quick friendly nudge for the ${reminder.currency} ${reminder.amount} for ${reminder.title}. Thank you!`
      );
    } finally {
      setIsDrafting(false);
    }
  };

  const handleToneChange = async (newTone: 'gentle' | 'firm') => {
    if (!selectedReminder) return;
    setDraftTone(newTone);
    setIsDrafting(true);

    try {
      const response = await draftReminderWithAI({
        owed_by: selectedReminder.owed_by,
        owed_to: selectedReminder.owed_to || 'You',
        amount: selectedReminder.amount,
        currency: selectedReminder.currency || 'BDT',
        days_overdue: selectedReminder.days_overdue || 0,
        tone: newTone,
      });
      setDraftMessage(response.message);
    } catch (err) {
      console.error('Error changing tone:', err);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleCopy = () => {
    if (!draftMessage) return;
    navigator.clipboard.writeText(draftMessage);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleConfirmSend = async () => {
    if (!selectedReminder) return;
    setIsSending(true);
    try {
      await sendReminder(selectedReminder.id, draftMessage);
      onReminderUpdated();
      setSelectedReminder(null);
    } catch (err) {
      console.error('Failed to send reminder:', err);
      alert('Failed to mark reminder as sent.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      id="screen-reminders"
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
        <h2 className="text-base font-bold font-heading text-[#1E3932]">Reminders</h2>
        <div className="w-9" />
      </div>

      <div className="p-5 space-y-4">
        {/* Filter tabs: Upcoming | Sent */}
        <div className="bg-[#EBE6DC] p-1 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-white text-[#1E3932] shadow-xs'
                : 'text-[#526057] hover:text-[#1E3932]'
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sent'
                ? 'bg-white text-[#1E3932] shadow-xs'
                : 'text-[#526057] hover:text-[#1E3932]'
            }`}
          >
            Sent
          </button>
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          {filteredList.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#E8E2D5] text-center text-xs text-[#7A887E]">
              No {activeTab} reminders found.
            </div>
          ) : (
            filteredList.map((rem) => (
              <div
                key={rem.id}
                onClick={() => handleOpenDraftModal(rem)}
                className="bg-white rounded-2xl p-3.5 border border-[#E8E2D5] flex items-center justify-between shadow-xs hover:border-[#1E3932]/40 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon category={rem.category || rem.title} size="md" />
                  <div>
                    <h3 className="text-sm font-bold font-heading text-[#1E3932]">
                      {rem.title}
                    </h3>
                    <p className="text-xs text-[#7A887E] mt-0.5">
                      Due {rem.due_date} {rem.is_recurring && '• Recurring'}
                    </p>
                    {rem.owed_by && (
                      <p className="text-[11px] text-[#3D7A4C] font-semibold mt-0.5">
                        Owed by {rem.owed_by}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold font-heading text-[#1E3932]">
                      ৳ {rem.amount.toLocaleString()}
                    </p>
                    {rem.days_overdue > 0 && rem.status !== 'sent' && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-sm">
                        {rem.days_overdue}d overdue
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDraftModal(rem);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      rem.status === 'sent'
                        ? 'bg-[#EBF3E8] text-[#2E683C]'
                        : 'bg-[#FAF8F3] hover:bg-[#1E3932] hover:text-white text-[#1E3932]'
                    }`}
                    title="Send reminder"
                  >
                    {rem.status === 'sent' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom banner matching wireframe */}
        <div className="bg-[#FAF8F3] border border-[#E8E2D5] rounded-3xl p-4 flex items-center gap-3.5 mt-6">
          <div className="w-10 h-10 rounded-full bg-[#1E3932] text-white flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <p className="text-xs text-[#526057] leading-relaxed">
            ThikThak will draft polite, friendly reminder messages so you never have to awkwardly ask a roommate for money.
          </p>
        </div>
      </div>

      {/* AI Reminder Drafting Modal */}
      {selectedReminder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E8E2D5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                <h3 className="text-base font-bold font-heading text-[#1E3932]">
                  Draft Friendly Reminder
                </h3>
              </div>
              <button
                onClick={() => setSelectedReminder(null)}
                className="text-xs text-[#8A958E] hover:text-[#1E3932] cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Bill info */}
            <div className="bg-[#FAF8F3] p-3 rounded-2xl border border-[#E8E2D5] flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-[#1E3932]">{selectedReminder.title}</p>
                <p className="text-[#7A887E]">To: {selectedReminder.owed_by}</p>
              </div>
              <div className="text-right font-extrabold text-sm text-[#1E3932]">
                ৳ {selectedReminder.amount.toLocaleString()}
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-[#1E3932] mb-1.5">
                Reminder Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleToneChange('gentle')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    draftTone === 'gentle'
                      ? 'bg-[#EBF3E8] border-[#3D7A4C] text-[#1E3932]'
                      : 'bg-white border-[#E8E2D5] text-[#526057]'
                  }`}
                >
                  🌱 Gentle (&lt; 7 days)
                </button>
                <button
                  type="button"
                  onClick={() => handleToneChange('firm')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    draftTone === 'firm'
                      ? 'bg-[#FBECE6] border-[#C45E3D] text-[#1E3932]'
                      : 'bg-white border-[#E8E2D5] text-[#526057]'
                  }`}
                >
                  ⚡ Firm (Overdue)
                </button>
              </div>
            </div>

            {/* AI Generated Message box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#1E3932]">
                  Message Preview (Editable)
                </label>
                <span className="text-[10px] text-[#8A958E]">
                  {draftMessage.length} / 280 chars
                </span>
              </div>

              {isDrafting ? (
                <div className="h-28 rounded-2xl bg-[#FAF8F3] border border-[#E8E2D5] flex flex-col items-center justify-center gap-2 text-xs text-[#526057]">
                  <Loader2 className="w-5 h-5 animate-spin text-[#1E3932]" />
                  <span>Gemini is tailoring a warm reminder...</span>
                </div>
              ) : (
                <textarea
                  rows={4}
                  value={draftMessage}
                  maxLength={280}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F3] rounded-2xl border border-[#E8E2D5] text-xs text-[#1E3932] focus:outline-none focus:border-[#1E3932] leading-relaxed resize-none"
                />
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 py-2.5 rounded-xl border border-[#D9D2C5] text-xs font-semibold text-[#1E3932] hover:bg-gray-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copySuccess ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(draftMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#075E54] text-xs font-semibold flex items-center justify-center gap-1 hover:bg-[#25D366]/25"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>

              <button
                type="button"
                disabled={isSending || isDrafting || !draftMessage}
                onClick={handleConfirmSend}
                className="w-full py-3 rounded-full bg-[#1E3932] text-white text-xs font-semibold hover:bg-[#152722] disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mark as Sent</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
