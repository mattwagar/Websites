(function() {
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

    GraphController.$inject = ['wunderAsyncService', '$timeout', 'forecastAsyncService', 'yahooAsyncService', 'colorCSS', 'wwonlineAsyncService'];

    function GraphController(wunderAsyncService, $timeout, forecastAsyncService, yahooAsyncService, colorCSS, wwonlineAsyncService) {
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
            .then(function(response) {
                console.log("Wunderground Restful JSON Data:");
                console.log(response.data);
                vm.wunderData = wunderAsyncService.formatWeather(response.data);
                end = performance.now();
                vm.wunderColor = colorCSS.applyColor(vm.wunderData.weather);
                console.log("wunderAsync Call took: " + (end - begin));
            })
            .catch(function(error) {
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
            .then(function(response) {
                console.log("Forecast.io Restful JSON Data:");
                console.log(response.data);
                vm.forecastData = forecastAsyncService.formatWeather(response.data);
                end = performance.now();
                console.log("Forecast.io Async Call took: " + (end - begin));
                vm.forecastColor = colorCSS.applyColor(vm.forecastData.weather);
                console.log(vm.forecastColor);
            })
            .catch(function(error) {
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
            .then(function(response) {
                console.log("Yahoo Restful JSON Data:");
                console.log(response.data);
                vm.yahooData = yahooAsyncService.formatWeather(response.data);
                end = performance.now();
                console.log("Yahoo Async Call took: " + (end - begin));
                vm.yahooColor = colorCSS.applyColor(vm.yahooData.weather);
            })
            .catch(function(error) {
                console.log(error);
            });


        vm.wwonlineData = {
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

        wwonlineAsyncService.wwonlineJSON()
            .then(function(response) {
                console.log("World Weather Online Restful JSON Data:");
                console.log(response.data.data);
                vm.wwonlineData = wwonlineAsyncService.formatWeather(response.data.data);
                end = performance.now();
                console.log("World Weather Online Async Call took: " + (end - begin));
                vm.wwonlineColor = colorCSS.applyColor(vm.wwonlineData.weather);
            })
            .catch(function(error) {
                console.log(error);
            });




    }

})();
