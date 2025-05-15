import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  Alert,
  useColorScheme
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { COLORS } from '@/constants/colors';

interface DeleteDataModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteDataModal({ 
  visible, 
  onClose,
  onConfirm
}: DeleteDataModalProps) {
  const { t, isRTL } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [securityCode, setSecurityCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  
  // Generate a random 4-digit code when the modal opens
  useEffect(() => {
    if (visible) {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(randomCode);
      setInputCode('');
    }
  }, [visible]);
  
  const handleConfirm = () => {
    if (inputCode === generatedCode) {
      onConfirm();
      onClose();
    } else {
      Alert.alert(t('codeDoesNotMatch'));
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
              {t('deleteAllData')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? COLORS.lightText : COLORS.darkText} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={[
              styles.warningText,
              { color: COLORS.error }
            ]}>
              {t('warningDeleteAll')}
            </Text>
            
            <Text style={[
              styles.codeText,
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t('deleteConfirmation')}
            </Text>
            
            <View style={styles.codeContainer}>
              <Text style={styles.generatedCode}>
                {generatedCode}
              </Text>
            </View>
            
            <TextInput
              style={[
                styles.codeInput,
                { 
                  backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                  color: isDark ? COLORS.lightText : COLORS.darkText,
                  borderColor: isDark ? COLORS.darkBorder : COLORS.lightBorder,
                }
              ]}
              value={inputCode}
              onChangeText={setInputCode}
              keyboardType="numeric"
              maxLength={4}
              placeholder="Enter code"
              placeholderTextColor={isDark ? COLORS.textSecondary : COLORS.textSecondary}
            />
            
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: COLORS.error }
              ]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>
                {t('confirm')}
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
  warningText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  codeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  codeContainer: {
    backgroundColor: COLORS.error + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  generatedCode: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.error,
    letterSpacing: 8,
  },
  codeInput: {
    fontFamily: 'Inter-Regular',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmButtonText: {
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