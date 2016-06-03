var app;
(function (app) {
    'use strict';
    angular
        .module('app.landing')
        .config(configFunction);
    configFunction.$inject = ['$routeProvider'];
    function configFunction($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/landing/landing.html',
            controller: 'LandingController',
            controllerAs: 'vm'
        });
    }
})(app || (app = {}));

//# sourceMappingURL=config.route.js.map
