// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import AppRoutes from './app.routes';
import Layout from '../layout/Layout';
import ColorModeProvider from '../components/ColorModeProvider';

export function App() {
  return (
    <div style={{ height: '100vh' }}>
      <ColorModeProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </ColorModeProvider>
    </div>
  );
}

export default App;
