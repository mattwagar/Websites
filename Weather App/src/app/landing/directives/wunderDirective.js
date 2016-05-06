(function () {
    'use strict';

    angular
        .module('app.landing')
        .directive('mwWeatherGraph', mwWeatherGraph);

    function mwWeatherGraph() {
        return {
            templateUrl: 'app/landing/directives/wunderGraph.html',
            restrict: 'E',
            controller: GraphController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {}
        };
    }

    GraphController.$inject = ['wunderAsyncService', '$timeout'];

    function GraphController(wunderAsyncService, $timeout) {
        var vm = this;

        vm.wunderData = {weather: [{
            "date": "loading...",
            "time": "loading...",
            "temperature": "loading...",
            "humidity": "loading...",
            "windspeed": "loading...",
            "condition": "loading..."
        }]};


        var begin = performance.now();
        var end = null;

        wunderAsyncService.wunderJSON()
            .then(function (response) {
                console.log(wunderAsyncService.formatWeather(response.data));
                vm.wunderData = wunderAsyncService.formatWeather(response.data);
                end = performance.now();
                console.log("Async Call took: " + (end - begin));
            })
            .catch(function (error) {
                console.log(error);
            });

        $timeout(function () {


        }, 1250);

    }

})();
