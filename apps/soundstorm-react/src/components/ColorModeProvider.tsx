import React, { useState, useCallback, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ColorModeContext from './ColorModeContext';

type ColorModeProviderProps = {
  children: ReactNode;
};

const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === 'dark' && {
        text: {
          primary: '#ffffff',
        },
      }),
    },
  });

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ColorModeContext.Provider value={{ toggleColorMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ColorModeProvider;
