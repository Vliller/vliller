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
        'vliller.google-maps',
        'vliller.test'
    ])
    .constant('VLILLE_PROXY_URL', 'http://dev.alexandrebonhomme.fr/vlille/web');
}());