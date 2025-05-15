import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  DollarSign, 
  ShoppingBag, 
  Wifi,
  Shirt,
  Pill,
  Music,
  HelpCircle
} from 'lucide-react-native';
import { COLORS, getCategoryColor } from '@/constants/colors';
import { TransactionType, Category } from '@/types';

interface TransactionIconProps {
  type: TransactionType;
  category?: Category;
  size?: number;
}

export default function TransactionIcon({ 
  type, 
  category, 
  size = 20 
}: TransactionIconProps) {
  const getIconByCategory = () => {
    if (type === 'income') {
      return <DollarSign size={size} color="#fff" />;
    }
    
    switch (category) {
      case 'food':
        return <ShoppingBag size={size} color="#fff" />;
      case 'internet':
        return <Wifi size={size} color="#fff" />;
      case 'clothing':
        return <Shirt size={size} color="#fff" />;
      case 'medicine':
        return <Pill size={size} color="#fff" />;
      case 'entertainment':
        return <Music size={size} color="#fff" />;
      default:
        return <HelpCircle size={size} color="#fff" />;
    }
  };
  
  const backgroundColor = type === 'income' 
    ? COLORS.income 
    : getCategoryColor(category || 'others');
  
  return (
    <View style={[
      styles.iconContainer,
      { backgroundColor }
    ]}>
      {getIconByCategory()}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});