(function(angular) {
    'use strict';

    angular
        .module('nc-widgets')
        .directive('ncRadioBox', ncRadioBox);
    /**
     * 
     * @class ncRadioBox
     *    
     * 
     * ### Usage
     * 
     *     <nc-radio-box  nc-options="vm.options"></nc-radio-box>
     * 
     * ```javascript
     * function Controller($scope) {
     *     var vm = this;
     *     vm.options = {
	 *         selected: '',
	 *         data: [
     *             {id: '1', name: 'Tim'}
     *             {id: '2', name: 'Jim'}
     *             {id: '3', name: 'Dim'}
     *         ]
     *     }
     *     $scope.$watch('vm.options.selected',function(newValue, oldValue) {
     *         if ( newValue != oldValue ) {
     *             // 进行数据更新操作等
     *         }
     *     })
     * }
     * ```
     * 
     */
    function ncRadioBox() {


        return {
            restrict: 'E',
            replace: true,
            template: '<form><table style="border:1px solid;" width="100%" height="100%" cellspacing="0"> ' +
                '<tr ng-repeat="item in ncOptions.data " ng-style={"background-color":$odd?"#f9f9f9":none} >' +
                '<td width="10%"><input type="radio" ng-model="ncOptions.selected" value="{{item.id}}"></td>' +
                '<td style="border-left:1px solid">{{item.name}}</td>' +
                '</tr></table></form>',
            scope: {

               
                /**
                 * 
                 * @cfg {Object} nc-options
                 * 配置选项，包括数据
                 * ### 数据格式
                 * ```javascript
                 * var options = {
    			 *   
                 *   selected: '',
                 *   data:[
                 *      {id:'1',name:'Tim'},
                 *      {id:'2',name:'Jim'},
                 *      {id:'3',name:'Rom'},
                 *   ]
                 * }
                 * ```
                 * `selected`会被设置成选中的id，也可能是对象，看具体情况
                 */
                ncOptions: '='
            },



        }
    }


})(window.angular);
