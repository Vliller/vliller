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
        .module('vliller.google-maps', [])
        .factory('GoogleMapsTools', [function () {
            return {
                /**
                 *
                 */
                getDistance : getDistance,

                /**
                 *
                 * @param  Object position
                 * @param  Array markers
                 * @return google.maps.Marker
                 */
                computeClosestMarker: function (position, markers) {
                    return markers.reduce(function (closest, current) {
                        var currentPosition = current.get('position');
                        var distance = getDistance(position, {
                            latitude: currentPosition.lat,
                            longitude: currentPosition.lng
                        });

                        current.set('distance', distance);

                        return closest.get('distance') > current.get('distance') ? current : closest;
                    }, {
                        get: function () {
                            return Infinity;
                        }
                    });
                }
            };
        }]);
})();