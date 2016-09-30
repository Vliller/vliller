(function () {
    'use strict';

    angular
    .module('vliller')
    .config([
        '$urlRouterProvider',
        '$stateProvider',
        function (
            $urlRouterProvider,
            $stateProvider) {

        /**
         * Routes
         */
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'home': {
                        templateUrl: 'components/home/home.view.html',
                        controller: 'HomeController',
                        controllerAs: 'HomeCtrl'
                    },
                    'sidemenu': {
                        templateUrl: 'components/sidemenu/sidemenu.view.html',
                        controller: 'SidemenuController',
                        controllerAs: 'SidemenuCtrl'
                    }
                }
            })
        ;
    }]);
}());