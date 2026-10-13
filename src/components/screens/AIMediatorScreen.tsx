import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, Send, Loader2, Bot, User, CheckCircle2 } from 'lucide-react';
import { ChatMessage, Member } from '../../types';
import { fetchChats, sendChatMessage, mediateWithAI } from '../../services/api';

interface AIMediatorScreenProps {
  members: Member[];
  onBack: () => void;
  onApplyAdjustment?: (adjustment: any) => void;
}

export const AIMediatorScreen: React.FC<AIMediatorScreenProps> = ({
  members,
  onBack,
  onApplyAdjustment,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadChats = async () => {
    try {
      const data = await fetchChats();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText('');
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Save user message to backend
      await sendChatMessage(text, 'user', 'You');

      // Call Gemini Mediator
      const memberNames = members.map((m) => m.name);
      const aiResponse = await mediateWithAI(text, memberNames, messages);

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        senderName: 'ThikThak',
        text: aiResponse.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: aiResponse.suggestedActions?.map((act) => ({
          label: act.label,
          action: act.action,
        })) || [
          { label: 'Send Message', action: 'send_message' },
          { label: 'Suggest New Split', action: 'suggest_split' },
        ],
      };

      setMessages((prev) => [...prev, aiMsg]);
      await sendChatMessage(aiResponse.reply, 'ai', 'ThikThak');
    } catch (err) {
      console.error('Failed AI mediation:', err);
      const fallbackAiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        senderName: 'ThikThak',
        text: 'I recommend discussing this in the group chat: consider calculating the difference based on shared receipts, or agreeing on a set monthly contribution for peace of mind.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: [{ label: 'Propose Fair Split', action: 'suggest_split' }],
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionButton = (btn: { label: string; action: string; payload?: any }) => {
    if (btn.action === 'send_message') {
      setActionDone('Friendly reminder message prepared for delivery.');
      setTimeout(() => setActionDone(null), 3500);
    } else if (btn.action === 'apply_split' || btn.action === 'suggest_split') {
      setActionDone('Suggested split logged to ledger.');
      if (onApplyAdjustment) {
        onApplyAdjustment(btn.payload || { note: 'AI Mediation adjustment' });
      }
      setTimeout(() => setActionDone(null), 3500);
    }
  };

  return (
    <div
      id="screen-ai-mediator"
      className="flex flex-col h-full max-w-md mx-auto bg-[#F8F6F0]"
    >
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-[#E8E2D5] bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-[#1E3932] hover:bg-black/5 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E5A93C]" />
              <h2 className="text-base font-bold font-heading text-[#1E3932]">AI Mediator</h2>
            </div>
            <p className="text-[11px] text-[#526057]">
              Here to help with disputes and keep things fair.
            </p>
          </div>
        </div>
      </div>

      {actionDone && (
        <div className="mx-4 mt-3 p-3 bg-[#EBF3E8] border border-[#C5DEC0] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#1E3932] animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#2E683C] shrink-0" />
          <span>{actionDone}</span>
        </div>
      )}

      {/* Chat messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[85%]">
                {!isUser && (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isAi ? 'bg-[#1E3932] text-white' : 'bg-pink-500 text-white'
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                )}

                <div
                  className={`rounded-2xl p-3.5 shadow-xs ${
                    isUser
                      ? 'bg-[#1E3932] text-white rounded-br-xs'
                      : isAi
                      ? 'bg-white border border-[#E8E2D5] text-[#1E3932] rounded-bl-xs'
                      : 'bg-white border border-[#E8E2D5] text-[#1E3932] rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span
                      className={`text-[11px] font-bold ${
                        isUser ? 'text-[#84B49F]' : isAi ? 'text-[#1E3932]' : 'text-pink-600'
                      }`}
                    >
                      {msg.senderName}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isUser ? 'text-white/60' : 'text-[#8A958E]'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>

              {/* Action buttons if attached to AI response */}
              {msg.actionButtons && msg.actionButtons.length > 0 && (
                <div className="mt-2.5 ml-9 flex flex-wrap gap-2">
                  {msg.actionButtons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionButton(btn)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                        idx === 0
                          ? 'bg-[#1E3932] text-white hover:bg-[#152722]'
                          : 'bg-white border border-[#1E3932] text-[#1E3932] hover:bg-[#FAF8F3]'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#526057] ml-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#1E3932]" />
            <span>ThikThak is weighing the dispute fairly...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom input */}
      <div className="p-3 bg-white border-t border-[#E8E2D5] sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask a question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-[#FAF8F3] rounded-full border border-[#E8E2D5] text-xs text-[#1E3932] placeholder-[#8A958E] focus:outline-none focus:border-[#1E3932]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-[#1E3932] text-white flex items-center justify-center hover:bg-[#152722] disabled:opacity-40 transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
