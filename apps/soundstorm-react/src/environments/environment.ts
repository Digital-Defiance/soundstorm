// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.
import { IEnvironment } from '../interfaces/environment';

export const environment: IEnvironment = {
  production: false,
  auth0: {
    domain: 'soundstorm.us.auth0.com',
    clientId: 'Uqdpn7d9832jQWzaUk9hgY7UAhM7uEaE',
    audience: 'https://soundstorm.us.auth0.com/api/v2/'
  }
};
