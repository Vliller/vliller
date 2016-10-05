(function () {
    'use strict';

    angular
    .module('vliller')
    .config([
        '$urlRouterProvider',
        '$stateProvider',
        '$logProvider',
        '$compileProvider',
        '$provide',
        'PRODUCTION_MODE',
        'aetmToastServiceProvider',
        function (
            $urlRouterProvider,
            $stateProvider,
            $logProvider,
            $compileProvider,
            $provide,
            PRODUCTION_MODE,
            aetmToastServiceProvider) {

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

        // override error log to track messages with GA
        $provide.decorator('$log', ['$delegate', function ($delegate) {
            var originalError = $delegate.error;

            $delegate.error = function (message) {
                document.addEventListener('deviceready', function () {
                    window.ga.trackException(message, false);
                });

                originalError.apply($delegate, arguments);
            };

            return $delegate;
        }]);

        /**
         * Toasts
         */
        aetmToastServiceProvider.errorConfig({
            styling: {
                backgroundColor: '#e52b38',
            }
        });
    }]);
}());