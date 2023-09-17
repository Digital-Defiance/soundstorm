import React from 'react';
import { useAuth0, LogoutOptions } from '@auth0/auth0-react';
import Button from '@mui/material/Button';

function LogoutButton() {
  const { logout } = useAuth0();
  const logoutOptions: LogoutOptions = {
    logoutParams: {
      returnTo: window.location.origin,
    },
  };

  return (
    <Button
      color="primary"
      fullWidth
      variant="outlined"
      onClick={() => logout(logoutOptions)}
    >
      Log Out
    </Button>
  );
}

export default LogoutButton;
