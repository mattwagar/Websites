(function() {
    'use strict';

    angular
        .module('app.landing')
        .directive('mwVideo', mwVideo);

    function mwVideo() {
        return {
            templateUrl: 'app/landing/directives/video.html',
            restrict: 'E',
            controller: VideoController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                service: '='
            }
        };

        /* jshint ignore:start */
        VideoController.$inject = [];
        /* jshint ignore:end */

        function VideoController() {
            var vm = this;


        }
    }
})();
