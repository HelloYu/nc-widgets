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
           
            withInput: {
                type: 'checkbox',
                width: '1em',

            },
            column: 1,
            allowAutoExpand:false
        };
       
     
        vm.data = [
            { id: 1, name: '这是很长的测试数据没有什么实际意义哈哈', hasChildren: 1},
            { id: 2, name: 2, parentId: 1, hasChildren: 1 },
            { id: 3, name: 3, parentId: 2 },
            { id: 4, name: 4 ,hasChildren: 1},
            { id: 5, name: 5, parentId: 4 },
            { id: 6, name: 6, parentId: '' },
        ];

        vm.dynamicData = [];
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
        $scope.$watch(function(){
            return (vm.options.checked);
        },function(newVal,oldVal){
            debugger;
        },true);

        $scope.$watchCollection(function(){
            return (vm.options.expanded);
        },function(newVal,oldVal){
            debugger;
        });

        vm.changeChecked = function() {
            vm.options.checked = [2];
        }
        vm.getDynamicData = function() {
       
           vm.dynamicData = [
                { id: 7, name: 7 },
                { id: 8, name: 8, parentId: 1 },
                { id: 9, name: 9, parentId: 2 },
                { id: 10, name: 10 },
                { id: 11, name: 11, parentId: 4 },
                { id: 12, name: 12, parentId: 5 },
                { id: 13, name: 13, parentId: 6 },
            ]
        }

    }
})(window.angular);