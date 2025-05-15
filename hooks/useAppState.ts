import { useContext } from 'react';
import { AppStateContext } from '@/context/AppStateContext';

export const useAppState = () => {
  return useContext(AppStateContext);
};