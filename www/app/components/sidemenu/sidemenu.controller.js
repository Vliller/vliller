(function () {
    angular
    .module('vliller.sidemenu')
    .controller('SidemenuController', ['ANDROID_APP_ID', 'IOS_APP_ID', function (ANDROID_APP_ID, IOS_APP_ID) {
        var vm = this;

        /**
         * Open the app store page
         */
        vm.rateApp = function () {
            if (ionic.Platform.isAndroid()) {
                window.open('market://details?id=' + ANDROID_APP_ID);
            } else if (ionic.Platform.isIOS()) {
                window.open('itms-apps://itunes.apple.com/fr/app/vliller/id' + IOS_APP_ID + '?mt=8');
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
    }]);
}());