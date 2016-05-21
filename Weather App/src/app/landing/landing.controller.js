(function() {
    'use strict';

    angular
        .module('app.landing')
        .controller('LandingController', LandingController);

    LandingController.$inject = ['wunderAsyncService', 'forecastAsyncService', 'yahooAsyncService', 'wwonlineAsyncService', 'loadingInit'];

    function LandingController(wunderAsyncService, forecastAsyncService, yahooAsyncService, wwonlineAsyncService, loadingInit) {
        var vm = this;

        vm.allWeatherData = {
            "average": loadingInit.loadJSON(),
            "wunderground": loadingInit.loadJSON(),
            "forecastio": loadingInit.loadJSON(),
            "yahoo": loadingInit.loadJSON(),
            "wwonline": loadingInit.loadJSON()
        };

        wunderAsyncService.wunderJSON()
            .then(function(response) {
                console.log("Wunder Data: ");
                console.log(response.data);
                vm.allWeatherData.wunderground = wunderAsyncService.formatWeather(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });

        forecastAsyncService.forecastJSON()
            .then(function(response) {
                console.log("Forecast.io Data: ");
                console.log(response.data);
                vm.allWeatherData.forecastio = forecastAsyncService.formatWeather(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });

        yahooAsyncService.yahooJSON()
            .then(function(response) {
                console.log("Yahoo Data: ");
                console.log(response.data);
                vm.allWeatherData.yahoo = yahooAsyncService.formatWeather(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });

        wwonlineAsyncService.wwonlineJSON()
            .then(function(response) {
                console.log("WWOnline Data: ");
                console.log(response.data.data);
                vm.allWeatherData.wwonline = wwonlineAsyncService.formatWeather(response.data.data);
                console.log(vm.allWeatherData);
            })
            .catch(function(error) {
                console.log(error);
            });

    }

})();
