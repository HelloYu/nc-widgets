(function(angular) {
    'use strict';

    angular
        .module('nc.loading', [])
        .directive('ncLoading', ncLoading);

    /**
     * 
     * @class ncLoading
     *    
     * 
     * ## 使用说明
     * 暂时有10个模板，从1-10编号，载入nc-widgets.min.css文件，引用js脚本，注入模块`nc.Loading`。
     *      
     *      <div nc-loading="vm.loading" ><div>被包裹的内容</div></div>
     * 
     * 运行gulp可进行demo查看。 
     *  
     * 
     */
    ncLoading.$inject = [];

    /* @ngInject */
    function ncLoading() {

        var ncLoading = {

            link: link,
            restrict: 'A',
            scope: {
                /**
                 * 设置Loading状态，true显示，false隐藏
                 * @property {Boolean}   
                 *    
                 * 
                 */
                ncLoading: '=',
                /**
                 * 参数设置接口，设置参数参见config属性
                 * @property {Object}  
                 *   
                 * 
                 */
                ncLoadingOptions: '=?'
            }
        };
        return ncLoading;

        function link(scope, element, attrs) {

            var options = angular.extend({
                /**
                 * 
                 * @cfg 选择显示的模板
                 *    
                 *
                 */
                template: 9,
                /**
                 * 
                 * @cfg 设置遮罩的背景颜色
                 *    
                 *
                 */
                bgColor: 'rgba(0, 0, 0, .2)'
            }, scope.ncLoadingOptions);


            var loading = $('<div></div>');
            loading.append(loadingTemplates[options.template]);
            loading.addClass('nc-loading');
            loading.css('background-color', options.bgColor);
            element.css('position', 'relative');
            element.append(loading);

            scope.$watch('ncLoading', function(newVal, oldVal) {
                if (newVal != undefined) {
                    if (newVal) {
                        loading.show();
                    } else {
                        loading.hide();
                    }
                }
            });

        }
    }

    var loadingTemplates = {
        1: ' <div class="nc-loading-type nc-loading-type-1 "> <div class="nc-loading-line"></div> <div class="nc-loading-line"></div> <div class="nc-loading-line"></div></div>',
        2: ' <div class="nc-loading-type nc-loading-type-2 "> <div class="nc-loading-line"></div> <div class="nc-loading-line"></div> <div class="nc-loading-line"></div></div>',
        3: ' <div class="nc-loading-type nc-loading-type-3 "> <div class="nc-loading-line"></div> <div class="nc-loading-line"></div>  <div class="nc-loading-line"></div></div>',
        4: ' <div class="nc-loading-type nc-loading-type-4 "> <div class="nc-loading-ring-1"></div></div>',
        5: ' <div class="nc-loading-type nc-loading-type-5 "> <div class="nc-loading-ring-2"><div class="nc-loading-ball-holder"><div class="nc-loading-ball"></div></div></div>',
        6: ' <div class="nc-loading-type nc-loading-type-6 "><div class="nc-loading-letter-holder"><div class="nc-loading-delay-1 nc-loading-letter">L</div><div class="nc-loading-delay-2 nc-loading-letter">o</div><div class="nc-loading-delay-3 nc-loading-letter">a</div><div class="nc-loading-delay-4 nc-loading-letter">d</div><div class="nc-loading-delay-5 nc-loading-letter">i</div><div class="nc-loading-delay-6 nc-loading-letter">n</div><div class="nc-loading-delay-7 nc-loading-letter">g</div><div class="nc-loading-delay-8 nc-loading-letter">.</div><div class="nc-loading-delay-9 nc-loading-letter">.</div><div class="nc-loading-delay-10 nc-loading-letter">.</div></div>',
        7: '<div class="nc-loading-type nc-loading-type-7"><div class="nc-loading-square-holder"><div class="nc-loading-square"></div></div></div>',
        8: '<div class="nc-loading-type nc-loading-type-8"><div class="nc-loading-line"></div></div>',
        9: '<div class="nc-loading-type nc-loading-type-9"> <div class="nc-loading-spinner"><div class="nc-loading-bubble-1"></div><div class="nc-loading-bubble-2"></div></div></div>',
        10: '<div class="nc-loading-type nc-loading-type-10"><div class="nc-loading-bar"></div></div>'
    }

})(window.angular);
