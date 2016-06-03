namespace app {
    'use strict';

    interface ITemplate {
        example(): number;
    }
    

    class TemplateService {

        static $inject:any[] = [];
        constructor (/*define services in the $inject function here*/){ }
        

        example(num: number) {
          return num;
        }

      }
      
      angular
        .module('app.core')
        .service('TemplateService', TemplateService);

}
