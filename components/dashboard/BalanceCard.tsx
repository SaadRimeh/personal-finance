import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { COLORS } from '@/constants/colors';
import { formatCurrency } from '@/utils/formatters';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export default function BalanceCard({ balance, income, expenses }: BalanceCardProps) {
  const { t, isRTL } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={[
      styles.card,
      { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
    ]}>
      <View style={styles.balanceSection}>
        <Text style={[
          styles.balanceLabel,
          { color: isDark ? COLORS.lightText : COLORS.darkText },
          isRTL && styles.rtlText
        ]}>
          {t('balance')}
        </Text>
        <Text style={[
          styles.balanceAmount,
          { color: isDark ? COLORS.lightText : COLORS.darkText },
          isRTL && styles.rtlText
        ]}>
          {formatCurrency(balance)}
        </Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={[
            styles.detailLabel,
            { color: isDark ? COLORS.lightText : COLORS.darkText },
            isRTL && styles.rtlText
          ]}>
            {t('income')}
          </Text>
          <Text style={[
            styles.incomeAmount,
            isRTL && styles.rtlText
          ]}>
            {formatCurrency(income)}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={[
            styles.detailLabel,
            { color: isDark ? COLORS.lightText : COLORS.darkText },
            isRTL && styles.rtlText
          ]}>
            {t('expenses')}
          </Text>
          <Text style={[
            styles.expenseAmount,
            isRTL && styles.rtlText
          ]}>
            {formatCurrency(expenses)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceSection: {
    marginBottom: 24,
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  incomeAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: COLORS.income,
  },
  expenseAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: COLORS.expense,
  },
  rtlText: {
    textAlign: 'right',
  },
});