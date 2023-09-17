import { HelmetProvider } from 'react-helmet-async';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import AppRoutes from './app.routes';
import Layout from '../layout/Layout';
import ColorModeProvider from '../components/ColorModeProvider';

export function App() {
  return (
    <HelmetProvider>
      <ColorModeProvider>
        <div style={{ height: '100vh' }}>
          <Layout>
            <AppRoutes />
          </Layout>
        </div>
      </ColorModeProvider>
    </HelmetProvider>
  );
}

export default App;
