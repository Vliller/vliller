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
        'vliller.station'
    ])
    .constant('VLILLE_PROXY_URL', 'http://vlille-blckshrk.rhcloud.com');

}());