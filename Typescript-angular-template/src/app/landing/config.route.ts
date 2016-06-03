namespace app {
    'use strict';

    angular
        .module('app.landing')
        .config(configFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider: ng.route.IRouteProvider): void {
        $routeProvider.when('/', {
            templateUrl: 'app/landing/landing.html',
            controller: 'LandingController',
            controllerAs: 'vm'
        });
    }

}
