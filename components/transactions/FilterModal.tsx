import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  useColorScheme 
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { COLORS, EXPENSE_CATEGORIES } from '@/constants/colors';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (type: string, category: string) => void;
  currentType: string;
  currentCategory: string;
}

export default function FilterModal({ 
  visible, 
  onClose,
  onApply,
  currentType,
  currentCategory
}: FilterModalProps) {
  const { t, isRTL } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedType, setSelectedType] = useState(currentType);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  
  const handleApply = () => {
    onApply(selectedType, selectedCategory);
  };
  
  const handleReset = () => {
    setSelectedType('all');
    setSelectedCategory('all');
    onApply('all', 'all');
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
              {t('filterTransactions')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? COLORS.lightText : COLORS.darkText} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            {/* Filter by Type */}
            <View style={styles.filterSection}>
              <Text style={[
                styles.filterTitle,
                { color: isDark ? COLORS.lightText : COLORS.darkText }
              ]}>
                {t('filterByType')}
              </Text>
              
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedType === 'all' && styles.selectedOption,
                    { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
                  ]}
                  onPress={() => setSelectedType('all')}
                >
                  <Text style={[
                    styles.optionText,
                    selectedType === 'all' && styles.selectedOptionText,
                  ]}>
                    {t('all')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedType === 'income' && styles.selectedOption,
                    { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
                  ]}
                  onPress={() => setSelectedType('income')}
                >
                  <Text style={[
                    styles.optionText,
                    selectedType === 'income' && styles.selectedOptionText,
                  ]}>
                    {t('income')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedType === 'expense' && styles.selectedOption,
                    { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
                  ]}
                  onPress={() => setSelectedType('expense')}
                >
                  <Text style={[
                    styles.optionText,
                    selectedType === 'expense' && styles.selectedOptionText,
                  ]}>
                    {t('expense')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Filter by Category (only when expenses selected) */}
            {(selectedType === 'expense' || selectedType === 'all') && (
              <View style={styles.filterSection}>
                <Text style={[
                  styles.filterTitle,
                  { color: isDark ? COLORS.lightText : COLORS.darkText }
                ]}>
                  {t('filterByCategory')}
                </Text>
                
                <View style={styles.categoryContainer}>
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      selectedCategory === 'all' && styles.selectedCategory,
                      { 
                        backgroundColor: isDark ? 
                          (selectedCategory === 'all' ? COLORS.primary : COLORS.darkCard) : 
                          (selectedCategory === 'all' ? COLORS.primary : COLORS.lightCard) 
                      }
                    ]}
                    onPress={() => setSelectedCategory('all')}
                  >
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === 'all' && styles.selectedCategoryText,
                    ]}>
                      {t('all')}
                    </Text>
                  </TouchableOpacity>
                  
                  {EXPENSE_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        selectedCategory === category.id && styles.selectedCategory,
                        { 
                          backgroundColor: selectedCategory === category.id ? 
                            category.color : 
                            isDark ? COLORS.darkCard : COLORS.lightCard 
                        }
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Text style={[
                        styles.categoryText,
                        selectedCategory === category.id && styles.selectedCategoryText,
                      ]}>
                        {t(category.name)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
                ]}
                onPress={handleReset}
              >
                <Text style={[
                  styles.resetButtonText,
                  { color: isDark ? COLORS.lightText : COLORS.darkText }
                ]}>
                  {t('resetFilters')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.applyButton,
                  { backgroundColor: COLORS.primary }
                ]}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>
                  {t('apply')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#555',
  },
  selectedOptionText: {
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#555',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  resetButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  applyButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
  },
});