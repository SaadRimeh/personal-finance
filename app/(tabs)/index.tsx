import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAppState } from '@/hooks/useAppState';
import { useTranslation } from '@/hooks/useTranslation';
import { COLORS } from '@/constants/colors';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BalanceCard from '@/components/dashboard/BalanceCard';
import ExpensePieChart from '@/components/dashboard/ExpensePieChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import AddTransactionButton from '@/components/transactions/AddTransactionButton';

export default function Dashboard() {
  const { t, isRTL } = useTranslation();
  const { transactions, calculateTotals } = useAppState();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { 
    totalIncome, 
    totalExpenses, 
    balance,
    expensesByCategory
  } = calculateTotals();

  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightBackground }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1 }}>
        <DashboardHeader />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <BalanceCard 
            balance={balance}
            income={totalIncome}
            expenses={totalExpenses}
          />
          
          <View style={styles.sectionContainer}>
            <Text style={[
              styles.sectionTitle, 
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t('expenseCategories')}
            </Text>
            <ExpensePieChart data={expensesByCategory} />
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={[
              styles.sectionTitle, 
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t('recentTransactions')}
            </Text>
            <RecentTransactions 
              transactions={transactions.slice(0, 5)} 
              showViewAll={true}
            />
          </View>
        </ScrollView>
        
        <AddTransactionButton />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
});