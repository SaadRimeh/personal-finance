export const COLORS = {
  // Primary colors
  primary: '#1E3A8A', // Deep blue for trust
  secondary: '#059669', // Emerald green for growth
  accent: '#F59E0B', // Gold for luxury
  
  // Status colors
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  info: '#3B82F6', // Blue
  
  // Text colors
  darkText: '#1F2937',
  lightText: '#F9FAFB',
  textSecondary: '#6B7280',
  
  // UI colors
  lightBackground: '#F9FAFB',
  darkBackground: '#111827',
  lightCard: '#FFFFFF',
  darkCard: '#1F2937',
  lightBorder: '#E5E7EB',
  darkBorder: '#374151',
  
  // Transaction type colors
  income: '#10B981',
  expense: '#EF4444',
  
  // Category colors
  food: '#F59E0B',
  internet: '#3B82F6',
  clothing: '#EC4899',
  medicine: '#10B981',
  entertainment: '#8B5CF6',
  others: '#6B7280',
};

export const getCategoryColor = (category: string): string => {
  switch (category?.toLowerCase()) {
    case 'food':
      return COLORS.food;
    case 'internet':
      return COLORS.internet;
    case 'clothing':
      return COLORS.clothing;
    case 'medicine':
      return COLORS.medicine;
    case 'entertainment':
      return COLORS.entertainment;
    default:
      return COLORS.others;
  }
};

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'food', color: COLORS.food },
  { id: 'internet', name: 'internet', color: COLORS.internet },
  { id: 'clothing', name: 'clothing', color: COLORS.clothing },
  { id: 'medicine', name: 'medicine', color: COLORS.medicine },
  { id: 'entertainment', name: 'entertainment', color: COLORS.entertainment },
  { id: 'others', name: 'others', color: COLORS.others },
];