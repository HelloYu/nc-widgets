## issue#1
数据如果不是顺序排列，初始化位置会出错。先不要渲染表格，等数据处理完成后遍历tree中的数据应该就能解决。
### fixed
数据处理后，渲染成tr再根据tree内的roots生成正确的table。
## issue#2
直接在数据接口上使用filter进行过滤会出现无限diget循环。
### fixed
临时解决方法，只能是通过在controller内使用filter过滤，之后再赋值。
## issue#3
单选按钮绑定成相同值，导致页面上多个组件，只要选中一个其它的按钮会被取消掉。
### fixed
在withInput添加name，用来区别不同组件之间的radio组。