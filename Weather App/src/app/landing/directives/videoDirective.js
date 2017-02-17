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
                video: '='
            }
        };
    }

        /* jshint ignore:start */
        VideoController.$inject = ['$scope', 'conditionService'];
        /* jshint ignore:end */

        function VideoController($scope, conditionService) {
            var vm = this;

            setTimeout(function(){
              console.log(vm.video);
            }, 5000);

        }
    })();
