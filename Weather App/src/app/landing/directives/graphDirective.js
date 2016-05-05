(function () {
    'use strict';

    angular
        .module('app.landing')
        .directive('mwWeatherGraph', mwWeatherGraph);

    function mwWeatherGraph() {
        return {
            templateUrl: 'app/landing/directives/graph.html',
            restrict: 'E',
            controller: GraphController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
              service: '='
            }
        };
    }

    GraphController.$inject = ['wunderAsyncService', '$timeout', 'forecastAsyncService', 'yahooAsyncService', 'colorCSS'];

    function GraphController(wunderAsyncService, $timeout, forecastAsyncService, yahooAsyncService, colorCSS) {
        var vm = this;

        vm.wunderData = {
            weather: [{
                "date": "loading...",
                "time": "loading...",
                "temperature": "loading...",
                "humidity": "loading...",
                "windspeed": "loading...",
                "condition": "loading..."
            }]
        };


        var begin = performance.now();
        var end = null;

        wunderAsyncService.wunderJSON()
            .then(function (response) {
                console.log(response.data);
                vm.wunderData = wunderAsyncService.formatWeather(response.data);
                end = performance.now();
                vm.wunderColor = colorCSS.applyColor(vm.wunderData.weather);
                console.log("wunderAsync Call took: " + (end - begin));
            })
            .catch(function (error) {
                console.log(error);
            });



        vm.forecastData = {
            weather: [{
                "date": "loading...",
                "time": "loading...",
                "temperature": "loading...",
                "humidity": "loading...",
                "windspeed": "loading...",
                "condition": "loading..."
            }]
        };

        var begin = performance.now();
        var end = null;

        forecastAsyncService.forecastJSON()
            .then(function (response) {
                console.log(response.data);
                vm.forecastData = forecastAsyncService.formatWeather(response.data);
                end = performance.now();
                console.log("Forecast.io Async Call took: " + (end - begin));
                vm.forecastColor = colorCSS.applyColor(vm.forecastData.weather);
                console.log(vm.forecastColor);
            })
            .catch(function (error) {
                console.log(error);
            });


        vm.yahooData = {
            weather: [{
                "date": "loading...",
                "time": "loading...",
                "temperature": "loading...",
                "humidity": "loading...",
                "windspeed": "loading...",
                "condition": "loading..."
        }]
        };

        var begin = performance.now();
        var end = null;

        yahooAsyncService.yahooJSON()
            .then(function (response) {
                console.log(response.data);
                vm.yahooData = yahooAsyncService.formatWeather(response.data);
                end = performance.now();
                console.log("Yahoo Async Call took: " + (end - begin));
                vm.yahooColor = colorCSS.applyColor(vm.yahooData.weather)
                console.log(vm.yahooData);
                console.log(vm.yahooColor);
            })
            .catch(function (error) {
                console.log(error);
            });




    }

})();
