import { env } from '../environments/environment';

export namespace AppSettings {
    export const isProduction = env.production;

    export const appId = {
        android: 'com.alexetmanon.vliller',
        ios: '1161025016'
    };

    export const vlillerSiteUrl = 'http://vliller.alexetmanon.com';
    export const vlillerContribsUrl = 'https://api.github.com/repos/alexetmanon/vliller/contributors';

    export const sentryDSN = env.sentry.dsn;

    // Lille coordinates
    export const defaultPosition = {
        lat: 50.633333,
        lng: 3.066667
    };

    export const vlille = {
        apiBase: 'https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime&rows=-1',
        apiKey: env.vlille.apiKey
    };

    export const doorbell = {
        apiBase: 'https://doorbell.io/api/applications/4561/submit',
        apiKey: env.doorbell.apiKey
    };

    export const googleAnalyticsId = env.googleAnalytics.id;
}