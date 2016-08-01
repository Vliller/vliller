(function () {
    angular
    .module('vliller.home')
    .controller('HomeController', ['Vlilles', '$scope', '$timeout', 'aetmToastService', '$log', '$q', 'aetmNetworkService', 'Location', 'Navigation', function (Vlilles, $scope, $timeout, aetmToastService, $log, $q, aetmNetworkService, Location, Navigation) {
        var vm = this,
            map,
            markers = [],
            userMarker,
            activeMarker,
            currentPosition = null,
            iconDefault,
            iconActive;

        vm.activeStation = null;
        vm.isLoading = true;
        vm.isGPSLoading = false;

        // get stations list
        vm.stations = Vlilles.query();

        // default map values
        vm.map = {
            $loaded: false
        };

        /**
         * @param Object error
         */
        function errorHandler(error) {
            $log.debug(error);
            aetmToastService.showError('Oups! Une erreur est survenue.');
        }

        /**
         * @param  Array stations
         */
        function initStations(stations) {
            // update GPS position
            vm.updatePosition();

            // add stations markers
            stations.forEach(function (station) {
                map.addMarker({
                    position: {
                        lat: station.latitude,
                        lng: station.longitude
                    },
                    icon: iconDefault,
                    markerClick: function (marker) {
                        $scope.$apply(function () {
                            setActiveMarker(marker);
                        });
                    }
                }, function (marker) {
                    marker.set('station', station);

                    // store list of markers
                    markers.push(marker);
                });
            });

            vm.isLoading = false;
        }

        /**
         * Map loaded
         */
        vm.onMapReady = function (googleMap) {
            map = googleMap;
            vm.map.$loaded = true;

            // Init icon objects
            iconDefault = {
                url: 'www/assets/img/cycling-white.png',
                size: {
                    width: 32,
                    height: 37
                }
            };

            iconActive = {
                url: 'www/assets/img/cycling-red.png',
                size: {
                    width: 48,
                    height: 55
                }
            };

            // Init markers, etc.
            vm.stations.$promise.then(initStations, errorHandler);
        };

        /**
         *
         * @param google.maps.Marker marker
         */
        function setActiveMarker(marker) {
            var station = marker.get('station');

            // set default icon on current office marker
            if (activeMarker) {
                activeMarker.setIcon(iconDefault);
            }

            // update new active office
            activeMarker = marker;
            vm.activeStation = station;

            // update icon and center map
            activeMarker.setIcon(iconActive);
            setCenterMap(vm.activeStation);

            // loads station details
            Vlilles.get({id: station.id}, function (stationDetails) {
                // get some missing informations from the previous request
                angular.extend(vm.activeStation, stationDetails);

                vm.activeStation.$loaded = true;
            });
        }

        /**
         * TODO : replace by activeMarker
         *
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
            map.animateCamera({
                target: {
                    lat: position.latitude,
                    lng: position.longitude
                },
                zoom: 16,
                duration: 1000
            });
        }

        /**
         * Center the map on the closest station
         *
         * @param Position position
         */
        function handleLocationActive(position) {
            currentPosition = position.coords;

            if (!userMarker) {
                map.addMarker({
                    position: {
                        lat: currentPosition.latitude,
                        lng: currentPosition.longitude
                    },
                    icon: {
                        url: 'www/assets/img/user-pin.png',
                        size: {
                            width: 24,
                            height: 24
                        }
                    }

                }, function (marker) {
                    userMarker = marker;
                });
            } else {
                userMarker.setPosition({
                    lat: currentPosition.latitude,
                    lng: currentPosition.longitude
                });
            }

            setCenterMap(currentPosition);

            // compute the closest station and set active
            setActiveStation(Vlilles.computeClosestStation(currentPosition, vm.stations), false);
        }

        /**
         * Updates the current position
         */
        vm.updatePosition = function () {
            vm.isGPSLoading = true;

            // Get current location
            Location.getCurrentPosition()
                .then(function (position) {
                    handleLocationActive(position);
                }, function (error) {
                    if (error === 'locationDisabled') {
                        aetmToastService.showError('Vous devez activer votre GPS pour utiliser cette fonctionnalité.', 'long');

                        return error;
                    }

                    errorHandler(error);
                })
                .finally(function () {
                    vm.isGPSLoading = false;
                });
        };

        /**
         * Launch navigation application (Google Maps if avaible)
         */
        vm.navigate = function () {
            Navigation.navigate(currentPosition, vm.activeStation);
        };
    }]);
}());