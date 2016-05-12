(function() {
    'use strict';

    angular
        .module('app.landing')
        .directive('mwWeatherGraph', mwWeatherGraph);

    function mwWeatherGraph() {
        return {
            templateUrl: 'app/landing/directives/weatherGraph.html',
            restrict: 'E',
            controller: WeatherGraphController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                service: '=',
                colors: '=',
                title: '@',
                website: '@',
                icon:'='
            }
        };
    }

    WeatherGraphController.$inject = [];

    function WeatherGraphController() {
        var vm = this;

        console.log(vm.title);

    }
})();
