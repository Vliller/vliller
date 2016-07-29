(function () {
    'use strict';

    angular
        .module('vliller.google-maps', [])
        .component('googleMaps', {
            bindings: {
                onMapReady: '&'
            },
            template: '<div class="aetm-google-maps"></div>',
            controller: ['$element', function ($element) {
                var vm = this,
                    map;

                document.addEventListener('deviceready', function () {
                    // Initialize the map view
                    map = plugin.google.maps.Map.getMap($element.children()[0]);

                    // Wait until the map is ready status.
                    map.addEventListener(plugin.google.maps.event.MAP_READY, function (map) {
                        vm.onMapReady({map: map});
                    });
                }, false);
            }]
        });
})();