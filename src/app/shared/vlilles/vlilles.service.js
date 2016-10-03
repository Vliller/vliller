(function () {
    'use strict';

    angular
        .module('vliller.vlilles', [])
        .factory('Vlilles', ['VLILLE_PROXY_URL', 'aetmResource', function (VLILLE_PROXY_URL, aetmResource) {
            return aetmResource(VLILLE_PROXY_URL + '/stations/:id', {
                id: '@id'
            }, {
                get: {
                    method: 'GET',
                    cache: false
                }
            }, {
                cacheId: 'stations'
            });
        }]);
})();