(function () {
    'use strict';

    angular
    .module('vliller')
    .run([
        '$ionicPlatform',
        '$rootScope',
        '$log',
        'aetmNetworkService',
        'GOOGLE_ANALYTICS_ID',
        function (
            $ionicPlatform,
            $rootScope,
            $log,
            aetmNetworkService,
            GOOGLE_ANALYTICS_ID) {
        $ionicPlatform.ready(function () {
            /**
             * Google Analytics
             */
            window.ga.startTrackerWithId(GOOGLE_ANALYTICS_ID, function () {
                $log.info('Google Analytics started');
            }, $log.error);

            window.ga.enableUncaughtExceptionReporting(true);

            /**
             * Keyboard plugin
             */
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport from snapping when text inputs are focused. Ionic handles this internally for a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }

            /**
             * StatusBar plugin
             */
            // iOS
            if (ionic.Platform.isIOS()) {
                StatusBar.styleLightContent();
            }

            // Android
            else if (ionic.Platform.isAndroid()) {
                StatusBar.backgroundColorByHexString('#b7212c');
            }

            /**
             * App version plugin
             */
            cordova.getAppVersion.getVersionNumber().then(function (version) {
                $rootScope.appVersion = version;
                window.ga.setAppVersion(version);
            });

            /**
             * Network information
             */
            $rootScope.isOnline = aetmNetworkService.isOnline();
            $rootScope.isOffline = !$rootScope.isOnline;

            /**
             * Location
             */
            // default value
            $rootScope.isLocationActive = true;

            // set initial value
            cordova.plugins.diagnostic.isLocationEnabled(function (isLocationActive) {
                $rootScope.isLocationActive = isLocationActive;
            });

            /**
             * Splashscreen
             */
            navigator.splashscreen.hide();
        });

        // Online/Offline
        $rootScope.$on('aetm-network:online', function () {
            $rootScope.isOnline = true;
            $rootScope.isOffline = false;
        });

        $rootScope.$on('aetm-network:offline', function () {
            $rootScope.isOnline = false;
            $rootScope.isOffline = true;
        });

        // Location
        $rootScope.$on('Location:update', function (e, isLocationActive) {
            $rootScope.isLocationActive = isLocationActive;
        });
    }]);
}());
