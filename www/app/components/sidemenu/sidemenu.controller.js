(function () {
    angular
    .module('vliller.sidemenu')
    .controller('SidemenuController', ['ANDROID_APP_ID', 'IOS_APP_ID', 'VLILLER_SITE_URL', function (ANDROID_APP_ID, IOS_APP_ID, VLILLER_SITE_URL) {
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
                console.error('Unknow platform?!');
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
            cordova.plugins.instabug.invoke('bug');
        };

        /**
         * Show system social sharing to share the Vliller landing page.
         */
        vm.openSocialSharing = function () {
            window.plugins.socialsharing.shareWithOptions({
                url: VLILLER_SITE_URL
            });
        };
    }]);
}());