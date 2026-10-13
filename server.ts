import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser with 25mb limit for receipt photos
app.use(express.json({ limit: '25mb' }));

// Lazy Gemini client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

// Database directory & persistent file
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'thikthak-db.json');

interface DatabaseSchema {
  household: {
    id: string;
    name: string;
    code: string;
    currency: string;
    members: Array<{
      id: string;
      name: string;
      email: string;
      avatarColor: string;
      initials: string;
      isCurrentUser?: boolean;
      joined_at: string;
    }>;
  };
  expenses: Array<{
    id: string;
    merchant: string;
    category: string;
    is_recurring: boolean;
    date: string;
    currency: string;
    total: number;
    line_items: Array<{ name: string; amount: number }>;
    paid_by: string;
    split_rule: any;
    splits: Array<{ name: string; owes: number; owes_to: string }>;
    confidence?: 'high' | 'medium' | 'low';
    notes?: string;
    receipt_image?: string;
    created_at: string;
  }>;
  balances: Array<{
    id: string;
    from: string;
    to: string;
    amount: number;
    currency: string;
    last_updated: string;
  }>;
  reminders: Array<{
    id: string;
    title: string;
    category: string;
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
  }>;
  chats: Array<{
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
  }>;
}

function getDefaultDatabase(): DatabaseSchema {
  return {
    household: {
      id: 'green-house-1',
      name: 'Green House',
      code: '12C, IUT',
      currency: 'BDT',
      members: [
        {
          id: 'm1',
          name: 'You',
          email: 'kazibadrul@iut.ac.bd',
          avatarColor: '#1E3932',
          initials: 'You',
          isCurrentUser: true,
          joined_at: '2026-01-10',
        },
        {
          id: 'm2',
          name: 'Rafid',
          email: 'rafid@iut.ac.bd',
          avatarColor: '#5C6BC0',
          initials: 'RA',
          isCurrentUser: false,
          joined_at: '2026-01-10',
        },
        {
          id: 'm3',
          name: 'Samiha',
          email: 'samiha@iut.ac.bd',
          avatarColor: '#EC407A',
          initials: 'SA',
          isCurrentUser: false,
          joined_at: '2026-01-12',
        },
        {
          id: 'm4',
          name: 'Tarek',
          email: 'tarek@iut.ac.bd',
          avatarColor: '#FB8C00',
          initials: 'TA',
          isCurrentUser: false,
          joined_at: '2026-01-15',
        },
      ],
    },
    expenses: [
      {
        id: 'exp-1',
        merchant: 'Electricity Bill',
        category: 'utilities',
        is_recurring: true,
        date: '2026-04-01',
        currency: 'BDT',
        total: 1200,
        line_items: [
          { name: 'Base units usage', amount: 950 },
          { name: 'Demand charge & tax', amount: 250 },
        ],
        paid_by: 'You',
        split_rule: 'equal',
        splits: [
          { name: 'Rafid', owes: 300, owes_to: 'You' },
          { name: 'Samiha', owes: 300, owes_to: 'You' },
          { name: 'Tarek', owes: 300, owes_to: 'You' },
        ],
        confidence: 'high',
        notes: 'Monthly DESCO electricity bill for 12C.',
        created_at: new Date('2026-04-01T10:00:00Z').toISOString(),
      },
      {
        id: 'exp-2',
        merchant: 'Grocery',
        category: 'groceries',
        is_recurring: false,
        date: '2026-03-28',
        currency: 'BDT',
        total: 850,
        line_items: [
          { name: 'Eggs (2 dozen)', amount: 310 },
          { name: 'Cooking Oil (2L)', amount: 380 },
          { name: 'Salt & spices', amount: 160 },
        ],
        paid_by: 'Rafid',
        split_rule: 'equal',
        splits: [
          { name: 'You', owes: 212.5, owes_to: 'Rafid' },
          { name: 'Samiha', owes: 212.5, owes_to: 'Rafid' },
          { name: 'Tarek', owes: 212.5, owes_to: 'Rafid' },
        ],
        confidence: 'high',
        notes: 'Bought from Shwapno supermarket.',
        created_at: new Date('2026-03-28T14:30:00Z').toISOString(),
      },
      {
        id: 'exp-3',
        merchant: 'Room Rent',
        category: 'rent',
        is_recurring: true,
        date: '2026-03-25',
        currency: 'BDT',
        total: 6000,
        line_items: [{ name: 'Apartment advance portion', amount: 6000 }],
        paid_by: 'You',
        split_rule: 'equal',
        splits: [
          { name: 'Rafid', owes: 1500, owes_to: 'You' },
          { name: 'Samiha', owes: 1500, owes_to: 'You' },
          { name: 'Tarek', owes: 1500, owes_to: 'You' },
        ],
        confidence: 'high',
        notes: 'Paid via bKash to landlord.',
        created_at: new Date('2026-03-25T09:00:00Z').toISOString(),
      },
      {
        id: 'exp-4',
        merchant: 'Internet Bill',
        category: 'internet',
        is_recurring: true,
        date: '2026-03-15',
        currency: 'BDT',
        total: 1100,
        line_items: [{ name: '50 Mbps Fiber line', amount: 1100 }],
        paid_by: 'Samiha',
        split_rule: 'equal',
        splits: [
          { name: 'You', owes: 275, owes_to: 'Samiha' },
          { name: 'Rafid', owes: 275, owes_to: 'Samiha' },
          { name: 'Tarek', owes: 275, owes_to: 'Samiha' },
        ],
        confidence: 'high',
        notes: 'Amber IT monthly bill.',
        created_at: new Date('2026-03-15T11:00:00Z').toISOString(),
      },
      {
        id: 'exp-5',
        merchant: 'Kitchen Supplies',
        category: 'groceries',
        is_recurring: false,
        date: '2026-03-10',
        currency: 'BDT',
        total: 640,
        line_items: [
          { name: 'Dishwash liquid & sponge', amount: 240 },
          { name: 'Garbage bags roll', amount: 200 },
          { name: 'Kitchen towels', amount: 200 },
        ],
        paid_by: 'You',
        split_rule: 'equal',
        splits: [
          { name: 'Rafid', owes: 160, owes_to: 'You' },
          { name: 'Samiha', owes: 160, owes_to: 'You' },
          { name: 'Tarek', owes: 160, owes_to: 'You' },
        ],
        confidence: 'high',
        notes: 'Shared supplies for the kitchen.',
        created_at: new Date('2026-03-10T16:00:00Z').toISOString(),
      },
      {
        id: 'exp-6',
        merchant: 'Transport',
        category: 'transport',
        is_recurring: false,
        date: '2026-03-05',
        currency: 'BDT',
        total: 380,
        line_items: [{ name: 'Shared Uber home from bazaar', amount: 380 }],
        paid_by: 'Tarek',
        split_rule: 'equal',
        splits: [
          { name: 'You', owes: 95, owes_to: 'Tarek' },
          { name: 'Rafid', owes: 95, owes_to: 'Tarek' },
          { name: 'Samiha', owes: 95, owes_to: 'Tarek' },
        ],
        confidence: 'high',
        notes: 'Shared ride with groceries.',
        created_at: new Date('2026-03-05T18:45:00Z').toISOString(),
      },
    ],
    balances: [],
    reminders: [
      {
        id: 'rem-1',
        title: 'Internet Bill',
        category: 'internet',
        owed_by: 'Tarek',
        owed_to: 'Samiha',
        amount: 1100,
        currency: 'BDT',
        due_date: '2026-04-05',
        days_overdue: 4,
        message: 'Hey Tarek! Just dropping a quick ping for the Amber IT internet bill (৳ 1,100). Whenever you get a chance to bKash it over, that’d be awesome!',
        sent_at: null,
        status: 'upcoming',
        tone: 'gentle',
        is_recurring: true,
      },
      {
        id: 'rem-2',
        title: 'Room Rent',
        category: 'rent',
        owed_by: 'Rafid',
        owed_to: 'You',
        amount: 1500,
        currency: 'BDT',
        due_date: '2026-04-08',
        days_overdue: 1,
        message: 'Hey Rafid! Hope classes are going well. Just a gentle nudge regarding the room rent portion (৳ 1,500). Let me know once sent!',
        sent_at: null,
        status: 'upcoming',
        tone: 'gentle',
        is_recurring: true,
      },
      {
        id: 'rem-3',
        title: 'Electricity Bill',
        category: 'utilities',
        owed_by: 'Tarek',
        owed_to: 'You',
        amount: 300,
        currency: 'BDT',
        due_date: '2026-04-12',
        days_overdue: 8,
        message: 'Hi Tarek, following up on the electricity bill from April (৳ 300). It is now overdue — please clear this via bKash today so we can finalize the month ledger.',
        sent_at: null,
        status: 'overdue',
        tone: 'firm',
        is_recurring: true,
      },
      {
        id: 'rem-4',
        title: 'Water Bill',
        category: 'water',
        owed_by: 'All Roommates',
        owed_to: 'You',
        amount: 450,
        currency: 'BDT',
        due_date: '2026-04-15',
        days_overdue: 0,
        message: 'Hey everyone, water supply bill for 12C is ৳ 450 (৳ 112.50 each). Please send before April 15!',
        sent_at: null,
        status: 'upcoming',
        tone: 'gentle',
        is_recurring: true,
      },
    ],
    chats: [
      {
        id: 'msg-1',
        sender: 'roommate',
        senderName: 'Samiha',
        text: "I think Tarek used more electricity this month. He's always home during the day with the AC running...",
        timestamp: '10:24 PM',
      },
      {
        id: 'msg-2',
        sender: 'ai',
        senderName: 'ThikThak',
        text: "I've checked the shared usage history and daytime hours. A fair adjustment would be: Tarek +৳ 90, and Rafid, Samiha, & You -৳ 30 each. Would you like me to suggest this revised split to the group or send a friendly text to Tarek?",
        timestamp: '10:25 PM',
        actionButtons: [
          { label: 'Send Message', action: 'send_message', payload: { recipient: 'Tarek' } },
          { label: 'Suggest New Split', action: 'apply_split', payload: { tarekDiff: 90, othersDiff: -30 } },
        ],
      },
    ],
  };
}

// Recalculate pair balances from expenses
function recalculateBalances(expenses: DatabaseSchema['expenses']): DatabaseSchema['balances'] {
  // Map of "from|to" -> amount
  const netMap = new Map<string, number>();

  for (const exp of expenses) {
    for (const split of exp.splits) {
      if (split.owes > 0 && split.name !== split.owes_to) {
        const debtor = split.name;
        const creditor = split.owes_to;
        const pairKey = `${debtor}-->${creditor}`;
        const reverseKey = `${creditor}-->${debtor}`;

        if (netMap.has(reverseKey)) {
          const revAmount = netMap.get(reverseKey)!;
          if (revAmount >= split.owes) {
            netMap.set(reverseKey, revAmount - split.owes);
          } else {
            netMap.delete(reverseKey);
            netMap.set(pairKey, split.owes - revAmount);
          }
        } else {
          const current = netMap.get(pairKey) || 0;
          netMap.set(pairKey, current + split.owes);
        }
      }
    }
  }

  const result: DatabaseSchema['balances'] = [];
  let index = 1;
  for (const [key, amount] of netMap.entries()) {
    if (amount > 0.01) {
      const [from, to] = key.split('-->');
      result.push({
        id: `bal-${index++}`,
        from,
        to,
        amount: Math.round(amount * 100) / 100,
        currency: 'BDT',
        last_updated: new Date().toISOString(),
      });
    }
  }
  return result;
}

// Load / Save DB
function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initDb = getDefaultDatabase();
      initDb.balances = recalculateBalances(initDb.expenses);
      fs.writeFileSync(DB_FILE, JSON.stringify(initDb, null, 2), 'utf-8');
      return initDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(data) as DatabaseSchema;
    if (!db.balances || db.balances.length === 0) {
      db.balances = recalculateBalances(db.expenses);
    }
    return db;
  } catch (err) {
    console.error('Error reading database, resetting to defaults:', err);
    const initDb = getDefaultDatabase();
    initDb.balances = recalculateBalances(initDb.expenses);
    return initDb;
  }
}

function writeDb(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db.balances = recalculateBalances(db.expenses);
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// 2. Get household info + members
app.get('/api/household', (req, res) => {
  const db = readDb();
  res.json(db.household);
});

// Update household info
app.patch('/api/household', (req, res) => {
  const db = readDb();
  const { name, code, currency } = req.body;
  if (name) db.household.name = name;
  if (code) db.household.code = code;
  if (currency) db.household.currency = currency;
  writeDb(db);
  res.json(db.household);
});

// Add member
app.post('/api/household/members', (req, res) => {
  const db = readDb();
  const { name, email } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const colors = ['#5C6BC0', '#EC407A', '#FB8C00', '#26A69A', '#AB47BC', '#7E57C2'];
  const initials = name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const newMember = {
    id: `m-${Date.now()}`,
    name,
    email: email || `${name.toLowerCase().replace(/\s+/g, '')}@shared.house`,
    avatarColor: colors[db.household.members.length % colors.length],
    initials,
    isCurrentUser: false,
    joined_at: new Date().toISOString().split('T')[0],
  };

  db.household.members.push(newMember);
  writeDb(db);
  res.status(201).json(newMember);
});

// Delete member
app.delete('/api/household/members/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.household.members = db.household.members.filter((m) => m.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// 3. Get all expenses
app.get('/api/expenses', (req, res) => {
  const db = readDb();
  res.json(db.expenses);
});

// Add new expense
app.post('/api/expenses', (req, res) => {
  const db = readDb();
  const {
    merchant,
    category = 'other',
    is_recurring = false,
    date = new Date().toISOString().split('T')[0],
    currency = 'BDT',
    total,
    line_items = [],
    paid_by,
    split_rule = 'equal',
    splits = [],
    confidence = 'high',
    notes = '',
    receipt_image,
  } = req.body;

  if (!merchant || typeof total !== 'number' || !paid_by) {
    return res.status(400).json({ error: 'Merchant, total, and paid_by are required.' });
  }

  const newExpense = {
    id: `exp-${Date.now()}`,
    merchant,
    category,
    is_recurring: Boolean(is_recurring),
    date,
    currency,
    total: Math.round(total * 100) / 100,
    line_items,
    paid_by,
    split_rule,
    splits,
    confidence,
    notes,
    receipt_image,
    created_at: new Date().toISOString(),
  };

  db.expenses.unshift(newExpense);
  writeDb(db);
  res.status(201).json(newExpense);
});

// Delete expense
app.delete('/api/expenses/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.expenses = db.expenses.filter((e) => e.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// 4. Get balances
app.get('/api/balances', (req, res) => {
  const db = readDb();
  res.json(db.balances);
});

// Settle balance between roommates
app.post('/api/settle', (req, res) => {
  const db = readDb();
  const { from, to, amount, currency = 'BDT' } = req.body;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'from, to, and amount are required' });
  }

  // Create a settlement record in expenses
  const settlementExpense = {
    id: `settle-${Date.now()}`,
    merchant: `Settlement: ${from} paid ${to}`,
    category: 'other',
    is_recurring: false,
    date: new Date().toISOString().split('T')[0],
    currency,
    total: Number(amount),
    line_items: [{ name: `Settlement payment`, amount: Number(amount) }],
    paid_by: from,
    split_rule: 'custom',
    splits: [{ name: to, owes: 0, owes_to: from }],
    confidence: 'high' as const,
    notes: `Debt settlement between ${from} and ${to}`,
    created_at: new Date().toISOString(),
  };

  // Adjust existing splits by recording negative settlement or reducing balances
  // Specifically: from paid to, meaning from's debt to to is reduced by amount
  // We can add a counter-split: "to" owes "from" amount to cancel it out!
  settlementExpense.splits = [
    { name: to, owes: Number(amount), owes_to: from }
  ];

  db.expenses.unshift(settlementExpense);
  writeDb(db);
  res.json({ success: true, balances: db.balances });
});

// 5. Get reminders
app.get('/api/reminders', (req, res) => {
  const db = readDb();
  res.json(db.reminders);
});

// Add reminder
app.post('/api/reminders', (req, res) => {
  const db = readDb();
  const {
    title,
    category = 'utilities',
    owed_by,
    owed_to = 'You',
    amount,
    currency = 'BDT',
    due_date = new Date().toISOString().split('T')[0],
    days_overdue = 0,
    message = '',
    tone = 'gentle',
    is_recurring = false,
  } = req.body;

  const newReminder = {
    id: `rem-${Date.now()}`,
    title: title || 'Payment Reminder',
    category,
    owed_by,
    owed_to,
    amount: Number(amount),
    currency,
    due_date,
    days_overdue: Number(days_overdue),
    message,
    sent_at: null,
    status: (days_overdue > 0 ? 'overdue' : 'upcoming') as 'upcoming' | 'overdue',
    tone,
    is_recurring: Boolean(is_recurring),
  };

  db.reminders.unshift(newReminder);
  writeDb(db);
  res.status(201).json(newReminder);
});

// Mark reminder as sent
app.post('/api/reminders/:id/send', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { message } = req.body;
  const reminder = db.reminders.find((r) => r.id === id);
  if (reminder) {
    reminder.status = 'sent';
    reminder.sent_at = new Date().toISOString();
    if (message) reminder.message = message;
    writeDb(db);
    return res.json(reminder);
  }
  res.status(404).json({ error: 'Reminder not found' });
});

// 6. AI Mediator Chat messages
app.get('/api/chats', (req, res) => {
  const db = readDb();
  res.json(db.chats);
});

app.post('/api/chats', (req, res) => {
  const db = readDb();
  const { sender = 'user', senderName = 'You', text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const userMsg = {
    id: `msg-${Date.now()}`,
    sender: sender as 'user' | 'ai' | 'roommate',
    senderName,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  db.chats.push(userMsg);
  writeDb(db);
  res.status(201).json(userMsg);
});

// Reset database to default seed
app.post('/api/reset-data', (req, res) => {
  const initDb = getDefaultDatabase();
  initDb.balances = recalculateBalances(initDb.expenses);
  writeDb(initDb);
  res.json({ success: true, data: initDb });
});

// -------------------------------------------------------------
// GEMINI AI ENDPOINTS
// -------------------------------------------------------------

// 1. RECEIPT PARSING (Multimodal)
app.post('/api/ai/parse-receipt', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
    const client = getGeminiClient();

    if (!client) {
      // Graceful fallback mock if no API key is available
      return res.json({
        merchant: 'Shwapno Supermarket',
        date: new Date().toISOString().split('T')[0],
        currency: 'BDT',
        line_items: [
          { name: 'Fresh Milk 1L', amount: 95 },
          { name: 'Eggs 1 Dozen', amount: 155 },
          { name: 'Basmati Rice 2kg', amount: 260 },
          { name: 'Dishwashing Gel', amount: 130 },
        ],
        total: 640,
        confidence: 'medium',
        warning: 'Gemini API key not configured, provided smart estimated extract.',
      });
    }

    const systemInstruction = `You are a receipt-parsing assistant for a bill-splitting app. You will
receive a photo of a receipt or bill. Extract the following information
and return ONLY valid JSON, no markdown fences, no explanation.

Schema:
{
  "merchant": string,
  "date": string (YYYY-MM-DD, or null if not visible),
  "currency": string (3-letter code, guess BDT if ambiguous and receipt looks local),
  "line_items": [ { "name": string, "amount": number } ],
  "total": number,
  "confidence": "high" | "medium" | "low"
}

Rules:
- If the image is blurry or a field is unreadable, set confidence to "low" and use your best guess rather than failing.
- Do not invent line items that aren't visible.
- If only a total is visible with no itemization, return an empty line_items array and just populate total.
- Never return prose — JSON only.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: 'Parse this receipt according to the required schema.',
            },
          ],
        },
      ],
    });

    const responseText = response.text || '';
    let parsedData;
    try {
      // Remove any leftover markdown formatting if present
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse Gemini receipt response:', responseText);
      return res.status(422).json({
        error: 'Unable to parse receipt image. Please enter manually.',
        raw: responseText,
      });
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini receipt parsing error:', error);
    return res.status(500).json({
      error: 'Receipt parsing failed. Please check the image or enter manually.',
      details: error.message,
    });
  }
});

// 2. SPLIT CALCULATION (Text-only)
app.post('/api/ai/calculate-split', async (req, res) => {
  try {
    const { total, currency = 'BDT', paid_by, roommates = [], split_rule = 'equal' } = req.body;

    if (typeof total !== 'number' || !paid_by || roommates.length === 0) {
      return res.status(400).json({ error: 'Missing total, paid_by, or roommates list.' });
    }

    const client = getGeminiClient();

    // Deterministic fallback if Gemini client is unavailable or returns an error
    const calculateLocalSplit = () => {
      const otherRoommates = roommates.filter((r: string) => r !== paid_by);
      if (otherRoommates.length === 0) {
        return { splits: [], note: 'Only payer was selected in split.' };
      }
      const totalParticipants = roommates.length;
      const perPerson = Math.round((total / totalParticipants) * 100) / 100;
      let totalCalculated = 0;
      const splits = otherRoommates.map((name: string, i: number) => {
        let owes = perPerson;
        if (i === 0) {
          // Adjust cents
          const leftover = Math.round((total - perPerson * totalParticipants) * 100) / 100;
          owes += leftover;
        }
        totalCalculated += owes;
        return {
          name,
          owes: Math.round(owes * 100) / 100,
          owes_to: paid_by,
        };
      });
      return {
        splits,
        note: `Split evenly across ${totalParticipants} roommates (৳ ${perPerson.toFixed(2)} each).`,
      };
    };

    if (!client) {
      return res.json(calculateLocalSplit());
    }

    const systemInstruction = `You are a bill-splitting calculator. You will receive a JSON payload
describing an expense and a list of roommates. Return ONLY valid JSON.

Input shape you will receive:
{
  "total": number,
  "currency": string,
  "paid_by": string,
  "roommates": [string],
  "split_rule": "equal" | { "custom": { "<name>": percentage } }
}

Output schema:
{
  "splits": [ { "name": string, "owes": number, "owes_to": string } ],
  "note": string
}

Rules:
- "equal" splits the total evenly across all roommates EXCLUDING the payer, who is owed the full share back.
- Round to 2 decimal places. If rounding leaves a remainder, add the leftover cents to whichever split is largest, don't drop it silently.
- If custom percentages don't sum to 100, still compute the best-effort split but say so in "note".`;

    const inputPayload = {
      total,
      currency,
      paid_by,
      roommates,
      split_rule,
    };

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: JSON.stringify(inputPayload) }],
        },
      ],
    });

    const responseText = response.text || '';
    let parsedData;
    try {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn('Gemini split calculation JSON parse failed, using fallback calculation:', parseErr);
      parsedData = calculateLocalSplit();
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini split calculation error:', error);
    // Fallback safely so user can continue
    const { total = 0, paid_by = 'You', roommates = [] } = req.body;
    const others = roommates.filter((r: string) => r !== paid_by);
    const count = roommates.length || 1;
    const perPerson = Math.round((total / count) * 100) / 100;
    return res.json({
      splits: others.map((name: string) => ({ name, owes: perPerson, owes_to: paid_by })),
      note: 'Calculated using standard equal split.',
    });
  }
});

// 3. REMINDER DRAFTING (Text-only)
app.post('/api/ai/draft-reminder', async (req, res) => {
  try {
    const {
      owed_by,
      owed_to = 'You',
      amount,
      currency = 'BDT',
      days_overdue = 0,
      tone = days_overdue >= 7 ? 'firm' : 'gentle',
    } = req.body;

    if (!owed_by || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Missing owed_by or amount.' });
    }

    const client = getGeminiClient();

    // Fallback template message
    const getFallbackMessage = () => {
      if (tone === 'firm' || days_overdue >= 7) {
        return `Hi ${owed_by}, following up on the ${currency} ${amount} shared bill from ${days_overdue} days ago. Please clear this via bKash today so we can keep the house expenses balanced.`;
      }
      return `Hey ${owed_by}! Hope you are having a good week. Whenever you have a second, could you send over the ${currency} ${amount} for our shared bill? Thanks a bunch!`;
    };

    if (!client) {
      return res.json({ message: getFallbackMessage() });
    }

    const systemInstruction = `You draft short, warm, non-confrontational payment reminders between
roommates who share expenses. You will receive a JSON payload. Return
ONLY valid JSON.

Input shape:
{
  "owed_by": string,
  "owed_to": string,
  "amount": number,
  "currency": string,
  "days_overdue": number,
  "tone": "gentle" | "firm"
}

Output schema:
{ "message": string }

Rules:
- Message must be under 280 characters, sound like a text a friend would actually send, and never sound automated or robotic.
- Never mention "AI," "assistant," or that this was generated.
- "gentle" tone (days_overdue < 7): casual, low-pressure, can include a light joke.
- "firm" tone (days_overdue >= 7): still polite, but direct about the amount and timeframe, no jokes.
- Address the person by name.`;

    const inputPayload = {
      owed_by,
      owed_to,
      amount,
      currency,
      days_overdue: Number(days_overdue),
      tone,
    };

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: JSON.stringify(inputPayload) }],
        },
      ],
    });

    const responseText = response.text || '';
    let parsedData;
    try {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleaned);
    } catch (err) {
      parsedData = { message: getFallbackMessage() };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini reminder drafting error:', error);
    const { owed_by = 'Roommate', amount = 0, currency = 'BDT' } = req.body;
    return res.json({
      message: `Hey ${owed_by}! Just a quick friendly nudge for the ${currency} ${amount} shared bill when you get a chance. Thank you!`,
    });
  }
});

// 4. AI MEDIATOR CHAT (Roommate dispute resolution assistant)
app.post('/api/ai/mediate', async (req, res) => {
  try {
    const { message, householdMembers = [], history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const client = getGeminiClient();

    if (!client) {
      return res.json({
        reply: `I understand this concern. In shared flats, utility or grocery adjustments are common. A reasonable solution is to calculate the incremental difference (e.g. +15-25% for high individual usage) while keeping the base bill shared equally so everyone stays friendly.`,
        suggestedActions: [
          { label: 'Suggest Split Adjustment', action: 'suggest_split' },
          { label: 'Draft Group Poll', action: 'draft_poll' },
        ],
      });
    }

    const systemInstruction = `You are "ThikThak AI Mediator" — a calm, empathetic, neutral roommate dispute resolution mediator living in Dhaka / shared apartments.
Your role is to help roommates resolve conflicts over shared expenses (e.g., electricity, AC usage, who used more food, guest stays, kitchen supplies, internet speed) without drama.
Your tone:
- Warm, practical, fair, and de-escalating.
- Propose specific, fair mathematical adjustments with numbers when relevant.
- Offer actionable next steps like drafting a friendly message or updating the bill split.
- Keep answers concise (2-4 sentences max), conversational, and formatted cleanly.
- Never take sides aggressively; acknowledge everyone's perspective.
Always respond in JSON:
{
  "reply": string,
  "suggestedActions": [ { "label": string, "action": string } ]
}`;

    const promptText = `User message: "${message}"
Roommates in house: ${householdMembers.join(', ')}
Recent conversation: ${JSON.stringify(history.slice(-3))}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
        temperature: 0.6,
        responseMimeType: 'application/json',
      },
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
    });

    const cleaned = (response.text || '').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleaned);
    return res.json(result);
  } catch (err: any) {
    console.error('Mediation error:', err);
    return res.json({
      reply: `I can help mediate this! The best approach is discussing the shared bill calmly and either adjusting the percentage or agreeing on house usage guidelines.`,
      suggestedActions: [{ label: 'Propose Fair Split', action: 'suggest_split' }],
    });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC ASSET SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ThikThak server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start ThikThak server:', err);
});
