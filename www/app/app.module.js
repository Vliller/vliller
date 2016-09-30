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
    .constant('PRODUCTION_MODE', false)

    .constant('VLILLE_PROXY_URL', 'http://dev.alexandrebonhomme.fr/vlille/web')

    .constant('ANDROID_APP_ID', 'com.alexetmanon.vliller')
    .constant('IOS_APP_ID', '')

    .constant('INSTABUG_ANDROID_TOKEN', '64e51d98195423eb197dc88178bf7557')
    .constant('INSTABUG_IOS_TOKEN', '094f2566c433fd994f964d6fcb62288d')

    .constant('VLILLER_SITE_URL', 'http://vliller.alexetmanon.com');
}());