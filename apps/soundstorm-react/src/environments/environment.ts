// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.
import { IEnvironment } from '../interfaces/environment';

export const environment: IEnvironment = {
  production: false,
  auth0: {
    domain: 'soundstorm-dev.us.auth0.com',
    clientId: 'uGptYZUCnWuxXGH5dN8wiq7OYGkxDgwC',
    audience: 'http://localhost:3000/',
    callbackUrl: 'http://localhost:3000/callback',
  },
};
