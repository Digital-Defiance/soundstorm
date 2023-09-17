import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';

function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      color="primary"
      fullWidth
      variant="outlined"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </Button>
  );
}

export default LoginButton;
