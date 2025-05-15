import React, { createContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Transaction, CategoryTotal } from '@/types';
import { EXPENSE_CATEGORIES, getCategoryColor } from '@/constants/colors';

interface AppStateContextProps {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  calculateTotals: () => {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    expensesByCategory: CategoryTotal[];
  };
  threshold: number;
  setThreshold: (value: number) => void;
  clearAllData: () => void;
}

export const AppStateContext = createContext<AppStateContextProps>({
  transactions: [],
  addTransaction: () => {},
  deleteTransaction: () => {},
  calculateTotals: () => ({ 
    totalIncome: 0, 
    totalExpenses: 0, 
    balance: 0, 
    expensesByCategory: [] 
  }),
  threshold: 0,
  setThreshold: () => {},
  clearAllData: () => {},
});

const TRANSACTIONS_STORAGE_KEY = 'financeApp_transactions';
const THRESHOLD_STORAGE_KEY = 'financeApp_threshold';

// Platform-specific storage implementation
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    }
  }
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [threshold, setThreshold] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from storage when app starts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load transactions
        const storedTransactions = await storage.getItem(TRANSACTIONS_STORAGE_KEY);
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
        
        // Load threshold
        const storedThreshold = await storage.getItem(THRESHOLD_STORAGE_KEY);
        if (storedThreshold) {
          setThreshold(Number(storedThreshold));
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading data from storage:', error);
        setIsInitialized(true);
      }
    };
    
    loadData();
  }, []);

  // Save transactions whenever they change
  useEffect(() => {
    const saveTransactions = async () => {
      if (isInitialized) {
        try {
          await storage.setItem(
            TRANSACTIONS_STORAGE_KEY, 
            JSON.stringify(transactions)
          );
        } catch (error) {
          console.error('Error saving transactions:', error);
        }
      }
    };
    
    saveTransactions();
  }, [transactions, isInitialized]);

  // Save threshold whenever it changes
  useEffect(() => {
    const saveThreshold = async () => {
      if (isInitialized) {
        try {
          await storage.setItem(
            THRESHOLD_STORAGE_KEY, 
            threshold.toString()
          );
        } catch (error) {
          console.error('Error saving threshold:', error);
        }
      }
    };
    
    saveThreshold();
  }, [threshold, isInitialized]);

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    // Check if adding an expense would make balance go below threshold
    if (transaction.type === 'expense') {
      const { balance } = calculateTotals();
      if (balance - transaction.amount < threshold) {
        throw new Error('balance_below_threshold');
      }
    }
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    setTransactions(prevTransactions => [
      newTransaction,
      ...prevTransactions,
    ]);
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions(prevTransactions => 
      prevTransactions.filter(transaction => transaction.id !== id)
    );
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      await storage.removeItem(TRANSACTIONS_STORAGE_KEY);
      await storage.removeItem(THRESHOLD_STORAGE_KEY);
      setTransactions([]);
      setThreshold(0);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  // Calculate totals for dashboard
  const calculateTotals = () => {
    // Calculate total income and expenses
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    // Calculate expenses by category
    const expensesByCategory: Record<string, number> = {};
    
    // Initialize all categories with 0
    EXPENSE_CATEGORIES.forEach(cat => {
      expensesByCategory[cat.id] = 0;
    });
    
    // Sum expenses by category
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const category = t.category || 'others';
        expensesByCategory[category] = (expensesByCategory[category] || 0) + t.amount;
      });
    
    // Convert to array format needed for the pie chart
    const expensesByCategoryArray: CategoryTotal[] = Object.keys(expensesByCategory)
      .filter(category => expensesByCategory[category] > 0)
      .map(category => {
        return {
          name: category,
          total: expensesByCategory[category],
          color: getCategoryColor(category),
          percentage: totalExpenses > 0 
            ? Math.round((expensesByCategory[category] / totalExpenses) * 100) 
            : 0
        };
      })
      .sort((a, b) => b.total - a.total);
    
    return {
      totalIncome,
      totalExpenses,
      balance,
      expensesByCategory: expensesByCategoryArray,
    };
  };

  // Update threshold
  const updateThreshold = (value: number) => {
    setThreshold(value);
  };

  return (
    <AppStateContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        calculateTotals,
        threshold,
        setThreshold: updateThreshold,
        clearAllData,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};