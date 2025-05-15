import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  useColorScheme
} from 'react-native';
import { X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppState } from '@/hooks/useAppState';
import { COLORS, EXPENSE_CATEGORIES } from '@/constants/colors';
import { TransactionType, Category } from '@/types';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ 
  visible, 
  onClose 
}: AddTransactionModalProps) {
  const { t, isRTL } = useTranslation();
  const { addTransaction, calculateTotals, threshold } = useAppState();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [type, setType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('others');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    // Reset category when switching to income
    if (newType === 'income') {
      setCategory('others');
    }
  };
  
  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = t('enterValidAmount');
    }
    
    if (type === 'expense' && !category) {
      newErrors.category = t('selectCategory');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const newTransaction = {
        amount: Number(amount),
        type,
        category: type === 'expense' ? category : undefined,
        description: description.trim(),
        date: date.toISOString(),
      };
      
      addTransaction(newTransaction);
      
      // Reset form
      setAmount('');
      setDescription('');
      setCategory('others');
      setDate(new Date());
      
      onClose();
    } catch (error: any) {
      if (error.message === 'balance_below_threshold') {
        Alert.alert(
          t('balanceBelowThreshold'),
          t('thresholdDescription'),
        );
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer,
          { backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightBackground }
        ]}>
          <View style={styles.modalHeader}>
            <Text style={[
              styles.modalTitle,
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {type === 'income' ? t('addIncome') : t('addExpense')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? COLORS.lightText : COLORS.darkText} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {/* Transaction Type Selection */}
            <View style={styles.formGroup}>
              <Text style={[
                styles.label,
                { color: isDark ? COLORS.lightText : COLORS.darkText }
              ]}>
                {t('type')}
              </Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    type === 'income' && styles.activeSegment,
                    type === 'income' && { backgroundColor: COLORS.income },
                  ]}
                  onPress={() => handleTypeChange('income')}
                >
                  <Text style={[
                    styles.segmentText,
                    type === 'income' && styles.activeSegmentText
                  ]}>
                    {t('income')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    type === 'expense' && styles.activeSegment,
                    type === 'expense' && { backgroundColor: COLORS.expense },
                  ]}
                  onPress={() => handleTypeChange('expense')}
                >
                  <Text style={[
                    styles.segmentText,
                    type === 'expense' && styles.activeSegmentText
                  ]}>
                    {t('expense')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Amount Input */}
            <View style={styles.formGroup}>
              <Text style={[
                styles.label,
                { color: isDark ? COLORS.lightText : COLORS.darkText }
              ]}>
                {t('amount')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.amount && styles.inputError,
                  { 
                    color: isDark ? COLORS.lightText : COLORS.darkText,
                    backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                    borderColor: isDark ? COLORS.darkBorder : COLORS.lightBorder,
                  }
                ]}
                placeholder={t('enterAmount')}
                placeholderTextColor={isDark ? COLORS.textSecondary : COLORS.textSecondary}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              {errors.amount && (
                <Text style={styles.errorText}>{errors.amount}</Text>
              )}
            </View>
            
            {/* Description Input */}
            <View style={styles.formGroup}>
              <Text style={[
                styles.label,
                { color: isDark ? COLORS.lightText : COLORS.darkText }
              ]}>
                {t('description')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: isDark ? COLORS.lightText : COLORS.darkText,
                    backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                    borderColor: isDark ? COLORS.darkBorder : COLORS.lightBorder,
                  }
                ]}
                placeholder={t('enterDescription')}
                placeholderTextColor={isDark ? COLORS.textSecondary : COLORS.textSecondary}
                value={description}
                onChangeText={setDescription}
              />
            </View>
            
            {/* Date Picker */}
            <View style={styles.formGroup}>
              <Text style={[
                styles.label,
                { color: isDark ? COLORS.lightText : COLORS.darkText }
              ]}>
                {t('date')}
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  { 
                    backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                    borderColor: isDark ? COLORS.darkBorder : COLORS.lightBorder,
                  }
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: isDark ? COLORS.lightText : COLORS.darkText }}>
                  {format(date, 'dd/MM/yyyy')}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
            
            {/* Category Selection (for expenses only) */}
            {type === 'expense' && (
              <View style={styles.formGroup}>
                <Text style={[
                  styles.label,
                  { color: isDark ? COLORS.lightText : COLORS.darkText }
                ]}>
                  {t('category')}
                </Text>
                <View style={styles.categoryContainer}>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryButton,
                        cat.id === category && styles.selectedCategory,
                        { backgroundColor: cat.color + (cat.id === category ? '' : '40') }
                      ]}
                      onPress={() => setCategory(cat.id as Category)}
                    >
                      <Text style={[
                        styles.categoryText,
                        cat.id === category && styles.selectedCategoryText
                      ]}>
                        {t(cat.name)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.category && (
                  <Text style={styles.errorText}>{errors.category}</Text>
                )}
              </View>
            )}
            
            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: type === 'income' ? COLORS.income : COLORS.expense }
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {t('save')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    fontFamily: 'Inter-Medium',
    color: '#555',
  },
  activeSegmentText: {
    color: '#fff',
  },
  dateButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 4,
  },
  selectedCategory: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#fff',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});