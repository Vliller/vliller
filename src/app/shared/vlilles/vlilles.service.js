(function () {
    'use strict';

    /**
     * @see https://docs.angularjs.org/api/ng/service/$http
     */
    function appendTransform(defaults, transform) {
        // We can't guarantee that the default transformation is an array
        defaults = angular.isArray(defaults) ? defaults : [defaults];

        // Append the new transformation to the defaults
        return defaults.concat(transform);
    }

    function buildVlilleStationObject(data) {
        var station = {
            id: data.fields.libelle,
            name: data.fields.nom.replace(/^([0-9]+ )/, ''),
            latitude: data.fields.geo[0],
            longitude: data.fields.geo[1],
            address: data.fields.adresse,
            bikes: data.fields.nbVelosDispo,
            docks: data.fields.nbPlacesDispo,
            payment: data.fields.type,
            status: undefined,
            lastupd: undefined
        };

        /*
            Status
         */
        if (data.fields.etat === 'EN SERVICE') {
            station.status = '0';
        } else {
            station.status = '1';
        }

        if (station.bikes === 0 && station.docks === 0) {
            station.status = '418';
        }

        /*
            Last up
         */
        var diffInSeconds = Math.round(moment().diff(moment.utc(data.record_timestamp))/ 1000);

        station.lastupd = diffInSeconds + ' seconde' + (diffInSeconds > 1 ? 's' : '');

        return station;
    }

    angular
        .module('vliller.vlilles', [])
        .factory('Vlilles', ['VLILLE_PROXY_URL', 'aetmResource', '$http', function (VLILLE_PROXY_URL, aetmResource, $http) {
            return aetmResource(VLILLE_PROXY_URL, null, {
                get: {
                    url: VLILLE_PROXY_URL + '&q=libelle\::id',
                    params: {
                        id: '@id'
                    },
                    method: 'GET',
                    cache: false,
                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {
                        return buildVlilleStationObject(data.records[0]);
                    })
                },
                query: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {
                        return data.records.map(function (record) {
                            return buildVlilleStationObject(record);
                        });
                    })
                }
            }, {
                cacheId: 'stations'
            });
        }]);
})();