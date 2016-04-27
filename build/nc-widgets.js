// version: v1.0.32
// date: 2016-4-27
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
    ncLoading.$inject = ['$templateRequest'];

    /* @ngInject */
    function ncLoading($templateRequest) {

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

            }, scope.ncLoadingOptions);


            var loading = $('<div></div>');
            
            // 这样的方式不太好。
            if (options.templateUrl) {
                $templateRequest(options.templateUrl).then(function(html) {
                    loading.append(html);
                })
            } else {
                loading.append(loadingTemplates[options.template]);
            }

            loading.addClass('nc-loading');

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
        1: '<div class="nc-loading-type nc-loading-type-1 "> <div class="nc-loading-line"></div> <div class="nc-loading-line"></div> <div class="nc-loading-line"></div></div>',
        2: '<div class="nc-loading-type nc-loading-type-2 "> <div class="nc-loading-line"></div> <div class="nc-loading-line"></div> <div class="nc-loading-line"></div></div>',
        3: '<div class="nc-loading-type nc-loading-type-3 "> <div class="nc-loading-line"></div> <div class="nc-loading-line"></div>  <div class="nc-loading-line"></div></div>',
        4: '<div class="nc-loading-type nc-loading-type-4 "> <div class="nc-loading-ring-1"></div></div>',
        5: '<div class="nc-loading-type nc-loading-type-5 "> <div class="nc-loading-ring-2"><div class="nc-loading-ball-holder"><div class="nc-loading-ball"></div></div></div>',
        6: '<div class="nc-loading-type nc-loading-type-6 "><div class="nc-loading-letter-holder"><div class="nc-loading-delay-1 nc-loading-letter">L</div><div class="nc-loading-delay-2 nc-loading-letter">o</div><div class="nc-loading-delay-3 nc-loading-letter">a</div><div class="nc-loading-delay-4 nc-loading-letter">d</div><div class="nc-loading-delay-5 nc-loading-letter">i</div><div class="nc-loading-delay-6 nc-loading-letter">n</div><div class="nc-loading-delay-7 nc-loading-letter">g</div><div class="nc-loading-delay-8 nc-loading-letter">.</div><div class="nc-loading-delay-9 nc-loading-letter">.</div><div class="nc-loading-delay-10 nc-loading-letter">.</div></div>',
        7: '<div class="nc-loading-type nc-loading-type-7"><div class="nc-loading-square-holder"><div class="nc-loading-square"></div></div></div>',
        8: '<div class="nc-loading-type nc-loading-type-8"><div class="nc-loading-line"></div></div>',
        9: '<div class="nc-loading-type nc-loading-type-9"> <div class="nc-loading-spinner"><div class="nc-loading-bubble-1"></div><div class="nc-loading-bubble-2"></div></div></div>',
        10: '<div class="nc-loading-type nc-loading-type-10"><div class="nc-loading-bar"></div></div>'
    }

})(window.angular);

(function(angular, $) {
    'use strict';

    angular
        .module('nc.treetable', [])
        .directive('ncTreetable', ncTreeTable);

    ncTreeTable.$inject = ['$compile'];

    /**
     * 
     * @class ncTreetable
     * 
     * ## 使用说明
     *
     * 模块注入`nc.treetable`
     * 
     * ```javascript
     * // 在html中使用标签
     * <table nc-treetable nc-options="vm.options" nc-data="vm.data"></table>
     *
     * // 其中option格式如下：
     * var options = {
     *      withInput: {
     *          type: 'checkbox',
     *          width: '20px',
     *          name: 'radio' // 如果type是radio，name值必须唯一
     *      }
     *      // 其它参数，请查看Config options
     * }
     * 
     *
     * // 数据格式如下：
     * var data = [
     *  {id:'1',name:'A',parentId:''},
     *  {id:'2',name:'A-1',parentId:'1'},
     *  {id:'3',name:'A-1-1',parentId:'2'},
     *  {id:'4',name:'B',parentId:''},
     * ] 
     * 
     * ```
     * 
     * 设置完参数和数据之后，可以在controller中设置watch，如果用户选中某行，执行相应操作
     * 
     * ```javascript
     * function TreetableCtrl($scope) {
     *   var vm = this;
     *   var vm.options = optionObject;
     *   $scope.$watch('vm.options.selected',function(newVal,oldVal){
     *      if (newVal != oldVal) {
     *          // 新老数据不一样，说明用户进行了操作
     *          // 执行某些操作，可以是根据用户选中的id去获取新的数据等。
     *      }   
     *    });
     * }
     * ```    
     * ## 使用场景
     * 随着nc-treetable慢慢变大，也变的更加复杂，有些功能是通过几个参数组合而成，简单介绍一些组合。
     * ### 无选择框
     * 无选择框就是将`withInput`对象置空`{}`, 再将`column`设置成`0`，这样就是一棵单纯的树表，可以通过`selectedColor`设置选中背景颜色。
     * ### 动态数据
     * 有时候数据是动态加载进来的，所以提供一个数据接口，用来完成动态加载，在元素上是`nc-dynamic-data`，数据格式和nc-data一样。
     * 
     */
    /* @ngInject */
    function ncTreeTable($compile) {

        function Node(row, tree, settings) {
            this.id = row.attr(settings.nodeIdAttr);
            this.row = row;
            this.tree = tree;
            this.children = [];
            this.initialized = false;
            this.settings = settings;
            this.parentId = this._getParentId(row, settings.parentIdAttr);
            this.childrenCount = this._getChildrenCount(row, settings.childrenCountAttr);

            this.bgColor = null;


            this.treeCell = $(this.row.children(this.settings.columnElType)[this.settings.column]);
            this.expander = $(this.settings.expanderTemplate);
            this.reducer = $(this.settings.reducerTemplate);
            this.toggleBtn = $('<span style="float:right"></span>');
            this.indenter = $(this.settings.indenterTemplate);
            this.treeCell.prepend(this.indenter);

        }

        Node.prototype.toggle = function() {


            if (this.expanded()) {
                this.collapse();


            } else {
                this.expand();

            }
            return this;
        };

        Node.prototype.show = function() {

            if (!this.initialized) {
                this._initialize();
            }

            this.row.show();

            if (this.expanded()) {
                this._showChildren();
            }
            return this;
        };

        Node.prototype.hide = function() {
            this._hideChildren();
            this.row.hide();
            return this;
        };
        Node.prototype._hideChildren = function() {
            var child, _i, _len, _ref, _results;
            _ref = this.children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                _results.push(child.hide());
            }
            return _results;
        };

        Node.prototype._showChildren = function() {
            var child, _i, _len, _ref, _results;
            _ref = this.children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                _results.push(child.show());
            }
            return _results;
        };
        Node.prototype.collapsed = function() {
            return this.row.hasClass("collapsed");
        };

        Node.prototype.parentNode = function() {
            if (this.parentId !== null) {
                return this.tree[this.parentId];
            } else {
                return null;
            }
        };
        Node.prototype._initialize = function() {
            var settings = this.settings;

            this.render();

            if (settings.expandable === true && settings.initialState === "collapsed") {
                this.collapse();
            } else {
                console.info('expand');
                this.expand();
            }

            return this.initialized = true;
        };

        Node.prototype._getParentId = function(node, parentIdAttr) {
            var parentId = node.attr(parentIdAttr);
            if (parentId !== null && parentId !== "") {
                return parentId;
            }
        };

        Node.prototype._getChildrenCount = function(node, childrenCount) {
            var childrenCount = node.attr(childrenCount);
            if (childrenCount !== null && childrenCount !== "") {
                return childrenCount;
            }
        };

        Node.prototype.setBgColorAndSelect = function(node) {
            var noWithInput = $.isEmptyObject(this.settings.withInput);
            // 只有没有withInput才进行设置颜色
            if (!this.bgColor && noWithInput) {
                this.bgColor = this.row.css('background-color');
            }
            // 保证只有一个row被设置颜色
            if (noWithInput) {
                if (this.tree.selected != undefined) {
                    this.tree.selected.css('background', this.bgColor);
                    this.tree.selected.removeClass('nc-treetable-selected');
                }
                this.tree.selected = this.row;
                this.row.css('background', this.settings.selectedColor);
                this.tree.selected.addClass('nc-treetable-selected');

                // 先清空selected，再设置，唯一
                this.settings.selected = [];
                this.settings.selected.push(this.id);

            }
        }
        Node.prototype.render = function() {
            var handler,
                settings = this.settings,
                target;

            target = settings.clickableNodeNames === true ? this.treeCell : this.toggleBtn;

            if (settings.expandable === true && this.isBranchNode()) {
                handler = function(e) {

                    e.data.node.setBgColorAndSelect();

                    e.data.node.tree[$(this).parents("tr").attr(settings.nodeIdAttr)].toggle();
                    return e.preventDefault();
                };

                // 分支结点默认expander
                this.toggleBtn.html(this.expander);
                // this.indenter.html(this.toggleBtn);
                this.treeCell.append(this.toggleBtn);
                (function(node) {
                    target.off("click").on("click", { node: node }, handler);
                })(this);

            } else {


                if (this.childrenCount > 0) {
                    // 分支结点默认expander
                    this.toggleBtn.html(this.expander);
                    // this.indenter.html(this.toggleBtn);
                    this.treeCell.append(this.toggleBtn);
                }

                (function(node) {
                    target.off("click").on("click", { node: node }, function(e) {
                        e.data.node.setBgColorAndSelect();
                        // 这里的toggle只会显示自身节点，孩子节点需要动态加载进来
                        if (node.childrenCount > 0) {
                            e.data.node.tree[$(this).parents("tr").attr(settings.nodeIdAttr)].toggle();

                        }

                    });
                })(this);

            }


            this.indenter[0].style.paddingLeft = "" + (this.level() * settings.indent) + settings.unit;

            return this;
        };

        Node.prototype.isBranchNode = function() {
            if (this.childrenCount > 0 || this.children.length > 0 ||
                this.row.data(this.settings.branchAttr) === true) {
                return true;
            } else {
                return false;
            }
        };
        Node.prototype.updateBranchLeafClass = function() {
            this.row.removeClass('branch');
            this.row.removeClass('leaf');
            this.row.addClass(this.isBranchNode() ? 'branch' : 'leaf');
        };
        Node.prototype.ancestors = function() {
            var ancestors, node;
            node = this;
            ancestors = [];
            while (node = node.parentNode()) {
                ancestors.push(node);
            }
            return ancestors;
        };

        // 返回结点层数,层节点padding使用
        Node.prototype.level = function() {
            return this.ancestors().length;
        };

        Node.prototype.addChild = function(child) {
            return this.children.push(child);
        };
        Node.prototype.expanded = function() {
            return this.row.hasClass("expanded");
        };
        // 折叠所有孩子结点
        Node.prototype.collapse = function() {
            if (this.collapsed()) {
                return this;
            }
            // 变换按钮
            this.toggleBtn.html(this.expander);
            this.row.removeClass("expanded").addClass("collapsed");

            this._hideChildren();
            this.expander.attr("title", this.settings.stringExpand);

            return this;
        };
        Node.prototype.expand = function() {
            if (this.expanded()) {
                return this;
            }

            this.toggleBtn.html(this.reducer);

            this.row.removeClass("collapsed").addClass("expanded");

            // 项目中组件
            // if ($(this.row).is(":visible")) {

            this._showChildren();
            // }

            this.expander.attr("title", this.settings.stringCollapse);

            return this;
        };

        Node.prototype.setChecked = function() {

            this.row.find('input:first').prop('checked', true);
            return this;
        };

        Node.prototype.setUnChecke = function() {

            this.row.find('input:first').prop('checked', false);
            return this;
        };

        function Tree(settings) {
            this.tree = {};
            this.settings = settings;
            // 动态数据缓存
            this.dynamicNodesCache = [];
            this.isDynamicData = false;
            // 保存当前选中的节点，并设置颜色
            this.selected = {}

            // 缓存节点
            this.nodes = [];
            this.roots = [];
        }

        // 载入每一条数据
        Tree.prototype.loadRows = function(rows) {
            var node, row, i;

            if (rows !== null) {
                for (i = 0; i < rows.length; i++) {

                    row = this._toJQueryDOM(rows[i]);

                    node = new Node(row, this.tree, this.settings);

                    this.nodes.push(node);

                    if (this.isDynamicData) {
                        this.dynamicNodesCache.push(node);
                    }

                    this.tree[node.id] = node;

                    if (node.parentId !== null && this.tree[node.parentId]) {
                        this.tree[node.parentId].addChild(node);
                    } else {
                        this.roots.push(node);
                    }

                }
            }

            // 所有数据组合完毕，更新信息
            for (i = 0; i < this.nodes.length; i++) {
                node = this.nodes[i].updateBranchLeafClass();
            }


            return this;
        };

        Tree.prototype._toJQueryDOM = function(row) {
            var tr = $('<tr></tr>'),
                i,
                len = this.settings.columNames.length,
                td,
                col,
                settings = this.settings,
                withInput = this.settings.withInput;

            tr.attr(settings.nodeIdAttr, row.id);
            tr.attr(settings.parentIdAttr, row.parentId);

            // 设置孩子数，动态加载需要使用
            tr.attr(settings.childrenCountAttr, row.hasChildren);


            if (withInput && !$.isEmptyObject(withInput)) {

                var select = $('<input type="' + withInput.type + '"/>');
                if (withInput.type == 'radio') {
                    select.attr('name', withInput.name);
                }

                // 如果是radio多次点击不会重复添加

                (function(row, settings) {
                    select.on('click', {
                        id: row.id,
                        settings: settings
                    }, function(e) {
                        var type = withInput.type,
                            id = e.data.id,
                            index = e.data.settings.selected.indexOf(id);

                        if (type == 'radio') {
                            e.data.settings.selected = [];
                        }

                        // 防止radio重复添加，checkbox要进行删除。

                        if (index != -1 && type != 'radio') {
                            e.data.settings.selected.splice(index, 1);
                        } else {
                            e.data.settings.selected.push(id);
                        }

                    });

                })(row, settings);


                td = $('<td></td>');
                td.append(select);
                td.width(withInput.width);
                tr.append(td);
            }


            // 遍历数据根据columNames，动态生成td
            for (i = 0; i < len; i++) {
                col = settings.columNames[i];
                if (row[col]) {
                    td = $('<td></td>');
                    td.html(row[col]);
                    tr.append(td);
                }
            }

            return tr;
        };

        Tree.prototype._toAngularDOM = function(settings) {
            var tr = $('<tr></tr>'),
                td = $('<td></td>'),
                len = settings.columNames.length,
                col,
                i;

            // 如果设置了checkbox或者是radio
            if (settings.withInput && !$.isEmptyObject(settings.withInput)) {
                var input = $('<input>');
                var type = settings.withInput.type;
                input.attr('type', type);
                td.width(settings.withInput.width);

                if (type == 'radio') {
                    input.attr('name', 'radio');
                }

                input.attr('ng-click', 'setSelect(item.id)');
                td.append(input);
                tr.append(td);
            }

            tr.attr('ng-repeat', 'item in ncData');
            tr.attr(settings.nodeIdAttr, '{{item.id}}');
            tr.attr(settings.childrenCount, '{{item.parentId}}');

            // 遍历数据根据columNames，动态生成td
            for (i = 0; i < len; i++) {
                col = settings.columNames[i];

                td = $('<td></td>');
                td.attr('ng-bind', 'item.' + col);
                tr.append(td);
            }
            return tr;
        };
        // 渲染每一个层节点
        Tree.prototype.render = function() {
            var root, _i, _len, _ref;
            _ref = this.roots;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                root = _ref[_i];

                // Node.show()
                root.show();
            }
            return this;
        };
        // /**
        //  * @private
        //  * @method _initTable
        //  * 初始化一个table元素，如果已经有这个元素移除所有结点返回   
        //  * 
        //  * @param {Object} element
        //  * 指令所touch的元素
        //  */
        // function _initTable(element) {
        //     var table = element.children('table');
        //     // 如果已经有table直接返回
        //     if (!!table.length) {
        //         table.children().remove();
        //         return table;
        //     }

        //     table = $('<table></table>');
        //     table.addClass('table table-striped nc-treetable');
        //     table.width('100%');

        //     return table;
        // }

        /**
         * @private
         * @method _renderTable
         * 根据tree.roots中的关系，正确渲染table，
         * 
         * @param {Object} table
         *
         * @param {Object} tree
         * 
         */
        function _renderTable(table, tree) {
            var key;
            for (key in tree) {
                table.append(tree[key].row);
                if (tree[key].children.length > 0) {
                    _renderTable(table, tree[key].children);
                }
            }
        }
        /**
         * @private
         * @method _dynamicRenderTable
         * 渲染动态数据
         * 
         * @param {Object} table
         *
         * @param {Object} node
         * 
         */
        function _dynamicRenderTable(table, node) {
            if (node.parentId !== undefined) {
                var parent = node.tree[node.parentId];
                parent.row.after(node.row);

                // 如果父节点是收缩状态的就隐藏节点
                // 内层结点只是branch
                if (parent.collapsed() || parent.isBranchNode()) {
                    node.hide();
                }
                // 如果父结点已经展开
                if (parent.expanded()) {
                    node.show();
                }


            } else {
                table.prepend(node.row);
            }
        }
        /**
         * @private
         * @method _setChecked
         * 根据checked数组，设置相应input为选中
         * 
         * @param {Object} tree
         *
         * @param {Object} options
         * 
         */
        function _setChecked(tree, options) {
            var nodes = tree.tree,
                len,
                checked = options.checked,
                i,
                parent,
                parents = [],
                node;

            // 取消之前选中
            if (tree.cacheChecked !== undefined) {
                len = tree.cacheChecked.length;
                for (i = 0; i < len; i++) {
                    if (nodes[tree.cacheChecked[i]] !== undefined) {
                        nodes[tree.cacheChecked[i]].setUnChecke();
                    }
                }
            }

            len = options.checked.length;

            for (i = 0; i < len; i++) {
                node = nodes[checked[i]];
                if (node !== undefined) {

                    node.setChecked().setBgColorAndSelect();
                    // 如果在中间的节点，本身有孩子结点，也需要将自己展开，这时候自己本身相当于父结点
                    parent = node;
                    // 只能从最外层向内展开，将所有parent从内到外缓存
                    // 再从外到内展开
                    while (parent) {
                        parents.unshift(parent);
                        parent = parent.parentNode();
                    }

                    parents.forEach(function(item, index, array) {
                        item.expand();
                    });
                }
            }
            tree.cacheChecked = checked;

        }

        function link(scope, element) {


            scope.ncOptions = $.extend({
                branchAttr: "ttBranch",
                /**
                 * 
                 * @cfg 
                 * 点击行展开  
                 *
                 */
                clickableNodeNames: true,
                /**
                 * 
                 * @cfg 
                 * 扩展按钮所在列，如果没有withInput参数，此项应该置0 
                 *
                 */
                column: 1,
                /**
                 * 
                 * @cfg 
                 * 需要显示的列的key   
                 *
                 */
                columNames: ['name'], // 要显示的列名，不是th
                /** 
                 * @cfg 
                 * Treetable暂时支持checkbox和radio两种input，全只能在第一列，选中后会将id放到selected数组中。设置格式如下：
                 * 
                 * ```
                 * {
                 *       type: 'radio',
                 *       width: '10%' // 第一行宽度
                 *       name: 'radio' // 可以是初始化这个模块的名称，保证值唯一，修复issue#3问题
                 * }
                 * ```
                 */
                withInput: {
                    type: 'radio',
                    width: '1em',
                    name: 'radio'
                },
                /** 
                 * @cfg 
                 * 当没有withInput的时候，点击行要展开并设置颜色。
                 *
                 */
                selectedColor: '#2f75b2',
                columnElType: "td",
                expandable: true,
                /** @cfg 
                 * 此属性是当数据折叠时显示的图标，默认是+号，如下：
                 *
                 * ```javascript
                 * <i>+</i>
                 * ```
                 */
                expanderTemplate: '<i >+</i>',
                /** @cfg 
                 * 此属性是当数据展开后显示的图标，默认是-号，如下：
                 *
                 * ```javascript
                 * <i>-</i>
                 * ```
                 */
                reducerTemplate: '<i >-</i>',
                /**
                 * 
                 * @cfg 
                 * 每一层的缩进距离
                 *
                 */
                indent: 2.4,
                /**
                 * 
                 * @cfg 
                 * 缩进单位
                 *    
                 *
                 */
                unit: 'em',
                indenterTemplate: "<span class='indenter'></span>",
                initialState: "collapsed",
                nodeIdAttr: "nc-treetable-id", // maps to nc-treetable-id
                childrenCountAttr: "nc-treetable-children-count", // maps to nc-treetable-id
                parentIdAttr: "nc-treetable-parent-id", // maps to nc-treetable-parent-id
                stringExpand: "Expand",
                stringCollapse: "Collapse",
                /**
                 * 
                 * @cfg 
                 * 当设置了withInput参数的时候，selected是一个id数组
                 * 
                 */
                selected: [], // Q: 是否直接判定点击执行函数好点？
                /**
                 * 
                 * @cfg 
                 * 设置初始化选中状态，是一个id数组，如果设置withInput会设置相应的check,
                 * 如果是radio,而且有多个id，只会选中最后一个
                 * 
                 */
                checked: []
            }, scope.ncOptions);

            // 防止重复渲染
            scope.rendering = false;

            var tree;

            var table = element;

            table.addClass('nc-treetable');


            // 监控数据是否发生变化，如果有改变重新渲染，如果使用repeat会更快。
            // TODO: 销毁操作
            scope.$watch('ncData', function(newVal, oldVal) {
                if (newVal != undefined && newVal != null && newVal.length && !scope.rendering) {
                    scope.rendering = true;
                    tree = new Tree(scope.ncOptions)
                    tree.loadRows(scope.ncData).render();

                    table.children().remove();
                    // 进行重新排序并完成渲染表格，数据可能是无序的，必须保证有序渲染。
                    _renderTable(table, tree.roots);
                    scope.rendering = false;
                    // 设置选中状态
                    _setChecked(tree, scope.ncOptions);
                }
            });
            // 数据一致性交给实用者来判断，这里只要数据有效就沉浸
            scope.$watch('ncDynamicData', function(newVal, oldVal) {
                if (newVal != undefined && newVal != null && newVal.length && !scope.rendering) {
                    scope.rendering = true;

                    tree.isDynamicData = true;
                    tree.loadRows(scope.ncDynamicData).render();
                    tree.isDynamicData = false;

                    tree.dynamicNodesCache.forEach(function(node) {
                        _dynamicRenderTable(table, node);
                    });


                    scope.rendering = false;
                }
            });
            // 选中状态同步
            if (scope.ncOptions.checked) {
                scope.ncOptions.selected = scope.ncOptions.checked;
            }

            scope.$watch('ncOptions.checked', function(newVal, oldVal) {
                if (newVal != oldVal) {
                    // 有新值被设置也设置选中列表
                    scope.ncOptions.selected = newVal;
                    _setChecked(tree, scope.ncOptions);
                }
            });

            // angular方法暂时无法渲染结点，还没找到原因
            // var tr = tree._toAngularDOM(scope.ncOptions);
            // table.append(tr);
            // table = $compile(table)(scope);
            // tree.loadRows(table.rows).render();

            // 通知angular数据发生变化
            table.on('click', function(e) {
                scope.$apply();
                e.stopPropagation();
            });

        }


        /* @ngInject */
        function controller($scope) {
            $scope.setSelect = setSelect;

            function setSelect(id) {
                var type = $scope.ncOptions.withInput.type,
                    index = $scope.ncOptions.selected.indexOf(id);

                if (type == 'radio') {
                    $scope.ncOptions.selected = [];
                }

                // 防止radio重复添加，checkbox要进行删除。

                if (index != -1 && type != 'radio') {
                    $scope.ncOptions.selected.splice(index, 1);
                } else {
                    $scope.ncOptions.selected.push(id);
                }
            }
        }

        return {
            restrict: 'EA',
            controller: controller,
            scope: {
                /**
                 * 
                 * @property {Object} 
                 * 配置参数查看config   
                 * 
                 */
                ncOptions: '=',
                /**
                 * 
                 * @property {Array} 
                 * 数据对象数组，对象格式如下：
                 *
                 * ```javascript
                 * var data = [
                 *  {id:'1',name:'A',parentId:''},
                 *  {id:'2',name:'A-1',parentId:'1'},
                 *  {id:'3',name:'A-1-1',parentId:'2'},
                 *  {id:'4',name:'B',parentId:''},
                 * ] 
                 * ```
                 */
                ncData: '=',
                /**
                 * 
                 * @property {Array} 
                 * 动态数据接口，数组结构和nc-data一样，不会从新渲染树，只是将新数据直接加入现有的树
                 *
                 * 
                 */
                ncDynamicData: '='
            },
            link: link
        };
    }
})(window.angular, window.jQuery);
