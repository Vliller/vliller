(function () {
    'use strict';

    angular
        .module('vliller.navigation', [])
        .factory('Navigation', ['$q', function ($q) {
            return {
                navigate: function (from, to) {
                    var defer = $q.defer();

                    document.addEventListener('deviceready', function () {
                        // navigate to the station from current position
                        plugin.google.maps.external.launchNavigation({
                            from: new plugin.google.maps.LatLng(from.latitude, from.longitude),
                            to: new plugin.google.maps.LatLng(to.latitude, to.longitude),
                            travelMode: 'walking'
                        });
                    }, false);

                    return defer.promise;
                }
            };
        }]);
})();