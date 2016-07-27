(function () {
    angular
    .module('vliller.station')
    .controller('StationController', ['Vlilles', '$stateParams', function (Vlilles, $stateParams) {
        var vm = this;

        vm.station = Vlilles.get({id: $stateParams.id}, function () {
            // get some missing informations from the previous request
            angular.extend(vm.station, $stateParams.data);

            vm.station.$loaded = true;
        });

    }]);
}());