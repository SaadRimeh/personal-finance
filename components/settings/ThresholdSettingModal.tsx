import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  useColorScheme
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { COLORS } from '@/constants/colors';

interface ThresholdSettingModalProps {
  visible: boolean;
  onClose: () => void;
  currentThreshold: number;
  onSave: (value: number) => void;
}

export default function ThresholdSettingModal({ 
  visible, 
  onClose,
  currentThreshold,
  onSave
}: ThresholdSettingModalProps) {
  const { t, isRTL } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [threshold, setThreshold] = useState(currentThreshold.toString());
  
  const handleSave = () => {
    const value = Number(threshold);
    if (!isNaN(value) && value >= 0) {
      onSave(value);
      onClose();
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
              {t('setThreshold')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? COLORS.lightText : COLORS.darkText} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={[
              styles.description,
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t('thresholdDescription')}
            </Text>
            
            <Text style={[
              styles.label,
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t('currentThreshold')}
            </Text>
            
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                  color: isDark ? COLORS.lightText : COLORS.darkText,
                  borderColor: isDark ? COLORS.darkBorder : COLORS.lightBorder,
                }
              ]}
              value={threshold}
              onChangeText={setThreshold}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={isDark ? COLORS.textSecondary : COLORS.textSecondary}
            />
            
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: COLORS.primary }
              ]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {t('save')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.cancelButton,
                { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
              ]}
              onPress={onClose}
            >
              <Text style={[
                styles.cancelButtonText,
                { color: isDark ? COLORS.lightText : COLORS.darkText }
              ]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 16,
    overflow: 'hidden',
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
    padding: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 24,
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
    marginBottom: 24,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  cancelButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});