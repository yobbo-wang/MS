(一)
本系统界面用的是easyUI1.3.4,其中樊亚东进行了源码的改动，即/jslib/jquery-easyui-1.3.4/jquery.easyui.min.jss
主要改动有：
1.事件绑定参数传递
2.性能优化
3.原有的bug
具体的改动信息他忘了。。。

(二)
/jslib/lhgDialog-4.2.0/lhgdialog/lhgdialog.min.js?skin=idialog    
这个dialog插件，引用方式与easyUI的引用方式有冲突, 
lghdialog 		-->  	$.dialog({})
easyUI dialog	-->     $("#myWindow").dialog({})
故把lhgdialog.min.js的引用方式给改了，改成 $.lgdialog({}),系统中可参考：快捷键设置的窗口


(三)
1.easyUI datagrid刷新的问题
jquery.easyui.min.js  

i<rows.length 改为 rows!=null&&i<rows.length

2.easyUI datagrid 加载渲染慢
测试数据 ：　10000条登陆日志信息，谷歌浏览器，11服务器，oracle10g 
优化前：从后台读取数据需要3秒，到浏览器渲染完成需要1分30秒。
优化后：从后台读取数据需要3秒，到浏览器渲染完成需要38秒。
具体优化位置： jquery.easyui.min.js  注释了8187行到8195行。
function _5b3(trs1,trs2){
//for(var i=0;i<trs2.length;i++){
//var tr1=$(trs1[i]);
//var tr2=$(trs2[i]);
//tr1.css("height","");
//tr2.css("height","");
//var _5b9=Math.max(tr1.height(),tr2.height());
//tr1.css("height",_5b9);
//tr2.css("height",_5b9);
//}
};
	原因是：对比表格中两行的高度，然后把高的赋值给各行。注释掉代码，让浏览器自动适应高度。
	
3.对datagrid进行单独的性能拓展，文件在 ： /jslib/jquery-easyui-1.3.4/jquery.datagrid.js 主要以下优化几点
(1)加载渲染慢，对比表格中两行的高度，然后把高的赋值给各行。同上！
(2)关于勾选与点选的问题。
if (type == "checked") {
    return (_21d == 1 ? dc.body1 : dc.body2).find(">table>tbody>tr.datagrid-row:has(div.datagrid-cell-check input:checked)");
}
这段代码是获取已经被勾选的rows，大家可以看到，这是纯粹的jQuery选择器查询，效率就慢在has这个伪选择器上,
它是针对所有后代元素的，查找的效率是比较慢的，又是在这么多数据量的情况下，其效果就可想而知了。
具体优化：
我们给$.data(target,'datagrid')变量增加两个属性："checkedTrsBody1"和"checkedTrsBody2"分别存储frozen部分和normal部分被勾选tr的引用，
然后在各个设计到勾选的操作中维护这两个属性。最后，获取被勾选tr的时候就可以直接从这两个属性中取了，其耗时是可以忽略的。
那么究竟哪些操作会影响到被勾选的tr呢，我们罗列一下，也就以下几种："checkRow","uncheckRow","uncheckAll",
"checkAll","deleteRow","loadData","load","reload".
我们只要在这些接口中维护起"checkedTrsBody1"和"checkedTrsBody2"属性就可以了。

/*
(3)html()改成innerHtml
jquery是个很锋利的工具，可有时候我们也得返璞归真一下，为什么非要用jQuery的html()函数呢，
我们就用javascript dom对象里面的innerHtml属性不就可以了么，而且换成innerHTML属性方式的话，效率提高几十倍。
所以，大数据量加载慢的问题，就这么简单就解决了，修改默认视图render方法最后那句：
//1.3.3版本是这样的，其它版本也是这句代码
$(_1e0).html(_1e4.join(""));
改为：
$(_1e0)[0].innerHTML = _1e4.join("");

*/


/**
	四，源码修改
easy 消息框定位问题
*/
1）由于系统框架采用的是 iframe 布局，所以导致提示框归属问题
	解决 window.top.$.message.alert()
2)由于alert 和confirm 继承自 $.window 采用百分比绝对定位，不是很符合需要特修改源码为

		$.messager = {
		show : function(_2a9) {
			return _2a4(_2a9);
		},
		alert : function(_2aa, msg, icon, fn) {
			var opts = typeof _2aa == "object" ? _2aa : {
				title : _2aa,
				left:'40%',
				top:'30%',
				msg : msg,
				icon : icon,
				fn : fn
			};
			var cls = opts.icon ? "messager-icon messager-" + opts.icon : "";
			opts = $.extend({}, $.messager.defaults, {
				content : "<div class=\"" + cls + "\"></div>" + "<div>"
						+ opts.msg + "</div>" + "<div style=\"clear:both;\"/>",
				buttons : [ {
					text : $.messager.defaults.ok,
					onClick : function() {
						win.window("close");
						opts.fn();
					}
				} ]
			}, opts);
			var win = _2a7(opts);
			return win;
		},
		confirm : function(_2ab, msg, fn) {
			var opts = typeof _2ab == "object" ? _2ab : {
				title : _2ab,
				msg : msg,
				left:'40%',
				top:'30%',
				fn : fn
			};
			opts = $
					.extend(
							{},
							$.messager.defaults,
							{
								content : "<div class=\"messager-icon messager-question\"></div>"
										+ "<div>"
										+ opts.msg
										+ "</div>"
										+ "<div style=\"clear:both;\"/>",
								buttons : [ {
									text : $.messager.defaults.ok,
									onClick : function() {
										win.window("close");
										opts.fn(true);
									}
								}, {
									text : $.messager.defaults.cancel,
									onClick : function() {
										win.window("close");
										opts.fn(false);
									}
								} ]
							}, opts);
			var win = _2a7(opts);
			return win;
		},



	
	
	
	
	
	
	
	
