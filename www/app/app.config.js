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
            .state('home', {
                url: '/',
                templateUrl: 'components/home/home.view.html',
                controller: 'HomeController',
                controllerAs: 'HomeCtrl'
            })
            // .state('test', {
            //     url: '/',
            //     templateUrl: 'components/test/test.view.html',
            //     controller: 'TestController',
            //     controllerAs: 'TestCtrl'
            // })
        ;
    }]);
}());