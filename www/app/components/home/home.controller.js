(function () {
    angular
    .module('vliller.home')
    .controller('HomeController', ['uiGmapGoogleMapApi', 'uiGmapIsReady', 'Vlilles', '$scope', '$timeout', 'aetmToastService', '$log', '$q', 'aetmNetworkService', 'Location', 'Navigation', function (uiGmapGoogleMapApi, uiGmapIsReady, Vlilles, $scope, $timeout, aetmToastService, $log, $q, aetmNetworkService, Location, Navigation) {
        var vm = this,
            map,
            userMarker,
            stationsFullList,
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

            // set station icon
            stations.forEach(function (station) {
                map.addMarker({
                    position: new google.maps.LatLng(station.latitude, station.longitude),
                    icon: iconDefault,
                    markerClick: function (marker) {
                        setActiveStation(marker.get('station'));
                    }
                }, function (marker) {
                    marker.set('station', station);
                });
            });

            // make a backup of the full list to apply filter later
            // This is do here because we need
            stationsFullList = angular.copy(stations);

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
                url: 'assets/img/cycling-white.png',
                size: {
                    width: 32,
                    height: 37
                }
            };

            iconActive = {
                url: 'assets/img/cycling-red.png',
                size: {
                    width: 48,
                    height: 55
                }
            };

            // Init markers, etc.
            vm.stations.$promise.then(initStations, errorHandler);
        };

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
            map.animateCamera({
                target: new google.maps.LatLng(position.latitude, position.longitude),
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
                    position: new google.maps.LatLng(currentPosition.latitude, currentPosition.longitude),
                    icon: {
                        url: 'assets/img/user-pin.png'
                    }
                }, function (marker) {
                    userMarker = marker;
                });
            } else {
                userMarker.setPosition(new google.maps.LatLng(currentPosition.latitude, currentPosition.longitude));
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
         *
         * @param  google.maps.Marker marker
         * @param  String eventName
         * @param  {[type]} station
         */
        vm.markerClick = function (marker, eventName, station) {
            setActiveStation(station);
        };

        /**
         * Launch navigation application (Google Maps if avaible)
         */
        vm.navigate = function () {
            Navigation.navigate(currentPosition, vm.activeStation);
        };
    }]);
}());