(function () {
    angular
    .module('vliller.home')
    .controller('HomeController', ['uiGmapGoogleMapApi', 'uiGmapIsReady', 'Vlilles', '$scope', '$timeout', '$window', 'aetmToastService', '$log', '$q', 'aetmNetworkService', '$ionicLoading', '$state', function (uiGmapGoogleMapApi, uiGmapIsReady, Vlilles, $scope, $timeout, $window, aetmToastService, $log, $q, aetmNetworkService, $ionicLoading, $state) {
        var vm = this,
            stationsFullList,
            currentPosition = null,
            navigationApp,
            iconDefault,
            iconActive,
            uiGmapIsReadyPromise = uiGmapIsReady.promise(1);

        vm.activeStation = null;
        vm.isLoading = true;
        vm.isGPSActive = false;
        vm.isOffline = false;

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
                station.icon = iconDefault;
            });

            // make a backup of the full list to apply filter later
            // This is do here because we need
            stationsFullList = angular.copy(stations);
        }

        // in offline mode we do not wait for the map to be loaded
        // if (vm.isOffline) {
        //     uiGmapIsReadyPromise = $q.reject('offline');

        //     // Init markers, etc.
        //     vm.stations.$promise.then(initStations, errorHandler);
        // }

        /**
         * Promise of Google Maps API fully loaded.
         * ALL CODE using `google.maps.*` need to be done here.
         */
        uiGmapGoogleMapApi.then(function (maps) {
            // Init icon objects
            iconDefault = {
                url: 'assets/img/cycling-white.png',
                scaledSize: new google.maps.Size(32, 37)
            };
            iconActive = {
                url: 'assets/img/cycling-red.png',
                scaledSize: new google.maps.Size(48, 55)
            };

            // Init markers, etc.
            vm.stations.$promise.then(initStations, errorHandler);
        }, errorHandler);

        /**
         * Map loaded
         */
        uiGmapIsReadyPromise.then(function(instances) {
            vm.map.$loaded = true;
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
         * Set the current active station.
         * @param {[type]} station
         */
        function setActiveStation(station, centerMap) {
            if (centerMap === undefined) {
                centerMap = true;
            }

            // set default icon on current office marker
            if (vm.activeStation) {
                vm.activeStation.icon = iconDefault;
            }

            // update new active office
            vm.activeStation = station;

            // update icon and center map
            vm.activeStation.icon = iconActive;

            if (centerMap) {
                setCenterMap(vm.activeStation);
            }

            // loads station details
            Vlilles.get({id: station.id}, function (stationDetails) {
                // get some missing informations from the previous request
                angular.extend(vm.activeStation, stationDetails);

                vm.activeStation.$loaded = true;
            });
        }

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
         * Compute the closest station using le Haversine formula.
         * @param  Object position
         * @return Station
         */
        function computeClosestStation(position) {
            return vm.stations.reduce(function (closest, current) {
                current.distance = getDistance(position, current);

                return closest.distance > current.distance ? current : closest;
            }, {
                distance: Infinity
            });
        }

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

        /**
         * Center the map on the closest station
         *
         * @param Position position
         */
        function handleLocationActive(position) {
            // update this way to avoid digest problem with gmaps
            vm.userMarker.coords.latitude = position.coords.latitude;
            vm.userMarker.coords.longitude = position.coords.longitude;

            currentPosition = position.coords;
            vm.isGPSActive = true;

            setCenterMap(currentPosition);
            setActiveStation(computeClosestStation(currentPosition), false);
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
            //     currentPosition = null;
            //     vm.isGPSActive = false;
            //     vm.isClosestOfficeToFar = false;

            //     return;
            // }

            activeGPS();
        };

        /**
         *
         * @param  google.maps.Marker marker
         * @param  String eventName
         * @param  {[type]} station
         */
        vm.markerClick = function (marker, eventName, station) {
            setActiveStation(station);
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


        /**
         * NAVIGATION
         */

        // Defines Google Maps by default if avaible
        document.addEventListener('deviceready', function () {
            launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, function (isAvailable) {
                if(isAvailable){
                    navigationApp = launchnavigator.APP.GOOGLE_MAPS;
                } else{
                    console.warn("Google Maps not available - falling back to user selection");
                    navigationApp = launchnavigator.APP.USER_SELECT;
                }
            });
        });

        /**
         * launch navigation application (Google Maps if avaible)
         */
        vm.navigate = function () {
            document.addEventListener('deviceready', function () {
                // navigate to the station from current position
                launchnavigator.navigate([
                    vm.activeStation.latitude,
                    vm.activeStation.longitude
                ], {
                    app: navigationApp || launchnavigator.APP.USER_SELECT,
                    start: [
                        currentPosition.latitude,
                        currentPosition.longitude
                    ]
                });
            }, false);
        };
    }]);
}());