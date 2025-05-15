import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Filter, Plus } from 'lucide-react-native';
import { useAppState } from '@/hooks/useAppState';
import { useTranslation } from '@/hooks/useTranslation';
import { COLORS } from '@/constants/colors';
import TransactionItem from '@/components/transactions/TransactionItem';
import FilterModal from '@/components/transactions/FilterModal';
import AddTransactionButton from '@/components/transactions/AddTransactionButton';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import TransactionsHeader from '@/components/transactions/TransactionsHeader';

export default function TransactionsScreen() {
  const { t, isRTL } = useTranslation();
  const { transactions } = useAppState();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Filter transactions based on the selected filters
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filterType !== 'all' && transaction.type !== filterType) {
      return false;
    }
    
    // Filter by category (for expenses only)
    if (filterCategory !== 'all' && transaction.type === 'expense') {
      if (transaction.category !== filterCategory) {
        return false;
      }
    }
    
    return true;
  });
  
  const handleOpenFilter = () => {
    setFilterModalVisible(true);
  };
  
  const handleApplyFilter = (type, category) => {
    setFilterType(type);
    setFilterCategory(category);
    setFilterModalVisible(false);
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightBackground }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1 }}>
        <TransactionsHeader />
        
        <View style={styles.filterContainer}>
          <Text style={[
            styles.listTitle, 
            { color: isDark ? COLORS.lightText : COLORS.darkText }
          ]}>
            {t('allTransactions')}
          </Text>
          
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={handleOpenFilter}
          >
            <Filter size={20} color={isDark ? COLORS.lightText : COLORS.darkText} />
            <Text style={[
              styles.filterText, 
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t('filter')}
            </Text>
          </TouchableOpacity>
        </View>
        
        {filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionItem transaction={item} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[
              styles.emptyText, 
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t('noTransactionsFound')}
            </Text>
          </View>
        )}
        
        <AddTransactionButton />
      </SafeAreaView>
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilter}
        currentType={filterType}
        currentCategory={filterCategory}
      />
      
      <AddTransactionModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
});