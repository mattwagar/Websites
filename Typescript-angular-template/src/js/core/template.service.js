var app;
(function (app) {
    'use strict';
    var TemplateService = (function () {
        function TemplateService() {
        }
        TemplateService.prototype.example = function (num) {
            return num;
        };
        TemplateService.$inject = [];
        return TemplateService;
    }());
    angular
        .module('app.core')
        .service('TemplateService', TemplateService);
})(app || (app = {}));

//# sourceMappingURL=template.service.js.map
