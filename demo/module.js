(function(angular) {
    'use strict';
    angular
        .module('ncWidgets')
        .config(demoConfigs);

    demoConfigs.$inject = ['$stateProvider','$urlRouterProvider'];

    function demoConfigs($stateProvider,$urlRouterProvider) {

        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    root: {
                        templateUrl: 'demo/nav.html'
                    }
                }
            })
            .state('app.treetable', {
                url: '/treetable',
                views: {
                    'content': {
                        templateUrl: 'demo/ncTreetable/index.html'
                    }
                }
            })
            .state('app.loading', {
                url: '/loading',
                views: {
                    'content': {
                        templateUrl: 'demo/ncLoading/index.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/treetable');
    }
})(window.angular);
