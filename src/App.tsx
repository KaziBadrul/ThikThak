import React, { useState, useEffect } from 'react';
import {
  fetchHousehold,
  fetchExpenses,
  fetchBalances,
  fetchReminders,
  createExpense,
} from './services/api';
import { Household, Member, Expense, BalancePair, Reminder } from './types';

// Screens
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { CreateJoinHomeScreen } from './components/screens/CreateJoinHomeScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { AddExpenseScreen } from './components/screens/AddExpenseScreen';
import { SplitDetailsModal } from './components/screens/SplitDetailsModal';
import { AIMediatorScreen } from './components/screens/AIMediatorScreen';
import { RemindersScreen } from './components/screens/RemindersScreen';
import { ExpensesHistoryScreen } from './components/screens/ExpensesHistoryScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { UpgradeScreen } from './components/screens/UpgradeScreen';

// Navigation
import { BottomNavigation, TabType } from './components/navigation/BottomNavigation';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation State
  const [onboarded, setOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('thikthak_onboarded') === 'true';
  });
  const [view, setView] = useState<'welcome' | 'create-join' | 'app'>('welcome');
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Sub-screens & modals
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [pendingExpenseReview, setPendingExpenseReview] = useState<Partial<Expense> | null>(null);
  const [selectedExpenseForView, setSelectedExpenseForView] = useState<Expense | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // App Data State
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<BalancePair[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [hData, eData, bData, rData] = await Promise.all([
        fetchHousehold(),
        fetchExpenses(),
        fetchBalances(),
        fetchReminders(),
      ]);

      setHousehold(hData);
      setMembers(hData.members || []);
      setExpenses(eData);
      setBalances(bData);
      setReminders(rData);
    } catch (err) {
      console.error('Error loading data:', err);
      // Fallback local initial state if server is still starting
      const defaultMembers: Member[] = [
        { id: 'm1', name: 'You', initials: 'KB', avatarColor: '#1E3932', email: 'kazibadrul@iut.ac.bd', isCurrentUser: true, joined_at: '2026-01-01' },
        { id: 'm2', name: 'Rafid', initials: 'RA', avatarColor: '#2D5046', email: 'rafid@mess.bd', joined_at: '2026-01-01' },
        { id: 'm3', name: 'Samiha', initials: 'SA', avatarColor: '#D97757', email: 'samiha@mess.bd', joined_at: '2026-01-01' },
        { id: 'm4', name: 'Tarek', initials: 'TA', avatarColor: '#5C5196', email: 'tarek@mess.bd', joined_at: '2026-01-01' },
      ];
      setHousehold({
        id: 'house-1',
        name: 'Green House',
        code: '12C, IUT',
        currency: 'BDT',
        members: defaultMembers,
        created_at: '2026-01-01',
      });
      setMembers(defaultMembers);
    } finally {
      setLoading(false);
    }
  };

  // Handle onboarding paths
  const handleGetStarted = () => {
    setView('create-join');
  };

  const handleAlreadyHaveAccount = () => {
    setOnboarded(true);
    localStorage.setItem('thikthak_onboarded', 'true');
    setView('app');
  };

  const handleCreateOrJoinComplete = (option: 'create' | 'join', data?: { name: string; code?: string }) => {
    if (data && household) {
      setHousehold({
        ...household,
        name: data.name || household.name,
        code: data.code || household.code,
      });
    }
    setOnboarded(true);
    localStorage.setItem('thikthak_onboarded', 'true');
    setView('app');
    showToast(`Welcome to ${data?.name || 'Green House'}!`);
  };

  // Handle saving new expense after Split Review
  const handleSaveExpense = async (expenseData: Partial<Expense>) => {
    try {
      await createExpense(expenseData);
      await loadAllData();
      setPendingExpenseReview(null);
      setShowAddExpense(false);
      showToast('Expense saved & balances updated!');
    } catch (err) {
      console.error('Failed to create expense:', err);
      alert('Could not save expense. Please check your network.');
    }
  };

  // Count pending reminders
  const pendingRemindersCount = reminders.filter((r) => r.status !== 'sent').length;

  if (loading && !household) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F6F0] p-6 text-[#1E3932]">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#1E3932]" />
        <p className="text-sm font-heading font-semibold">Loading ThikThak...</p>
      </div>
    );
  }

  // If user has not onboarded yet and on welcome view
  if (!onboarded && view === 'welcome') {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex flex-col justify-center selection:bg-[#1E3932] selection:text-white">
        <WelcomeScreen
          onGetStarted={handleGetStarted}
          onAlreadyHaveAccount={handleAlreadyHaveAccount}
        />
      </div>
    );
  }

  // If user clicked Get Started -> Create / Join screen
  if (!onboarded && view === 'create-join') {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex flex-col justify-center selection:bg-[#1E3932] selection:text-white">
        <CreateJoinHomeScreen
          onBack={() => setView('welcome')}
          onSelectOption={handleCreateOrJoinComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDE8DE] flex justify-center selection:bg-[#1E3932] selection:text-white antialiased">
      {/* Container simulating a mobile-first app frame with desktop centering */}
      <div className="w-full max-w-md min-h-screen bg-[#F8F6F0] shadow-2xl relative flex flex-col overflow-x-hidden">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm p-3.5 bg-[#1E3932] text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
            <CheckCircle2 className="w-4 h-4 text-[#84B49F] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal: Add Expense Screen (Screen 4) */}
        {showAddExpense && !pendingExpenseReview && (
          <div className="fixed inset-0 z-40 bg-[#F8F6F0] overflow-y-auto max-w-md mx-auto">
            <AddExpenseScreen
              members={members}
              onBack={() => setShowAddExpense(false)}
              onProceedToReview={(draft) => setPendingExpenseReview(draft)}
            />
          </div>
        )}

        {/* Modal: Split Review (Screen 5) */}
        {pendingExpenseReview && (
          <SplitDetailsModal
            expense={pendingExpenseReview}
            members={members}
            onClose={() => setPendingExpenseReview(null)}
            onConfirm={handleSaveExpense}
          />
        )}

        {/* Modal: View Split for Existing Expense */}
        {selectedExpenseForView && (
          <SplitDetailsModal
            expense={selectedExpenseForView}
            members={members}
            readOnly={true}
            onClose={() => setSelectedExpenseForView(null)}
          />
        )}

        {/* Modal: Upgrade Screen (Screen 10) */}
        {showUpgrade && (
          <div className="fixed inset-0 z-40 bg-[#F8F6F0] overflow-y-auto max-w-md mx-auto">
            <UpgradeScreen onBack={() => setShowUpgrade(false)} />
          </div>
        )}

        {/* Main Tab Screen Router */}
        <main className="flex-1">
          {currentTab === 'home' && (
            <HomeScreen
              household={household}
              members={members}
              expenses={expenses}
              balances={balances}
              onOpenAddExpense={() => setShowAddExpense(true)}
              onOpenExpensesList={() => setCurrentTab('expenses')}
              onOpenSettings={() => setCurrentTab('settings')}
              onSelectExpense={(exp) => setSelectedExpenseForView(exp)}
              onRefreshData={loadAllData}
            />
          )}

          {currentTab === 'expenses' && (
            <ExpensesHistoryScreen
              expenses={expenses}
              members={members}
              onBack={() => setCurrentTab('home')}
              onAddNew={() => setShowAddExpense(true)}
              onSelectExpense={(exp) => setSelectedExpenseForView(exp)}
            />
          )}

          {currentTab === 'mediator' && (
            <AIMediatorScreen
              members={members}
              onBack={() => setCurrentTab('home')}
              onApplyAdjustment={async () => {
                await loadAllData();
                showToast('Mediation adjustment reflected in balances.');
              }}
            />
          )}

          {currentTab === 'reminders' && (
            <RemindersScreen
              reminders={reminders}
              members={members}
              onBack={() => setCurrentTab('home')}
              onReminderUpdated={loadAllData}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              household={household}
              members={members}
              onBack={() => setCurrentTab('home')}
              onOpenUpgrade={() => setShowUpgrade(true)}
              onRefreshData={loadAllData}
            />
          )}
        </main>

        {/* Persistent Bottom Navigation (Screens 3, 6, 7, 8) */}
        <BottomNavigation
          currentTab={currentTab}
          onSelectTab={(t) => setCurrentTab(t)}
          pendingRemindersCount={pendingRemindersCount}
        />
      </div>
    </div>
  );
}
