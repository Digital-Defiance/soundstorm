import 'dotenv/config';
import { IEnvironment } from "./interfaces/environment";

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const ssl = process.env.SSL === 'true';

function getSiteUrl() {
    const proto = ssl ? 'https' : 'http';
    if (ssl && port === 443) {
        return `${proto}://${host}`;
    } else if (!ssl && port === 80) {
        return `${proto}://${host}`;
    } else {
        return `${proto}://${host}:${port}`;
    }
}

export const environment: IEnvironment = {
    production: process.env.NODE_ENV === 'production',
    server: {
        host: host,
        port: port,
        ssl: ssl,
        siteUrl: process.env.SITE_URL ?? getSiteUrl()
    },
    auth0: {
        database: process.env.AUTH0_DATABASE ?? '',
        domain: process.env.AUTH0_DOMAIN ?? '',
        clientId: process.env.AUTH0_CLIENT_ID ?? '',
        clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
        scope: process.env.AUTH0_SCOPE ?? ''
    },
    mongo: {
        uri: process.env.MONGO_URI ?? ''
    }
};