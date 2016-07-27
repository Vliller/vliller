(function () {
    'use strict';

    /**
     *
     * @param  Document xml
     * @return Object
     */
    function xmlStationsToJson(xml) {
        var i,
            j,
            len,
            len2,
            markers = xml.childNodes[0].children || [],
            attributes,
            jsonMarker,
            jsonArray = [];

        // imperative way
        for (i = 0, len = markers.length; i < len; i += 1) {
            jsonMarker = {};
            attributes = markers[i].attributes;

            for (j = 0, len2 = attributes.length; j < len2; j += 1) {
                jsonMarker[attributes[j].name] = attributes[j].value;
            }

            jsonMarker.latitude = Number(jsonMarker.lat);
            jsonMarker.longitude = Number(jsonMarker.lng);

            jsonArray.push(jsonMarker);
        }

        return jsonArray;
    }

    /**
     *
     * @param  Document xml
     * @return Object
     */
    function xmlStationToJson(xml) {
        var i,
            len,
            stationData = xml.childNodes[0].children || [],
            jsonStation = {};

        for (i = 0, len = stationData.length; i < len; i += 1) {
            jsonStation[stationData[i].nodeName] = stationData[i].innerHTML;
        }

        jsonStation.latitude = Number(jsonStation.lat);
        jsonStation.longitude = Number(jsonStation.lng);

        return jsonStation;
    }

    angular
        .module('vliller.vlilles', [])
        .factory('Vlilles', ['VLILLE_PROXY_URL', 'aetmResource', '$http', function (VLILLE_PROXY_URL, aetmResource, $http) {
            return aetmResource(VLILLE_PROXY_URL + '/xml-stations.aspx', {
                id: '@id'
            }, {
                query: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: $http.defaults.transformResponse.concat(function (stations) {
                        var xmlObject = (new window.DOMParser()).parseFromString(stations, "text/xml");

                        return xmlStationsToJson(xmlObject);
                    }),
                    cache: false
                },
                get: {
                    method: 'GET',
                    url: VLILLE_PROXY_URL + '/xml-stations.aspx?borne=:id',
                    transformResponse: $http.defaults.transformResponse.concat(function (station) {
                        var xmlObject = (new window.DOMParser()).parseFromString(station, "text/xml");

                        return xmlStationToJson(xmlObject);
                    }),
                    cache: false
                }
            }, {
                cacheId: 'stations'
            });
        }]);
})();