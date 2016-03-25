(function(angular) {
    'use strict';
    angular
        .module('ncWidgets')
        .controller('ncLoadingCtrl', ncLoadingCtrl);

    ncLoadingCtrl.$inject = [];
    /* @ngInject */
    function ncLoadingCtrl() {
        var vm = this;
     

        for (var i = 1; i <= 10; i++) {
            vm['status' + i] = false;
            vm['options' + i] = {
                template: i
            };
        }
       

        vm.toggle = function() {
            for (var i = 1 ; i <= 10; i++) {
                 vm['status' + i] = !vm['status' + i];
            }
        }


    }
})(window.angular);
