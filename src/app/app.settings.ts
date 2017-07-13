import { MapPosition } from '../models/map-position';

export class AppSettings {
    public static isProduction = false;

    public static appId = {
        android: 'com.alexetmanon.vliller',
        ios: '1161025016'
    };

    public static googleAnalyticsId = 'UA-85251159-1';

    public static vlillerSiteUrl = 'http://vliller.alexetmanon.com';

    public static sentryDSN = 'https://0cdc4000f06146d58781cef186b88b4d@sentry.io/134393';

    // Lille coordinates
    public static defaultPosition = new MapPosition(50.633333, 3.066667);
}