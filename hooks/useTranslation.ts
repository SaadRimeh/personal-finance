import { useContext } from 'react';
import { I18nContext } from '@/context/I18nContext';

export const useTranslation = () => {
  return useContext(I18nContext);
};