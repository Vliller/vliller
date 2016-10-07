(function () {
    angular
    .module('vliller.home')
    .controller('HomeController', [
        'Vlilles',
        '$scope',
        '$timeout',
        '$log',
        '$ionicSideMenuDelegate',
        'aetmToastService',
        'Location',
        'Navigation',
        'GoogleMapsTools',
        'aetmNetworkService',
        function (
            Vlilles,
            $scope,
            $timeout,
            $log,
            $ionicSideMenuDelegate,
            aetmToastService,
            Location,
            Navigation,
            GoogleMapsTools,
            aetmNetworkService) {
        var vm = this,
            map,
            markers = [],
            userMarker,
            activeMarker,
            currentPosition = null,
            iconDefault,
            iconNormal,
            iconSmall,
            iconActive,
            iconUnavaible,
            mapZoom,
            ZOOM_THRESHOLD = 14;

        vm.activeStation = null;
        vm.isLoading = true;
        vm.isGPSLoading = false;
        vm.isGPSCentered = false;
        vm.isOffline = false;

        // updates offline status
        $scope.$watch('$root.isOffline', function (newValue) {
            if (newValue === undefined) {
                return;
            }

            vm.isOffline = newValue;
        });

        // default map values
        vm.map = {
            $loaded: false
        };

        // Loads the map
        document.addEventListener('deviceready', function () {
            // get network status
            vm.isOffline = aetmNetworkService.isOffline();

            // Invalidate cache to get the stations list updated
            if (!vm.isOffline) {
                Vlilles.invalidateCache();
            }

            // get stations list
            vm.stations = Vlilles.query();

            // Initialize the map view
            var mapElement = plugin.google.maps.Map.getMap(document.getElementById('map-canvas'));

            // Wait until the map is ready status.
            mapElement.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

            // camera change listener
            mapElement.addEventListener(plugin.google.maps.event.CAMERA_CHANGE, onCameraChange);
        }, false);

        /**
         * Map loaded
         */
        function onMapReady(gmap) {
            map = gmap;
            vm.map.$loaded = true;

            $scope.$watch(function () {
                return $ionicSideMenuDelegate.isOpen();
            }, function (isOpen) {
                if (isOpen) {
                    map.setVisible(false);
                } else {
                    $timeout(function () {
                        map.refreshLayout();
                        map.setVisible(true);
                    }, 200); // animation duration
                }
            });

            // Init icon objects
            iconNormal = {
                url: 'www/assets/img/vliller-marker-white.png',
                size: {
                    width: 38,
                    height: 45
                }
            };

            iconSmall = {
                url: 'www/assets/img/vliller-marker-red-small.png',
                size: {
                    width: 12,
                    height: 12
                }
            };

            iconActive = {
                url: 'www/assets/img/vliller-marker-red.png',
                size: {
                    width: 60,
                    height: 69
                }
            };

            iconUnavaible = {
                url: 'www/assets/img/vliller-marker-grey.png',
                size: {
                    width: 60,
                    height: 69
                }
            };

            // by default icons are normal
            iconDefault = iconNormal;

            // Init markers, etc.
            vm.stations.$promise.then(initStations, errorHandler);
        }

        /**
         * Map camera position/zoom changed
         */
        function onCameraChange(event) {
            updateGPSCentered(event.target);
            updateMarkerIcon(event.zoom);
        }

        /**
         *
         * @param Integer zoomLevel
         */
        function updateMarkerIcon(zoom) {
            if (zoom < ZOOM_THRESHOLD && mapZoom >= ZOOM_THRESHOLD) {
                // we are "unzooming"
                // change the marker icon for the small one
                iconDefault = iconSmall;

                refreshMarkerIcons();
            } else if (zoom > ZOOM_THRESHOLD && mapZoom <= ZOOM_THRESHOLD) {
                // we are "zooming"
                // change the marker icon for the normal one
                iconDefault = iconNormal;

                refreshMarkerIcons();
            }

            // stores zoom value
            mapZoom = zoom;
        }

        /**
         * Refresh marker icons (except active one)
         */
        function refreshMarkerIcons() {
            for (var i = 0, len = markers.length; i < len; i += 1) {
                if (markers[i].id === activeMarker.id) {
                    continue;
                }

                markers[i].setIcon(iconDefault);
            }
        }

        /**
         * Tracks the camera position to check if the user marker is still centered.
         *
         * Computes delta between lat/lon
         * @see http://mathjs.org/docs/datatypes/numbers.html#equality
         *
         * EPSILON is the accuracy we want
         * @see http://gis.stackexchange.com/a/8674
         *
         * @param Object cameraPosition
         */
        function updateGPSCentered(cameraPosition) {
            if (!currentPosition) {
                return;
            }

            $timeout(function () {
                var EPSILON = 1e-5,
                    latDelta = Math.abs(cameraPosition.lat - currentPosition.latitude),
                    lonDelta = Math.abs(cameraPosition.lng - currentPosition.longitude);

                if (latDelta < EPSILON && lonDelta < EPSILON) {
                    vm.isGPSCentered = true;
                } else {
                    vm.isGPSCentered = false;
                }
            });
        }

        /**
         * @param Object error
         */
        function errorHandler(error) {
            $log.error(error);
            aetmToastService.showError('Oups! Une erreur est survenue.');
        }

        /**
         * Set clicked marker as active
         * @param  Object marker
         */
        function markerClick(marker) {
            setActiveMarker(marker, true);
        }

        /**
         * @param  Array stations
         */
        function initStations(stations) {
            // avoids function declaration inside loop
            function callback(marker) {
                // store list of markers
                markers.push(marker);

                /**
                 * addMarker is async, so we need to wait until all the marker are adds to the map.
                 * @see https://github.com/mapsplugin/cordova-plugin-googlemaps/wiki/Marker#create-multiple-markers
                 */
                if (markers.length === stations.length) {
                    vm.isLoading = false;

                    // update GPS position
                    vm.updatePosition();
                }
            }

            // adds stations markers on map
            for (var i = 0, len = stations.length; i < len; i += 1) {
                map.addMarker({
                    position: {
                        lat: stations[i].latitude,
                        lng: stations[i].longitude
                    },
                    icon: iconDefault,
                    station: stations[i],
                    disableAutoPan: true,
                    markerClick: markerClick
                }, callback);
            }
        }

        /**
         *
         * @param google.maps.Marker marker
         */
        function setActiveMarker(marker, centerMap) {
            var station = marker.get('station');

            // set default icon on current office marker
            if (activeMarker && activeMarker.id !== marker.id) {
                activeMarker.setIcon(iconDefault);
            }

            // update new active office
            activeMarker = marker;
            vm.activeStation = station;

            // center map
            if (centerMap !== false) {
                setCenterMap(vm.activeStation);
            }

            /**
             * Loads station details
             */
            Vlilles.get({id: station.id}, function (stationDetails) {
                // get some missing informations from the previous request
                angular.extend(vm.activeStation, stationDetails);

                // update marker
                if (vm.activeStation.status === '0') {
                    activeMarker.setIcon(iconActive);
                } else {
                    activeMarker.setIcon(iconUnavaible);
                }

                vm.activeStation.$loaded = true;

                // to avoid touch bug after card resizing
                $timeout(function () {
                    map.refreshLayout();
                }, 100);
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
                        url: 'www/assets/img/vliller-marker-user.png',
                        size: {
                            width: 18,
                            height: 18
                        }
                    },
                    disableAutoPan: true

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
            var closest = GoogleMapsTools.computeClosestMarker(currentPosition, markers);
            setActiveMarker(closest, false);
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

        /**
         * Compute css class according to the given number.
         * 0        : red,
         * ]0, 5]   : orange,
         * ]5, inf[ : green
         *
         * @param  Number number
         * @return String
         */
        vm.computeColorClass = function (number) {
            if (number === 0) {
                return 'assertive';
            }

            if (number <= 5) {
                return 'energized';
            }

            return 'calm';
        };

        vm.computeBikesIcon = function (number) {
            if (number === 0) {
                return 'assets/img/vliller_bike-red.png';
            }

            if (number <= 5) {
                return 'assets/img/vliller_bike-orange.png';
            }

            return 'assets/img/vliller_bike-green.png';
        };

        vm.computeDocksIcon = function (number) {
            if (number === 0) {
                return 'assets/img/vliller_place-red.png';
            }

            if (number <= 5) {
                return 'assets/img/vliller_place-orange.png';
            }

            return 'assets/img/vliller_place-green.png';
        };

        /**
         * Return a string format in meters or kilometers.
         *
         * @return String
         */
        vm.formatDistance = function () {
            var distanceInMeter = activeMarker.get('distance'),
                distanceString = 'à ';

            // meters
            if (distanceInMeter < 1000) {
                distanceString += Math.round(distanceInMeter) + 'm';
            }

            // kilometers
            // @see http://www.jacklmoore.com/notes/rounding-in-javascript/
            else {
                distanceString += Number(Math.round((distanceInMeter / 1000) + 'e1') + 'e-1') + 'km';
            }

            return distanceString;
        };
    }]);
}());