export interface Member {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
  isCurrentUser?: boolean;
  joined_at: string;
}

export interface LineItem {
  name: string;
  amount: number;
}

export interface SplitItem {
  name: string;
  owes: number;
  owes_to: string;
}

export interface Expense {
  id: string;
  merchant: string;
  category: 'utilities' | 'groceries' | 'rent' | 'internet' | 'transport' | 'other';
  is_recurring: boolean;
  date: string; // YYYY-MM-DD
  currency: string; // BDT
  total: number;
  line_items: LineItem[];
  paid_by: string; // Member name
  split_rule: 'equal' | { custom: Record<string, number> };
  splits: SplitItem[];
  confidence?: 'high' | 'medium' | 'low';
  notes?: string;
  receipt_image?: string;
  created_at: string;
}

export interface BalancePair {
  id: string;
  from: string; // Member who owes
  to: string;   // Member owed to
  amount: number;
  currency: string;
  last_updated: string;
}

export interface Reminder {
  id: string;
  title: string;
  category: 'utilities' | 'groceries' | 'rent' | 'internet' | 'water' | 'other';
  owed_by: string;
  owed_to: string;
  amount: number;
  currency: string;
  due_date: string;
  days_overdue: number;
  message: string;
  sent_at: string | null;
  status: 'upcoming' | 'overdue' | 'sent';
  tone?: 'gentle' | 'firm';
  is_recurring?: boolean;
}

export interface Household {
  id: string;
  name: string;
  code: string;
  currency: string;
  members: Member[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'roommate';
  senderName: string;
  text: string;
  timestamp: string;
  actionButtons?: Array<{
    label: string;
    action: string;
    payload?: any;
  }>;
}
