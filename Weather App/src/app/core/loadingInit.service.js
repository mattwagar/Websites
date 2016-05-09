(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('loadingInit', loadingInit);

    function loadingInit() {

        return {
            loadJSON: loadJSON
        };

        function loadJSON() {
            return {
                weather: [{
                    "date": "loading...",
                    "time": "loading...",
                    "temperature": "loading...",
                    "humidity": "loading...",
                    "windspeed": "loading...",
                    "condition": "loading..."
                }]
            };
        }

    }

})();
