(function () {
    'use strict';

    angular
    .module('vliller', [
        'ionic',
        'templates',
        'aetm-resource',
        'aetm-toast',
        'aetm-network',

        'vliller.home'
    ])
    .constant('VLILLE_PROXY_URL', 'http://dev.alexandrebonhomme.fr/vlille/web');
}());