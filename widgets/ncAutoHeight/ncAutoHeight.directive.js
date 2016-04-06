(function(window, document, $, angular) {
  'use strict';

  angular
    .module('nc.auto-height',[])
    .directive('ncAutoHeight', ncAutoHeight);

  ncAutoHeight.$inject = [];

  /* @ngInject */
  function ncAutoHeight() {

 
    var ncAutoHeight = {
      compile: compile,
      restrict: 'A',
    
    };
    return ncAutoHeight;

    function compile( element, attrs) {
       
        var height = attrs.ncAutoHeight ? attrs.ncAutoHeight : 150;
        var winHeight = $(window).height();
        height = Math.ceil(winHeight - height);
       
        element.height(height);
    }
  }


})(window, document, jQuery, angular);