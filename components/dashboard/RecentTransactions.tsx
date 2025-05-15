import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { COLORS } from '@/constants/colors';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import TransactionIcon from '@/components/transactions/TransactionIcon';

interface RecentTransactionsProps {
  transactions: Transaction[];
  showViewAll?: boolean;
}

export default function RecentTransactions({ 
  transactions, 
  showViewAll = false 
}: RecentTransactionsProps) {
  const { t, isRTL } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  const handleViewAll = () => {
    router.push('/transactions');
  };
  
  if (transactions.length === 0) {
    return (
      <View style={[
        styles.emptyContainer,
        { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
      ]}>
        <Text style={[
          styles.emptyTitle,
          { color: isDark ? COLORS.lightText : COLORS.darkText }
        ]}>
          {t('noTransactionsYet')}
        </Text>
        <Text style={[
          styles.emptyText,
          { color: isDark ? COLORS.textSecondary : COLORS.textSecondary }
        ]}>
          {t('startByAdding')}
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {transactions.map((transaction) => (
        <View 
          key={transaction.id}
          style={[
            styles.transactionItem,
            { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
          ]}
        >
          <View style={styles.iconContainer}>
            <TransactionIcon
              type={transaction.type}
              category={transaction.category}
            />
          </View>
          
          <View style={styles.detailsContainer}>
            <Text style={[
              styles.description,
              { color: isDark ? COLORS.lightText : COLORS.darkText },
              isRTL && styles.rtlText
            ]}>
              {transaction.description || t(transaction.category || '')}
            </Text>
            <Text style={[
              styles.date,
              { color: isDark ? COLORS.textSecondary : COLORS.textSecondary },
              isRTL && styles.rtlText
            ]}>
              {formatDate(transaction.date)}
            </Text>
          </View>
          
          <Text style={[
            styles.amount,
            transaction.type === 'income' ? styles.incomeText : styles.expenseText,
            isRTL && styles.rtlText
          ]}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </Text>
        </View>
      ))}
      
      {showViewAll && transactions.length > 0 && (
        <TouchableOpacity 
          style={[
            styles.viewAllButton,
            { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
          ]}
          onPress={handleViewAll}
        >
          <Text style={[
            styles.viewAllText,
            { color: COLORS.primary }
          ]}>
            {t('viewAll')}
          </Text>
          <ChevronRight size={16} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  description: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  incomeText: {
    color: COLORS.income,
  },
  expenseText: {
    color: COLORS.expense,
  },
  rtlText: {
    textAlign: 'right',
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginRight: 4,
  },
  emptyContainer: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});