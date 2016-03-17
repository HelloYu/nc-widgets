(function(angular) {
    'use strict';
    angular
        .module('ncWidgets')
        .controller('TreeTableCtrl', TreeTableCtrl);

    TreeTableCtrl.$inject = ['$scope'];
    /* @ngInject */
    function TreeTableCtrl($scope) {
        var vm = this;
        vm.options = {
          checked: [1,2,5],
          withInput: {
            type: 'checkbox',
            width: '10px',
          }
        };

        $scope.$watch('vm.options.selected', function(newVal, oldVal, scope) {

            console.info(newVal);
            console.info(oldVal);
        });
        vm.data = [
          {id:1,name:1},
          {id:2,name:2,parentId:1},
          {id:3,name:3,parentId:2},
          {id:4,name:4},
          {id:5,name:5,parentId:4},
          {id:6,name:6,parentId:''},
        ];
        vm.change = function() {
            var tmp = [];

            for (var i = 1; i < 1000; i++) {
                var parentId = (Math.ceil(i % (Math.random() * 10)));
                parentId = parentId != i ? parentId : '';

                tmp.push({
                    id: i,
                    name: i,
                    parentId: parentId
                })
            }


            vm.data = tmp;
        }

        vm.changeChecked = function() {
          vm.options.checked = [2,3,4,5,9];
        }

    }
})(window.angular);
