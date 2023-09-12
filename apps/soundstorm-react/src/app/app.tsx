// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import { Route, Routes, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthenticationGuard } from '../components/authentication-required';
import AccountError from '../pages/account-error';
import ApiAccess from '../components/api-access';
import Callback from '../components/callback';
import LoginLink from '../components/login-link';
import LogoutLink from '../components/logout-link';
import UserProfile from '../pages/user-profile';

export function App() {
  const { isAuthenticated } = useAuth0();
  return (
    <div>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!isAuthenticated && (
            <li>
              <LoginLink />
            </li>
          )}
          {isAuthenticated && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <LogoutLink />
            </li>
          )}
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route path="/callback" element={<Callback />} />
        <Route
          path="/profile"
          element={
            <div>
              <AuthenticationGuard component={UserProfile} />
            </div>
          }
        />
        <Route
          path="/api-access"
          element={
            <div>
              <AuthenticationGuard component={ApiAccess} />
            </div>
          }
        />
        <Route path="/account-error" element={<AccountError />} />
      </Routes>
    </div>
  );
}

export default App;
