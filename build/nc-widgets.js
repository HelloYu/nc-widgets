(function(angular, $) {
    'use strict';

    angular
        .module('nc-treetable',[])
        .directive('ncTreeTable', ncTreeTable);

    ncTreeTable.$inject = ['$compile'];

    /**
     * 
     * @class ncTreeTable
     * 
     * ## 使用说明
     * ```javascript
     * // 在html中使用标签
     * <nc-tree-table nc-options="vm.options" nc-data="vm.data"></nc-tree-table>
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
     *     
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

            this.treeCell = $(this.row.children(this.settings.columnElType)[this.settings.column]);
            this.expander = $(this.settings.expanderTemplate);
            this.reducer = $(this.settings.reducerTemplate);
            this.toggleBtn = $('<span></span>');
            this.indenter = $(this.settings.indenterTemplate);
            this.treeCell.prepend(this.indenter);
        };

        Node.prototype.toggle = function() {

            if (this.expanded()) {
                this.collapse();
                // 变换按钮
                this.toggleBtn.html(this.expander);
            } else {
                this.expand();
                this.toggleBtn.html(this.reducer);
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
            if (this.parentId != null) {
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
                this.expand();
            }

            return this.initialized = true;
        };

        Node.prototype._getParentId = function(node, parentIdAttr) {
            var parentId = node.attr(parentIdAttr);
            if (parentId != null && parentId !== "") {
                return parentId;
            }
        };

        Node.prototype.render = function() {
            var handler,
                settings = this.settings,
                target;


            if (settings.expandable === true && this.isBranchNode()) {
                handler = function(e) {

                    e.data.tree[$(this).parents("tr").attr(settings.nodeIdAttr)].toggle();
                    return e.preventDefault();
                };

                // 分支结点默认expander
                this.toggleBtn.html(this.expander);
                this.indenter.html(this.toggleBtn);
                target = settings.clickableNodeNames === true ? this.treeCell : this.toggleBtn;

                (function(tree) {
                    target.off("click").on("click", { tree: tree }, handler);
                })(this.tree)

            }
            this.indenter[0].style.paddingLeft = "" + (this.level() * settings.indent) + "px";

            return this;
        };

        Node.prototype.isBranchNode = function() {
            if (this.children.length > 0 || this.row.data(this.settings.branchAttr) === true) {
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

            this.row.removeClass("expanded").addClass("collapsed");

            this._hideChildren();
            this.expander.attr("title", this.settings.stringExpand);

            return this;
        };
        Node.prototype.expand = function() {
            if (this.expanded()) {
                return this;
            }

            this.row.removeClass("collapsed").addClass("expanded");


            if ($(this.row).is(":visible")) {
                this._showChildren();
            }

            this.expander.attr("title", this.settings.stringCollapse);

            return this;
        };

        function Tree(settings) {
            this.tree = {};
            this.settings = settings;

            // 缓存节点
            this.nodes = [];
            this.roots = [];
        };

        // 载入每一条数据
        Tree.prototype.loadRows = function(rows) {
            var node, row, i;

            if (rows != null) {
                for (i = 0; i < rows.length; i++) {

                    row = this._toJQueryDOM(rows[i]);

                    node = new Node(row, this.tree, this.settings);

                    this.nodes.push(node);
                    this.tree[node.id] = node;

                    if (node.parentId != null && this.tree[node.parentId]) {
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
                    })
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
                };
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
            tr.attr(settings.parentIdAttr, '{{item.parentId}}');

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
        /**
         * @private
         * @method _initTable
         * 初始化一个table元素，如果已经有这个元素移除所有结点返回   
         * 
         * @param {Object} element
         * 指令所touch的元素
         */
        function _initTable(element) {
            var table = element.children('table');
            // 如果已经有table直接返回
            if (!!table.length) {
                table.children().remove();
                return table;
            }

            var table = $('<table></table>');
            table.addClass('table table-striped');
            table.width('100%');
           
            return table;
        }

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
        function _renderTable(table,tree) {
            var key;
            for (key in tree) {
                table.append(tree[key].row);
                if (tree[key].children.length > 0) {
                    _renderTable(table, tree[key].children);
                }
            }
        }

        function link(scope, element, attrs) {

           
            scope.ncOptions = $.extend({
                branchAttr: "ttBranch",
               /**
                * 
                * @cfg 
                * 点击行展开  
                *
                */
                clickableNodeNames: true,
                column: 1, // 扩展按钮所在列
               /**
                * 
                * @cfg 
                * 需要显示的列的key   
                *
                */
                columNames: ['name'], // 要显示的列名，不是th
               /** @cfg 
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
                    width: '10%',
                    name: 'radio' 
                },
                columnElType: "td",
                expandable: true,
               /** @cfg 
                * 此属性是当数据折叠时显示的图标，默认是+号，如下：
                *
                * ```javascript
                * <i>+</i>
                * ```
                */
                expanderTemplate: "<i>+</i>",
               /** @cfg 
                * 此属性是当数据展开后显示的图标，默认是-号，如下：
                *
                * ```javascript
                * <i>-</i>
                * ```
                */
                reducerTemplate: "<i>-</i>",
               /**
                * 
                * @cfg 
                * 每一层的缩进距离，单位px
                *    
                *
                */
                indent: 19,
                indenterTemplate: "<span class='indenter'></span>",
                initialState: "collapsed",
                nodeIdAttr: "nc-treetable-id", // maps to nc-treetable-id
                parentIdAttr: "nc-treetable-parent-id", // maps to nc-treetable-parent-id
                stringExpand: "Expand",
                stringCollapse: "Collapse",
               /**
                * 
                * @cfg 
                * 当设置了withInput参数的时候，selected是一个id数组
                * 
                */
                selected: []  // TODO: 是否直接判定点击执行函数好点？
            }, scope.ncOptions);

            // 防止重复渲染
            scope.rendering = false;

            var tree = new Tree(scope.ncOptions);
            // 数据导入初始化
            tree.loadRows(scope.ncData).render();

            var table = _initTable(element);
            // 进行重新排序并完成渲染表格，数据可能是无序的，必须保证有序渲染。
            _renderTable(table, tree.roots);

            // 监控数据是否发生变化，如果有改变重新渲染，如果使用repeat会更快。
            // TODO: 销毁操作
            scope.$watch('ncData', function(newVal, oldVal) {
                if (newVal != oldVal && !scope.rendering) {
                    scope.rendering = true;

                    var tree = new Tree(scope.ncOptions);

                    table.children().remove();
                    tree.loadRows(scope.ncData).render();
                    _renderTable(table, tree.roots);
                    scope.rendering = false;

                }
            })

            // angular方法暂时无法渲染结点，还没找到原因
            // var tr = tree._toAngularDOM(scope.ncOptions);
            // table.append(tr);
            // table = $compile(table)(scope);
            // tree.loadRows(table.rows).render();

            // 通知angular数据发生变化
            table.on('click', function(e) {
                scope.$apply();
                e.stopPropagation();
            })


            element.append(table);
        };


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
            },
            link: link
        }
    }
})(window.angular, jQuery);
