(function () {
    'use strict';

    angular
    .module('vliller')
    .run([
        '$ionicPlatform',
        '$rootScope',
        '$log',
        'INSTABUG_ANDROID_TOKEN',
        'INSTABUG_IOS_TOKEN',
        function (
            $ionicPlatform,
            $rootScope,
            $log,
            INSTABUG_ANDROID_TOKEN,
            INSTABUG_IOS_TOKEN) {
        $ionicPlatform.ready(function () {
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
            if (window.StatusBar) {
                // iOS
                if (ionic.Platform.isIOS()) {
                    StatusBar.styleLightContent();
                }

                // Android
                else if (ionic.Platform.isAndroid()) {
                    StatusBar.backgroundColorByHexString('#b7212c');
                }
            }

            /**
             * App version plugin
             */
            cordova.getAppVersion.getVersionNumber().then(function (version) {
                $rootScope.appVersion = version;
            });

            /**
             * Instabug plugin
             */
            cordova.plugins.instabug.activate(
                {
                    android: INSTABUG_ANDROID_TOKEN,
                    ios: INSTABUG_IOS_TOKEN
                },
                'shake',
                {
                    commentRequired: true,
                    // enableIntroDialog: false
                },
                function () {
                    $log.debug('Instabug initialized.');
                },
                $log.error
            );
        });
    }]);
}());
