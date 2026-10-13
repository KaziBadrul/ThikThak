import { Expense, Member, Reminder, Household, BalancePair, ChatMessage } from '../types';

const API_BASE = '/api';

export async function fetchHousehold(): Promise<Household> {
  const res = await fetch(`${API_BASE}/household`);
  if (!res.ok) throw new Error('Failed to fetch household');
  return res.json();
}

export async function addMember(name: string, email?: string): Promise<Member> {
  const res = await fetch(`${API_BASE}/household/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error('Failed to add member');
  return res.json();
}

export async function deleteMember(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/household/members/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete member');
}

export async function fetchExpenses(): Promise<Expense[]> {
  const res = await fetch(`${API_BASE}/expenses`);
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
}

export async function createExpense(data: Partial<Expense>): Promise<Expense> {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save expense');
  return res.json();
}

export async function deleteExpense(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete expense');
}

export async function fetchBalances(): Promise<BalancePair[]> {
  const res = await fetch(`${API_BASE}/balances`);
  if (!res.ok) throw new Error('Failed to fetch balances');
  return res.json();
}

export async function settleDebt(from: string, to: string, amount: number): Promise<void> {
  const res = await fetch(`${API_BASE}/settle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, amount }),
  });
  if (!res.ok) throw new Error('Failed to settle balance');
}

export async function fetchReminders(): Promise<Reminder[]> {
  const res = await fetch(`${API_BASE}/reminders`);
  if (!res.ok) throw new Error('Failed to fetch reminders');
  return res.json();
}

export async function sendReminder(id: string, message?: string): Promise<Reminder> {
  const res = await fetch(`${API_BASE}/reminders/${id}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Failed to send reminder');
  return res.json();
}

export async function createReminder(data: Partial<Reminder>): Promise<Reminder> {
  const res = await fetch(`${API_BASE}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create reminder');
  return res.json();
}

export async function fetchChats(): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/chats`);
  if (!res.ok) throw new Error('Failed to fetch chats');
  return res.json();
}

export async function sendChatMessage(text: string, sender: 'user' | 'ai' | 'roommate' = 'user', senderName = 'You'): Promise<ChatMessage> {
  const res = await fetch(`${API_BASE}/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sender, senderName }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

// ---------------------------------------------
// AI ENDPOINTS (GEMINI)
// ---------------------------------------------

export interface ParsedReceipt {
  merchant: string;
  date: string | null;
  currency: string;
  line_items: Array<{ name: string; amount: number }>;
  total: number;
  confidence: 'high' | 'medium' | 'low';
  warning?: string;
}

export async function parseReceiptWithAI(imageBase64: string, mimeType = 'image/jpeg'): Promise<ParsedReceipt> {
  const res = await fetch(`${API_BASE}/ai/parse-receipt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to parse receipt with Gemini');
  }
  return res.json();
}

export interface SplitCalculationResult {
  splits: Array<{ name: string; owes: number; owes_to: string }>;
  note: string;
}

export async function calculateSplitWithAI(params: {
  total: number;
  currency?: string;
  paid_by: string;
  roommates: string[];
  split_rule?: any;
}): Promise<SplitCalculationResult> {
  const res = await fetch(`${API_BASE}/ai/calculate-split`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Failed to calculate split with Gemini');
  }
  return res.json();
}

export async function draftReminderWithAI(params: {
  owed_by: string;
  owed_to?: string;
  amount: number;
  currency?: string;
  days_overdue: number;
  tone?: 'gentle' | 'firm';
}): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/ai/draft-reminder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Failed to draft reminder with Gemini');
  }
  return res.json();
}

export async function mediateWithAI(message: string, householdMembers: string[], history: any[]): Promise<{
  reply: string;
  suggestedActions?: Array<{ label: string; action: string }>;
}> {
  const res = await fetch(`${API_BASE}/ai/mediate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, householdMembers, history }),
  });
  if (!res.ok) {
    throw new Error('Failed to get mediation advice');
  }
  return res.json();
}

export async function resetDatabase(): Promise<void> {
  await fetch(`${API_BASE}/reset-data`, { method: 'POST' });
}
