import React, { createContext, ReactNode, useContext, useState } from 'react';

export type SnackbarType = 'success' | 'error';

interface SnackbarState {
  isVisible: boolean;
  message: string;
  type: SnackbarType;
}

interface SnackbarContextType {
  showSnackbar: (message: string, type: SnackbarType) => void;
  hideSnackbar: () => void;
  snackbar: SnackbarState;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const showSnackbar = (message: string, type: SnackbarType) => {
    setSnackbar({ isVisible: true, message, type });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      hideSnackbar();
    }, 3000);
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar, snackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
} 