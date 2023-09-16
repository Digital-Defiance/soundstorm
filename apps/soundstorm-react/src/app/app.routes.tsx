import { Route, Routes, Link } from 'react-router-dom';
import { AuthenticationGuard } from '../components/AuthenticationRequired';
import AccountError from '../pages/account-error';
import ApiAccess from '../components/ApiAccess';
import Callback from '../components/Callback';
import Splash from '../components/Splash';
import UserProfile from '../pages/user-profile';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
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
  );
}

export default AppRoutes;
