(function() {
    'use strict';

    angular
        .module('app.landing')
        .directive('mwGraphs', mwGraphs);

    function mwGraphs() {
        return {
            templateUrl: 'app/landing/directives/graph.html',
            restrict: 'E',
            controller: GraphController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                weather: '='
            }
        };
    }

    GraphController.$inject = ['colorCSS', '$scope'];

    function GraphController(colorCSS, $scope) {
        var vm = this;

        vm.wunderWebsite = ['https://www.wunderground.com/', 'content/images/wunder.png'];
        vm.forecastWebsite = ['http://forecast.io/', 'content/images/favicon.ico'];
        vm.yahooWebsite = ['https://www.yahoo.com/news/weather/', 'content/images/yahoo.ico'];
        vm.wwonlineWebsite = ['http://us.worldweatheronline.com/', 'content/images/wwonline.png'];


        $scope.$watch('vm.weather.wunderground', function(before, after) {
            vm.wunderColor = colorCSS.applyColor(vm.weather.wunderground.weather);
        });

        $scope.$watch('vm.weather.forecastio', function(before, after) {
            vm.forecastColor = colorCSS.applyColor(vm.weather.forecastio.weather);
        });

        $scope.$watch('vm.weather.yahoo', function(before, after) {
            vm.yahooColor = colorCSS.applyColor(vm.weather.yahoo.weather);
        });

        $scope.$watch('vm.weather.wwonline', function(before, after) {
            vm.wwonlineColor = colorCSS.applyColor(vm.weather.wwonline.weather);
        });
    }
})();
