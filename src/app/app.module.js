(function () {
    'use strict';

    angular
    .module('vliller', [
        'ionic',
        'templates',
        'aetm-resource',
        'aetm-toast',
        'aetm-network',

        'vliller.home',
        'vliller.sidemenu'
    ])
    .constant('PRODUCTION_MODE', true)

    .constant('VLILLE_PROXY_URL', 'https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime&rows=500')

    .constant('ANDROID_APP_ID', 'com.alexetmanon.vliller')
    .constant('IOS_APP_ID', '1161025016')

    .constant('GOOGLE_ANALYTICS_ID', 'UA-85251159-1')

    .constant('VLILLER_SITE_URL', 'http://vliller.alexetmanon.com');
}());