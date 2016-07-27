(function () {
    angular
    .module('vliller.station')
    .controller('StationController', ['Vlilles', '$stateParams', '$ionicLoading', '$scope', function (Vlilles, $stateParams, $ionicLoading, $scope) {
        var vm = this,
            navigationApp;

        vm.station = Vlilles.get({id: $stateParams.id}, initStation);

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

        function initStation(station) {
            // get some missing informations from the previous request
            angular.extend(vm.station, $stateParams.data);

            vm.station.$loaded = true;
        }

        /**
         *
         */
        vm.navigate = function () {
            // display loader to avoid "UX lag"
            $ionicLoading.show();

            document.addEventListener('deviceready', function () {
                // Get the current location
                navigator.geolocation.getCurrentPosition(function (position) {
                    $ionicLoading.hide();

                    // navigate to the station from current position
                    launchnavigator.navigate([
                        vm.station.latitude,
                        vm.station.longitude
                    ], {
                        app: navigationApp || launchnavigator.APP.USER_SELECT,
                        start: [
                            position.coords.latitude,
                            position.coords.longitude
                        ]
                    });
                }, function (error) {
                    $ionicLoading.hide();

                    // TODO : manage error
                    console.error(error);
                });
            }, false);
        };

        /**
         *
         */
        vm.refresh = function () {
            vm.station = Vlilles.get({id: $stateParams.id});

            vm.station.$promise
                .then(initStation)
                .finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    }]);
}());