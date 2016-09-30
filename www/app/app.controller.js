(function () {
    angular
    .module('vliller')
    .controller('AppController', ['$log', '$scope', '$rootScope', '$ionicSideMenuDelegate', function ($log, $scope, $rootScope, $ionicSideMenuDelegate) {
        var vm = this;

        $scope.$watch(function () {
            return $ionicSideMenuDelegate.isOpen();
        }, function (isOpen) {
            if (isOpen) {
                // replace map by screenshot
                // show sidemenu
            } else {
                $timeout(function () {
                    // hide sidemenu
                    // replace screenshot by map
                }, 1000); // animation time
            }
        });

        // $scope.showRightMenu = function () {
        //     if($ionicSideMenuDelegate.isOpenRight()){
        //         $ionicSideMenuDelegate.toggleRight();

        //         if ($rootScope.sectionmap) {
        //             LoaderService.show(1);

        //             $timeout(function() {
        //                 document.getElementById("side-menu").style.visibility = "hidden";

        //                 var image = document.getElementById("snapshot");
        //                 image.parentNode.removeChild(image);
        //                 LoaderService.hide(1);

        //                 $rootScope.map.setClickable(true);
        //             }, 300);
        //         }
        //     }
        //     else{
        //         if ($rootScope.sectionmap) {
        //             $rootScope.map.setClickable( false );

        //             $rootScope.map.toDataURL(function(imageData) {

        //                 var img = document.createElement('img');
        //                 img.src = imageData;
        //                 img.id = "snapshot";

        //                 document.getElementById("map_canvas").appendChild(img);

        //                 $timeout(function(){
        //                     document.getElementById("side-menu").style.visibility = "visible";

        //                     $ionicSideMenuDelegate.toggleRight();
        //                 },100);
        //             });
        //         } else {
        //             $ionicSideMenuDelegate.toggleRight();
        //         }
        //     }
        // };
    }]);
}());