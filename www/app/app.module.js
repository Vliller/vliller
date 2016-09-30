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
    .constant('VLILLE_PROXY_URL', 'http://dev.alexandrebonhomme.fr/vlille/web')

    .constant('ANDROID_APP_ID', 'com.alexetmanon.vliller')
    .constant('IOS_APP_ID', '');
}());