(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('yahooAsyncService', yahooAsyncService);

    function yahooAsyncService($http) {

        var service = null;
        var weatherJSON = null;
        
        var yahooJSON = function(){
        return $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22philadelphia%2C%20pa%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
            
        
        };
        
        return {
            yahooJSON: yahooJSON,
            formatWeather: formatWeather
        };
        
        
        function monthNum(string){
            switch(string){
                case "Jan":
                    return "1";
                    break;
                case "Feb":
                    return "2";
                    break;
                case "Mar":
                    return "3";
                    break;
                case "Apr":
                    return "4";
                    break;
                case "May":
                    return "5";
                    break;
                case "Jun":
                    return "6";
                    break;
                case "Jul":
                    return "7";
                    break;
                case "Aug":
                    return "8";
                    break;
                case "Sep":
                    return "9";
                    break;
                case "Oct":
                    return "10";
                    break;
                case "Nov":
                    return "11";
                    break;
                case "Dec":
                    return "12";
                    break;
                default:
                    return "N/A";
            }
                    
        }
        
        
        function formatWeather(JSONdata) {
            
            
            
            var cleanJSON = {
                "weather": []
            };

            for (var i = 0; i < 7; i += 1) {

                var day = JSONdata.query.results.channel.item.forecast[i];
                
                var formatMonth = monthNum(day.date.substring(3,6));
                
                var formatDate = day.date.substring(0,2);
                
                if(formatDate[0]=="0"){
                    formatDate = formatDate[1];
                }
                
                
                var date = formatMonth + "/" + formatDate;
                var time = "N/A"
                var temperature = parseInt(day.high);
                var humidity = "N/A";
                var windspeed = "N/A";
                var condition = day.text;

                var compiledJSON = {
                    "date": date,
                    "time": time,
                    "temperature": temperature,
                    "humidity": humidity,
                    "windspeed": windspeed,
                    "condition": condition
                }

                cleanJSON.weather.push(compiledJSON);

            }

            return cleanJSON;

        }

    }

})();