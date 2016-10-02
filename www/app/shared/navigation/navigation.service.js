(function () {
    'use strict';

    angular
        .module('vliller.navigation', [])
        .factory('Navigation', ['$q', '$log', function ($q, $log) {
            var navigationApp;

            // Defines Google Maps by default if avaible
            document.addEventListener('deviceready', function () {
                launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, function (isAvailable) {
                    if (isAvailable) {
                        navigationApp = launchnavigator.APP.GOOGLE_MAPS;
                    } else {
                        $log.debug("Google Maps not available - falling back to user selection");
                        navigationApp = launchnavigator.APP.USER_SELECT;
                    }
                });
            });

            return {
                navigate: function (from, to) {
                    var defer = $q.defer();

                    document.addEventListener('deviceready', function () {
                        // navigate to the station from current position
                        launchnavigator.navigate([
                            to.latitude,
                            to.longitude
                        ], {
                            app: navigationApp || launchnavigator.APP.USER_SELECT,
                            start: [
                                from.latitude,
                                from.longitude
                            ]
                        });
                    }, false);

                    return defer.promise;
                }
            };
        }]);
})();