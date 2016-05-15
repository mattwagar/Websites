(function() {
  'use strict';

  angular
    .module('app', [
      // Angular modules.
      'ngRoute',

      // Custom modules.
      'app.landing',
      'app.core'
    ])
    .config(configFunction);

  configFunction.$inject = ['$routeProvider'];

  function configFunction($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  }
})();
