import React, { createContext, useEffect, useState } from 'react';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { Platform } from 'react-native';
import { en } from '@/localization/en';
import { ar } from '@/localization/ar';

interface I18nContextProps {
  t: (key: string, options?: Record<string, any>) => string;
  isRTL: boolean;
  currentLanguage: string;
  toggleLanguage: () => void;
}

export const I18nContext = createContext<I18nContextProps>({
  t: (key: string) => key,
  isRTL: false,
  currentLanguage: 'en',
  toggleLanguage: () => {},
});

const LANGUAGE_STORAGE_KEY = 'financeApp_language';

const i18n = new I18n({
  en,
  ar,
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Platform-specific storage implementation
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    }
  }
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>('en');
  
  // Load saved language or use device locale
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await storage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) {
          setLocale(savedLanguage);
        } else {
          // Use device locale, but limit to supported languages
          const deviceLocale = Localization.locale.split('-')[0];
          if (['en', 'ar'].includes(deviceLocale)) {
            setLocale(deviceLocale);
          }
        }
      } catch (error) {
        console.error('Error loading language setting:', error);
      }
    };
    
    loadLanguage();
  }, []);
  
  // Save language when it changes
  useEffect(() => {
    const saveLanguage = async () => {
      try {
        await storage.setItem(LANGUAGE_STORAGE_KEY, locale);
      } catch (error) {
        console.error('Error saving language setting:', error);
      }
    };
    
    saveLanguage();
  }, [locale]);
  
  // Set current locale for i18n
  i18n.locale = locale;
  
  // Check if the current locale is RTL
  const isRTL = locale === 'ar';
  
  // Toggle between languages
  const toggleLanguage = () => {
    setLocale(prev => prev === 'en' ? 'ar' : 'en');
  };
  
  // Translation function
  const t = (key: string, options?: Record<string, any>) => {
    return i18n.t(key, options);
  };
  
  return (
    <I18nContext.Provider
      value={{
        t,
        isRTL,
        currentLanguage: locale,
        toggleLanguage,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};