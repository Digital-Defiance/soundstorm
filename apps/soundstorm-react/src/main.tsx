import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { environment } from './environments/environment';
import theme from './theme';

import App from './app/app';

const providerConfig: Auth0ProviderOptions = {
  domain: environment.auth0.domain,
  clientId: environment.auth0.clientId,
  authorizationParams: {
    redirect_uri: environment.auth0.callbackUrl,
    audience: environment.auth0.audience,
  },
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider {...providerConfig}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
);
