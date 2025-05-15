import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { COLORS } from '@/constants/colors';

export default function TransactionsHeader() {
  const { t, isRTL } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={[
      styles.header,
      { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
    ]}>
      <Text
        style={[
          styles.title,
          { color: isDark ? COLORS.lightText : COLORS.darkText },
          isRTL && styles.rtlText
        ]}
      >
        {t('transactions')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: COLORS.lightCard,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  rtlText: {
    textAlign: 'right',
  },
});