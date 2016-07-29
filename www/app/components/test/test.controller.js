(function () {
    angular
    .module('vliller.test', [])
    .controller('TestController', [function () {
        var vm = this,
            map;

        vm.onMapReady = function (map) {
            console.log('Ready!');
        };
    }]);
}());