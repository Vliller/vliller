(function () {
    'use strict';

    angular
        .module('vliller.location', [])
        .factory('Location', ['$q', function ($q) {
            return {
                getCurrentPosition: function () {
                    var defer = $q.defer();

                    document.addEventListener('deviceready', function () {
                        // Check if the GPS is available
                        cordova.plugins.diagnostic.isLocationEnabled(function (isLocationEnabled) {

                            // GPS disabled
                            if (!isLocationEnabled) {
                                defer.reject('locationDisabled');

                                return;
                            }

                            // Get the current location
                            navigator.geolocation.getCurrentPosition(defer.resolve, defer.reject);
                        }, defer.reject);
                    }, false);

                    return defer.promise;
                }
            };
        }]);
})();