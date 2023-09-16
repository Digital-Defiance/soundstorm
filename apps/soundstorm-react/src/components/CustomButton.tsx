import React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

type CustomButtonProps = {
  href: string;
  icon: React.ReactNode;
  text: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  href,
  icon,
  text,
  ...otherProps
}) => {
  const theme = useTheme();

  return (
    <Button
      component="a"
      color="primary"
      href={href}
      size="small"
      variant="text"
      {...otherProps}
      sx={{
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.text.secondary
            : theme.palette.text.primary,
        fontSize: theme.typography.subtitle1,
        fontWeight: 'medium',
        mr: 2,
        '&:active': {
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.primary.contrastText
              : theme.palette.primary.main,
        },
        '&:hover': {
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.primary.contrastText
              : theme.palette.primary.main,
        },
        '& svg': {
          mr: 0.5,
        },
      }}
    >
      {icon} {text}
    </Button>
  );
};

export default CustomButton;
