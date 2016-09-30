(function () {
    angular
    .module('vliller.sidemenu')
    .controller('SidemenuController', ['ANDROID_APP_ID', 'IOS_APP_ID', function (ANDROID_APP_ID, IOS_APP_ID) {
        var vm = this;

        vm.rateApp = function () {
            if (ionic.Platform.isAndroid()) {
                window.open('market://details?id=' + ANDROID_APP_ID);
            } else if (ionic.Platform.isIOS()) {
                window.open('itms-apps://itunes.apple.com/fr/app/vliller/id' + IOS_APP_ID + '?mt=8');
            } else {
                console.error('Unknow platform?!');
            }
        };

    }]);
}());