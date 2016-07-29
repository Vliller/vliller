(function () {
    angular
    .module('vliller.test', [])
    .controller('TestController', [function () {
        var vm = this,
            map;

        // document.addEventListener('deviceready', function () {

        //     // Initialize the map view
        //     map = plugin.google.maps.Map.getMap(document.getElementById('map_canvas'));

        //     // Wait until the map is ready status.
        //     map.addEventListener(plugin.google.maps.event.MAP_READY, vm.onMapReady);
        // }, false);

        vm.onMapReady = function (map) {
            console.log('Ready!');
        };
    }]);
}());