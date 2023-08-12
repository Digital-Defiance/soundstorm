export interface IEnvironment {
    production: boolean;
    server: {
        host: string;
        port: number;
        ssl: boolean;
        siteUrl: string;
    }
    auth0: {
        database: string;
        domain: string;
        clientId: string;
        clientSecret: string;
        scope: string;
    }
    mongo: {
        uri: string;
    }
}