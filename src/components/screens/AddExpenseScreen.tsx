import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Upload, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Member, Expense } from '../../types';
import { parseReceiptWithAI, calculateSplitWithAI } from '../../services/api';

interface AddExpenseScreenProps {
  members: Member[];
  onBack: () => void;
  onProceedToReview: (expenseData: Partial<Expense>) => void;
}

export const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({
  members,
  onBack,
  onProceedToReview,
}) => {
  const [expenseType, setExpenseType] = useState<'one-time' | 'recurring'>('one-time');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('You');
  const [selectedRoommates, setSelectedRoommates] = useState<string[]>(
    members.map((m) => m.name)
  );
  const [notes, setNotes] = useState('');

  // AI Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<Array<{ name: string; amount: number }>>([]);
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('high');

  // Submitting / Split calculation state
  const [isCalculating, setIsCalculating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleRoommate = (name: string) => {
    if (selectedRoommates.includes(name)) {
      if (selectedRoommates.length > 1) {
        setSelectedRoommates(selectedRoommates.filter((n) => n !== name));
      }
    } else {
      setSelectedRoommates([...selectedRoommates, name]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setScanPreview(base64Data);
      setIsScanning(true);
      setScanError(null);

      try {
        const result = await parseReceiptWithAI(base64Data, file.type || 'image/jpeg');

        if (result.merchant) setTitle(result.merchant);
        if (result.total) setAmount(result.total.toString());
        if (result.line_items && result.line_items.length > 0) {
          setExtractedItems(result.line_items);
        }
        if (result.confidence) setConfidence(result.confidence);
      } catch (err: any) {
        console.error('Receipt parsing error:', err);
        setScanError('Could not automatically parse the receipt image. You can type details manually.');
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid title and amount.');
      return;
    }

    setIsCalculating(true);
    try {
      // Call Gemini split calculator
      const splitResult = await calculateSplitWithAI({
        total: numAmount,
        currency: 'BDT',
        paid_by: paidBy,
        roommates: selectedRoommates,
        split_rule: 'equal',
      });

      // Prepare expense partial and move to review screen
      const expenseDraft: Partial<Expense> = {
        merchant: title.trim(),
        total: numAmount,
        currency: 'BDT',
        is_recurring: expenseType === 'recurring',
        paid_by: paidBy,
        date: new Date().toISOString().split('T')[0],
        line_items: extractedItems,
        splits: splitResult.splits,
        confidence,
        notes: notes.trim(),
        receipt_image: scanPreview || undefined,
        category: getCategoryFromTitle(title),
      };

      onProceedToReview(expenseDraft);
    } catch (err) {
      console.error('Failed to calculate AI split:', err);
      // Fallback local equal split
      const totalParts = selectedRoommates.length;
      const perHead = Math.round((numAmount / totalParts) * 100) / 100;
      const splits = selectedRoommates
        .filter((r) => r !== paidBy)
        .map((name) => ({ name, owes: perHead, owes_to: paidBy }));

      onProceedToReview({
        merchant: title.trim(),
        total: numAmount,
        currency: 'BDT',
        is_recurring: expenseType === 'recurring',
        paid_by: paidBy,
        date: new Date().toISOString().split('T')[0],
        line_items: extractedItems,
        splits,
        confidence: 'high',
        notes: notes.trim(),
        receipt_image: scanPreview || undefined,
        category: getCategoryFromTitle(title),
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getCategoryFromTitle = (t: string): Expense['category'] => {
    const text = t.toLowerCase();
    if (text.includes('elect') || text.includes('gas') || text.includes('util')) return 'utilities';
    if (text.includes('groc') || text.includes('food') || text.includes('egg') || text.includes('rice')) return 'groceries';
    if (text.includes('rent') || text.includes('flat')) return 'rent';
    if (text.includes('net') || text.includes('wifi')) return 'internet';
    if (text.includes('uber') || text.includes('ride') || text.includes('transport')) return 'transport';
    return 'other';
  };

  return (
    <div
      id="screen-add-expense"
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
        <h2 className="text-base font-bold font-heading text-[#1E3932]">Add Expense</h2>
        <div className="w-9" />
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        {/* Toggle: One-time vs Recurring */}
        <div className="bg-[#EBE6DC] p-1 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => setExpenseType('one-time')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              expenseType === 'one-time'
                ? 'bg-white text-[#1E3932] shadow-xs'
                : 'text-[#526057] hover:text-[#1E3932]'
            }`}
          >
            One-time
          </button>
          <button
            type="button"
            onClick={() => setExpenseType('recurring')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              expenseType === 'recurring'
                ? 'bg-white text-[#1E3932] shadow-xs'
                : 'text-[#526057] hover:text-[#1E3932]'
            }`}
          >
            Recurring
          </button>
        </div>

        {/* AI Receipt Scanning Bar */}
        <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
          />

          {!scanPreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-[#1E3932]/25 hover:border-[#1E3932] bg-[#FAF8F3] flex items-center justify-center gap-2.5 text-xs font-semibold text-[#1E3932] transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#1E3932]" />
              <span>Photograph or Upload Receipt (Gemini Auto-Parse)</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E3932]">
                  <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                  <span>AI Receipt Parser</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setScanPreview(null);
                    setExtractedItems([]);
                  }}
                  className="text-xs text-[#8A958E] hover:text-red-600 underline cursor-pointer"
                >
                  Remove photo
                </button>
              </div>

              {isScanning ? (
                <div className="py-4 flex flex-col items-center justify-center gap-2 text-xs text-[#1E3932]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1E3932]" />
                  <span>Gemini is reading merchant, total & line items...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <img
                    src={scanPreview}
                    alt="Receipt preview"
                    className="w-16 h-16 object-cover rounded-xl border border-[#E8E2D5]"
                  />
                  <div className="text-xs text-[#526057]">
                    <p className="font-semibold text-[#1E3932]">Receipt extracted</p>
                    <p>{extractedItems.length} items detected</p>
                    <p className="text-[11px] text-[#3D7A4C] font-medium">
                      Review fields below before confirming
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {scanError && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-bold text-[#1E3932] mb-1.5">
            Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Grocery, Electricity, Internet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-2xl border border-[#E8E2D5] text-sm text-[#1E3932] placeholder-[#A0AAA2] focus:outline-none focus:border-[#1E3932] shadow-xs"
          />
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold text-[#1E3932] mb-1.5">
            Amount (৳)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-lg text-[#1E3932]">
              ৳
            </span>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-white rounded-2xl border border-[#E8E2D5] text-base font-bold text-[#1E3932] placeholder-[#A0AAA2] focus:outline-none focus:border-[#1E3932] shadow-xs"
            />
          </div>
        </div>

        {/* Paid by Selector */}
        <div>
          <label className="block text-xs font-bold text-[#1E3932] mb-1.5">
            Paid by
          </label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-2xl border border-[#E8E2D5] text-sm font-semibold text-[#1E3932] focus:outline-none focus:border-[#1E3932] shadow-xs cursor-pointer"
          >
            {members.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name} {m.isCurrentUser ? '(You)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Split between chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#1E3932]">
              Split between ({selectedRoommates.length} people)
            </label>
            <button
              type="button"
              onClick={() => setSelectedRoommates(members.map((m) => m.name))}
              className="text-xs text-[#1E3932] hover:underline"
            >
              Select all
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {members.map((m) => {
              const isSelected = selectedRoommates.includes(m.name);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleRoommate(m.name)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E3932] text-white shadow-xs'
                      : 'bg-white text-[#526057] border border-[#E8E2D5] hover:border-[#1E3932]'
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes (optional) */}
        <div>
          <label className="block text-xs font-bold text-[#1E3932] mb-1.5">
            Add notes (optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Bought from Shwapno supermarket..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 bg-white rounded-2xl border border-[#E8E2D5] text-xs text-[#1E3932] placeholder-[#A0AAA2] focus:outline-none focus:border-[#1E3932] shadow-xs resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isCalculating}
            className="w-full py-4 rounded-full bg-[#1E3932] text-white font-heading font-semibold text-sm hover:bg-[#152722] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Calculating Fair Split with Gemini...</span>
              </>
            ) : (
              <span>Add Expense & Review Split</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
