(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('wunderAsyncService', wunderAsyncService);

    function wunderAsyncService($http) {

        var service = null;
        var weatherJSON = null;

        var wunderJSON = function () {
            return $http.get('http://api.wunderground.com/api/53f04aff77545973/forecast10day/q/19104.json');

        };

        return {
            wunderJSON: wunderJSON,
            formatWeather: formatWeather,
            tempColor: tempColor
        };


        function formatWeather(JSONdata) {

            var cleanJSON = {
                "weather": []
            };

            for (var i = 0; i < 7; i += 1) {

                var day = JSONdata.forecast.simpleforecast.forecastday[i];

                var date = day.date.month + "/" + day.date.day;
                var time = day.date.hour - 12 + ":00";
                var temperature = day.high.fahrenheit;
                var humidity = day.avehumidity + "%";
                var windspeed = day.avewind.mph + " mph";
                var condition = day.conditions;

                var compiledJSON = {
                    "date": date,
                    "time": time,
                    "temperature": temperature,
                    "humidity": humidity,
                    "windspeed": windspeed,
                    "condition": condition,
                }

                cleanJSON.weather.push(compiledJSON);

            }

            return cleanJSON;

        }

function tempColor(temp_num) {
            var round5 = 0;
            
            var f = temp_num*2;
                f /= 10;
                f = Math.round(f);
                f *= 5;

            switch (f) {
            case 5:
                return '#84D9FF';
                break;
            case 10:
                return '#7DEBFE';
                break;
            case 15:
                return '#76FEFB';
                break;
            case 20:
                return '#6FFEE3';
                break;
            case 25:
                return '#68FDC9';
                break;
            case 30:
                return '#61FDAC';
                break;
            case 35:
                return '#5AFD8D';
                break;
            case 40:
                return '#53FC6C';
                break;
            case 45:
                return '#4FFC4C';
                break;
            case 50:
                return '#67FC45';
                break;
            case 55:
                return '#80FB3E';
                break;
            case 60:
                return '#9CFB37';
                break;
            case 65:
                return '#BAFB30';
                break;
            case 70:
                return '#DAFA2A';
                break;
            case 75:
                return '#FAF723';
                break;
            case 80:
                return '#FAD21C';
                break;
            case 85:
                return '#F9AB15';
                break;
            case 90:
                return '#F9810E';
                break;
            case 95:
                return '#F95507';
                break;
            case 100:
                return '#F92801';
                break;
            default:
                return;
            }
        }




    }

})();