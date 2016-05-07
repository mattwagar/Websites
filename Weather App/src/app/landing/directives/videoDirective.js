(function() {
    'use strict';

    angular
        .module('app.landing')
        .directive('mwVideo', mwVideo);

    function mwVideo() {
        return {
            templateUrl: 'app/landing/directives/video.html',
            restrict: 'E',
            controller: videoController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                service: '='
            }
        };

        GraphController.$inject = ['wunderAsyncService', '$timeout', 'forecastAsyncService', 'yahooAsyncService', 'colorCSS'];

        function videoController(wunderAsyncService, $timeout, forecastAsyncService, yahooAsyncService, colorCSS) {
          vm = this;


        }
    }
})();
