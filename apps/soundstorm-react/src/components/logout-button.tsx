import React from 'react';
import { useAuth0, LogoutOptions } from '@auth0/auth0-react';

function LogoutButton() {
  const { logout } = useAuth0();
  const logoutOptions: LogoutOptions = {
    logoutParams: {
      returnTo: window.location.origin,
    },
  };
  return <button onClick={() => logout(logoutOptions)}>Log Out</button>;
}

export default LogoutButton;
