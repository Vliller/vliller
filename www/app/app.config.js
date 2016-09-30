(function () {
    'use strict';

    angular
    .module('vliller')
    .config([
        '$urlRouterProvider',
        '$stateProvider',
        '$logProvider',
        '$compileProvider',
        'PRODUCTION_MODE',
        function (
            $urlRouterProvider,
            $stateProvider,
            $logProvider,
            $compileProvider,
            PRODUCTION_MODE) {

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

        /**
         * Logs
         */
        if (PRODUCTION_MODE) {
            $logProvider.debugEnabled(false);
            $compileProvider.debugInfoEnabled(false);
        }
    }]);
}());