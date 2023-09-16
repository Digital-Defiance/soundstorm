import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

type SpacerProps = {
  sx?: object | object[];
};

const Spacer: React.FC<SpacerProps> = ({ sx = {} }) => {
  const theme = useTheme();

  return (
    <Box
      sx={[
        {
          backgroundColor: theme.palette.background.default,
        },
        sx,
      ]}
    ></Box>
  );
};

export default Spacer;
