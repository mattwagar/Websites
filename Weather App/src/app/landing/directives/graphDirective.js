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
            scope: {}
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

                vm.wunderColor = [];
                vm.humid_wunderColor = [];
                for (var i in vm.wunderData.weather) {
                    vm.wunderColor.push(colorCSS.tempColor(vm.wunderData.weather[i].temperature));
                    vm.humid_wunderColor.push(colorCSS.humidColor(vm.wunderData.weather[i].humidity));
                }
                console.log(vm.humid_wunderColor);

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
                console.log("Forecase.io Async Call took: " + (end - begin));
                vm.forecastColor = [];
                vm.humid_forecastColor = [];
                for (var i in vm.forecastData.weather) {
                    vm.forecastColor.push(colorCSS.tempColor(vm.forecastData.weather[i].temperature));
                    vm.humid_forecastColor.push(colorCSS.humidColor(vm.wunderData.weather[i].humidity));
                }
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
                vm.yahooColor = [];
                for (var i in vm.yahooData.weather) {
                    vm.yahooColor.push(colorCSS.tempColor(vm.yahooData.weather[i].temperature));
                }
                console.log(vm.yahooColor);
            })
            .catch(function (error) {
                console.log(error);
            });




    }

})();
