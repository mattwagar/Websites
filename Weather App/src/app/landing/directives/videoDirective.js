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
                weather: '='
            }
        };

        /* jshint ignore:start */
        VideoController.$inject = ['$scope', conditionService];
        /* jshint ignore:end */

        function VideoController($scope, conditionService) {
            var vm = this;
            $scope.$watch('vm.weather.wunderground', function(before, after) {
                vm.wunderVideo = conditionService.videoCondition(vm.weather.wunderground.weather[0].condition);
            });

            vm.video = 'content/videos/Into-The-Woods.mp4';

        }
    }
})();
