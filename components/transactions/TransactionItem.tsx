import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppState } from '@/hooks/useAppState';
import { COLORS } from '@/constants/colors';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import TransactionIcon from './TransactionIcon';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const { t, isRTL } = useTranslation();
  const { deleteTransaction } = useAppState();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const handleDelete = () => {
    Alert.alert(
      t('delete'),
      t('deleteConfirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          onPress: () => deleteTransaction(transaction.id),
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
      ]}
    >
      <View style={styles.content}>
        <TransactionIcon 
          type={transaction.type} 
          category={transaction.category}
          size={20}
        />
        
        <View style={styles.details}>
          <Text style={[
            styles.description,
            { color: isDark ? COLORS.lightText : COLORS.darkText },
            isRTL && styles.rtlText
          ]}>
            {transaction.description || t(transaction.category || '')}
          </Text>
          
          <View style={styles.metaContainer}>
            <Text style={[
              styles.date,
              { color: isDark ? COLORS.textSecondary : COLORS.textSecondary },
              isRTL && styles.rtlText
            ]}>
              {formatDate(transaction.date)}
            </Text>
            
            {transaction.type === 'expense' && transaction.category && (
              <View style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(transaction.category, isDark) }
              ]}>
                <Text style={styles.categoryText}>
                  {t(transaction.category)}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={[
            styles.amount,
            transaction.type === 'income' ? styles.incomeText : styles.expenseText,
            isRTL && styles.rtlText
          ]}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </Text>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Trash2 size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function getCategoryColor(category: string, isDark: boolean): string {
  const baseColor = COLORS[category as keyof typeof COLORS] || COLORS.others;
  return isDark ? `${baseColor}90` : `${baseColor}20`;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  description: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#fff',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  incomeText: {
    color: COLORS.income,
  },
  expenseText: {
    color: COLORS.expense,
  },
  deleteButton: {
    padding: 4,
  },
  rtlText: {
    textAlign: 'right',
  },
});