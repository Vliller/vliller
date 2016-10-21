(function () {
    angular
    .module('vliller.sidemenu')
    .controller('SidemenuController', [
        '$log',
        '$rootScope',
        '$ionicSideMenuDelegate',
        'ANDROID_APP_ID',
        'IOS_APP_ID',
        'VLILLER_SITE_URL',
        function (
            $log,
            $rootScope,
            $ionicSideMenuDelegate,
            ANDROID_APP_ID,
            IOS_APP_ID,
            VLILLER_SITE_URL) {
        var vm = this;

        /**
         * Open the app store page
         */
        vm.rateApp = function () {
            if (ionic.Platform.isAndroid()) {
                cordova.InAppBrowser.open('market://details?id=' + ANDROID_APP_ID, '_system');
            } else if (ionic.Platform.isIOS()) {
                cordova.InAppBrowser.open('itms-apps://itunes.apple.com/fr/app/vliller/id' + IOS_APP_ID + '?mt=8', '_system');
            } else {
                $log.error('Rate app - Unknow platform?!');
            }
        };

        /**
         *
         * @param String link
         */
        vm.openLink = function (link) {
            cordova.InAppBrowser.open(link, '_system');
        };

        /**
         * Show Instabug form
         */
        vm.openBugReport = function () {
            // defines some usefull properties
            window.doorbell.setProperty('version', $rootScope.appVersion);
            window.doorbell.setProperty('platform', ionic.Platform.device());

            // open the box
            window.doorbell.show();
        };

        /**
         * Show system social sharing to share the Vliller landing page.
         */
        vm.openSocialSharing = function () {
            window.plugins.socialsharing.shareWithOptions({
                url: VLILLER_SITE_URL
            });
        };

        /**
         * Close side menu
         */
        vm.close = function () {
            $ionicSideMenuDelegate.toggleRight(false);
        };
    }]);
}());