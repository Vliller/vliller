(function () {
    'use strict';

    angular
    .module('vliller')
    .run([
        '$ionicPlatform',
        '$rootScope',
        '$ionicSideMenuDelegate',
        '$log',
        'INSTABUG_ANDROID_TOKEN',
        'INSTABUG_IOS_TOKEN',
        function (
            $ionicPlatform,
            $rootScope,
            $ionicSideMenuDelegate,
            $log,
            INSTABUG_ANDROID_TOKEN,
            INSTABUG_IOS_TOKEN) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport from snapping when text inputs are focused. Ionic handles this internally for a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }

            // Status bar
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

            // Side menu
            $rootScope.side_menu = document.getElementsByTagName('ion-side-menu')[0];
            $rootScope.side_menu.style.visibility = 'hidden';

            $rootScope.$watch(function () {
                return $ionicSideMenuDelegate.isOpenRight();
            }, function (isOpen) {
                $rootScope.side_menu.style.visibility = isOpen ? 'visible' : 'hidden';
            });

            // store app version to $rootScope
            cordova.getAppVersion.getVersionNumber().then(function (version) {
                $rootScope.appVersion = version;
            });

            // Instabug
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
