export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'food'
  | 'internet'
  | 'clothing'
  | 'medicine'
  | 'entertainment'
  | 'others';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category?: Category;
  description: string;
  date: string;
}

export interface CategoryTotal {
  name: string;
  total: number;
  color: string;
  percentage: number;
}