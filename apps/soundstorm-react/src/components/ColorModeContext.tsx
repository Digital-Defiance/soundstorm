import React, { createContext } from 'react';

const ColorModeContext = createContext({
  toggleColorMode: () => {
    return;
  },
});

export default ColorModeContext;
