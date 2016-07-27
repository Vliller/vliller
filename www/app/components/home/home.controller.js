(function () {
    angular
    .module('vliller.home')
    .controller('HomeController', ['uiGmapGoogleMapApi', 'uiGmapIsReady', 'Vlilles', '$scope', '$timeout', '$window', 'aetmToastService', '$log', '$q', 'aetmNetworkService', '$ionicLoading', function (uiGmapGoogleMapApi, uiGmapIsReady, Vlilles, $scope, $timeout, $window, aetmToastService, $log, $q, aetmNetworkService, $ionicLoading) {
        var vm = this,
            stationsFullList,
            uiGmapIsReadyPromise = uiGmapIsReady.promise(1);

        vm.isLoading = true;
        vm.query = null;
        vm.isGPSActive = false;
        vm.isOffline = false;
        vm.currentPosition = null;

        // $scope.$watch('$root.isOffline', function (newValue) {
        //     if (newValue === undefined) {
        //         return;
        //     }

        //     vm.isOffline = newValue;
        // });

        // get stations list
        vm.stations = Vlilles.query();

        // default map values
        vm.map = {
            center: {
                latitude: 50.6314446,
                longitude: 3.0589064
            },
            zoom: 16,
            options: {
                disableDefaultUI: true
            },
            control: {},
            $loaded: false
        };

        vm.userMarker = {
            id: 'userMarker',
            coords: {
                latitude: 50.6314446,
                longitude: 3.0589064
            },
            options: {
                icon: 'assets/img/user-pin.png'
            }
        };

        /**
         * @param Object error
         */
        function errorHandler(error) {
            if (error === 'offline') {
                // aetmToastService.showError("Oups! Vous n'êtes pas connecté à Internet.");

                return;
            }

            $log.debug(error);
            aetmToastService.showError('Oups! Une erreur est survenue.');
        }

        /**
         * @param  Array stations
         */
        function initStations(stations) {
            // update GPS position
            activeGPS();

            // set station icon
            stations.forEach(function (station) {
                station.icon = 'assets/img/cycling-red.png';
            });

            // make a backup of the full list to apply filter later
            // This is do here because we need
            stationsFullList = angular.copy(stations);
        }

        // in offline mode we do not wait for the map to be loaded
        if (vm.isOffline) {
            uiGmapIsReadyPromise = $q.reject('offline');

            // Init markers, etc.
            vm.stations.$promise.then(initStations, errorHandler);
        }

        /**
         * Promise of Google Maps API fully loaded.
         * ALL CODE using `google.maps.*` need to be done here.
         */
        uiGmapGoogleMapApi.then(function (maps) {
            // Init markers, etc.
            vm.stations.$promise.then(initStations, errorHandler);
        }, errorHandler);

        /**
         * Map loaded
         */
        uiGmapIsReadyPromise.then(function(instances) {
            vm.map.$loaded = true;

            // bug fix due to keyboard resize on next view (form)
            $scope.$on('$stateChangeSuccess', function (event, toState) {
                if (vm.map.$loaded && toState.name === 'app.appointments') {
                    vm.map.control.refresh();
                }
            });
        }, errorHandler);

        /**
         * Hide loader when everythings is loaded
         */
        $q.all([uiGmapIsReadyPromise, vm.stations.$promise]).finally(function () {
            vm.isLoading = false;

            $timeout(function () {
                // refresh map to avoid bug due to ng-hide/show
                if (vm.map.$loaded) {
                    vm.map.control.refresh(vm.map.center);
                }
            }, 0);
        });

        /**
         * Center the map to given office
         * @param Object position
         */
        function setCenterMap(position) {
            vm.map.center = {
                latitude: position.latitude,
                longitude: position.longitude
            };
        }

        /**
         * Center the map on the closest office or active the "too far mode"
         *
         * @param Position position
         */
        function handleLocationActive(position) {
            vm.userMarker.coords.latitude = position.coords.latitude;
            vm.userMarker.coords.longitude = position.coords.longitude;

            vm.currentPosition = position.coords;
            vm.isGPSActive = true;

            setCenterMap(vm.currentPosition);
        }

        function activeGPS() {
            document.addEventListener("deviceready", function () {
                // Check if the GPS is available
                cordova.plugins.diagnostic.isLocationEnabled(function (isLocationEnabled) {
                    if (!isLocationEnabled) {
                        aetmToastService.showError('Vous devez activer votre GPS pour utiliser cette fonctionnalité.', 'long');

                        return;
                    }

                    // display loader to avoid "UX lag"
                    $ionicLoading.show();

                    // Get the current location
                    navigator.geolocation.getCurrentPosition(function (position) {
                        $ionicLoading.hide();

                        $timeout(function () {
                            handleLocationActive(position);
                        });
                    }, function (error) {
                        $ionicLoading.hide();

                        errorHandler(error);
                    });
                }, errorHandler);
            }, false);
        }

        /**
         * Toggle the GPS state and update current position.
         */
        vm.activeGPS = function () {
            // if (vm.isGPSActive) {
            //     vm.currentPosition = null;
            //     vm.isGPSActive = false;
            //     vm.isClosestOfficeToFar = false;

            //     return;
            // }

            activeGPS();
        };

        /**
         * [markerClick description]
         * @param  google.maps.Marker marker
         * @param  String eventName
         * @param  {[type]} station
         */
        vm.markerClick = function (marker, eventName, station) {
            console.log(station.name);
        };

        /**
         * Pull-to-refresh
         */
        vm.refresh = function () {
            // if (aetmNetworkService.isOffline()) {
            //     $scope.$broadcast('scroll.refreshComplete');
            //     return;
            // }

            Vlilles.invalidateCache();
            vm.stations = Vlilles.query();

            vm.stations.$promise
                .then(initStations, errorHandler)
                .finally(function () {
                    vm.map.control.refresh(vm.map.center);

                    $scope.$broadcast('scroll.refreshComplete');
                })
            ;
        };
    }]);
}());