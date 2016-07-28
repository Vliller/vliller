(function () {
    'use strict';

    /**
     * Haversine formula
     * @see http://stackoverflow.com/a/1502821/5727772
     */
    function rad(x) {
        return x * Math.PI / 180;
    }

    function getDistance(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.latitude - p1.latitude);
        var dLong = rad(p2.longitude - p1.longitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        return d; // returns the distance in meter
    }

    angular
        .module('vliller.vlilles', [])
        .factory('Vlilles', ['VLILLE_PROXY_URL', 'aetmResource', function (VLILLE_PROXY_URL, aetmResource) {
            var vlille = aetmResource(VLILLE_PROXY_URL + '/stations/:id', {
                id: '@id'
            }, {
                get: {
                    method: 'GET',
                    cache: false
                }
            }, {
                cacheId: 'stations'
            });

            /**
             *
             * @param  Object position
             * @param  Array stations
             * @return Station
             */
            vlille.computeClosestStation = function (position, stations) {
                return stations.reduce(function (closest, current) {
                    current.distance = getDistance(position, current);

                    return closest.distance > current.distance ? current : closest;
                }, {
                    distance: Infinity
                });
            };

            return vlille;
        }]);
})();