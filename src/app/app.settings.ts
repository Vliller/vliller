export namespace AppSettings {
    export const isProduction = false;

    export const appId = {
        android: 'com.alexetmanon.vliller',
        ios: '1161025016'
    };

    export const vlillerSiteUrl = 'http://vliller.alexetmanon.com';
    export const vlillerContribsUrl = 'https://api.github.com/repos/alexetmanon/vliller/contributors';

    export const sentryDSN = 'https://0cdc4000f06146d58781cef186b88b4d@sentry.io/134393';

    // Lille coordinates
    export const defaultPosition = {
        lat: 50.633333,
        lng: 3.066667
    };

    export const vlille = {
        apiBase: 'https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime&rows=-1',
        apiKey: 'f9b97f402060621fcf83f0c599304832c6a5332abadc17dd2c381a84'
    }

    export const doorbell = {
        apiBase: 'https://doorbell.io/api/applications/4561/submit',
        apiKey: 'g9xKf3v4aM29diiMXJVh2Ko9J54fEaQ6uCqysESJSf8WWaKIcXwmVBXT94rXF8Lr'
    }
}