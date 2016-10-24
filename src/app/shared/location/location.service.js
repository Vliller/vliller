(function () {
    'use strict';

    /**
     * Dependencies :
     * - https://github.com/dpa99c/cordova-diagnostic-plugin
     * - https://github.com/dpa99c/cordova-plugin-request-location-accuracy
     * - https://github.com/apache/cordova-plugin-geolocation
     */
    angular
        .module('vliller.location', [])
        .factory('Location', ['$q', '$rootScope', '$timeout', function ($q, $rootScope, $timeout) {

            document.addEventListener('deviceready', function () {
                if (!cordova.plugins.diagnostic) {
                    return;
                }

                // register location state changing
                cordova.plugins.diagnostic.registerLocationStateChangeHandler(function (state) {
                    var isLocationOn = true;

                    if((ionic.Platform.isAndroid() && state !== cordova.plugins.diagnostic.locationMode.LOCATION_OFF) || (ionic.Platform.isIOS()) && (state === cordova.plugins.diagnostic.permissionStatus.GRANTED || state === cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE)) {
                        isLocationOn = true;
                    } else {
                        isLocationOn = false;
                    }

                    $timeout(function () {
                        $rootScope.$broadcast('Location:update', isLocationOn);
                    });
                });
            }, false);

            return {
                /**
                 *
                 * @return Promise
                 */
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
                },

                /**
                 *
                 * @return Promise
                 */
                requestLocation: function () {
                    var defer = $q.defer();

                    document.addEventListener('deviceready', function () {
                        cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
                            // GPS already enabled
                            if (!canRequest) {
                                return defer.resolve();
                            }

                            // Display a system popup asking to turn on GPS if disabled
                            cordova.plugins.locationAccuracy.request(
                                defer.resolve,
                                defer.reject,

                                // iOS will ignore this
                                cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
                            );
                        });
                    }, false);

                    return defer.promise;
                }
            };
        }])
        .run(['$injector', function ($injector) {
            $injector.get('Location'); // ensure the factory always gets initialised
        }]);
})();