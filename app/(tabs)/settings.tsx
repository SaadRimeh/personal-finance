import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, TextInput, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAppState } from '@/hooks/useAppState';
import { useTranslation } from '@/hooks/useTranslation';
import { COLORS } from '@/constants/colors';
import SettingsHeader from '@/components/settings/SettingsHeader';
import DeleteDataModal from '@/components/settings/DeleteDataModal';
import ThresholdSettingModal from '@/components/settings/ThresholdSettingModal';

export default function SettingsScreen() {
  const { 
    t, 
    isRTL, 
    toggleLanguage, 
    currentLanguage 
  } = useTranslation();
  
  const { 
    threshold, 
    setThreshold, 
    clearAllData 
  } = useAppState();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [thresholdModalVisible, setThresholdModalVisible] = useState(false);
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightBackground }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1 }}>
        <SettingsHeader />
        
        <View style={styles.content}>
          <View style={[
            styles.section, 
            { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
          ]}>
            <Text style={[
              styles.sectionTitle, 
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t('language')}
            </Text>
            
            <View style={styles.settingRow}>
              <Text style={[
                styles.settingLabel, 
                { color: isDark ? COLORS.lightText : COLORS.darkText }
              ]}>
                {t('useArabic')}
              </Text>
              <Switch
                value={currentLanguage === 'ar'}
                onValueChange={toggleLanguage}
                thumbColor={COLORS.primary}
                trackColor={{ false: '#767577', true: `${COLORS.primary}50` }}
              />
            </View>
          </View>
          
          <View style={[
            styles.section, 
            { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
          ]}>
            <Text style={[
              styles.sectionTitle, 
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t('balanceSettings')}
            </Text>
            
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={() => setThresholdModalVisible(true)}
            >
              <View>
                <Text style={[
                  styles.settingLabel, 
                  { color: isDark ? COLORS.lightText : COLORS.darkText }
                ]}>
                  {t('minimumBalanceThreshold')}
                </Text>
                <Text style={styles.settingValue}>
                  {threshold}
                </Text>
              </View>
              <Text style={styles.editButton}>
                {t('edit')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[
            styles.section, 
            { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
          ]}>
            <Text style={[
              styles.sectionTitle, 
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t('dangerZone')}
            </Text>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => setDeleteModalVisible(true)}
            >
              <Text style={styles.deleteButtonText}>
                {t('deleteAllData')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      
      <DeleteDataModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={clearAllData}
      />
      
      <ThresholdSettingModal
        visible={thresholdModalVisible}
        onClose={() => setThresholdModalVisible(false)}
        currentThreshold={threshold}
        onSave={setThreshold}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  editButton: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
  },
});