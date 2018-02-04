// JScript 文件
/*
工作流程流转图形化展示、编辑插件。
1.支持流程流转状态显示，
2.支持流程图编辑，可以新增、删除流程节点，以及修改流程名称，并且定义新的流程分支。
3.可对流程节点进行合并和展开操作，也可以取消合并。
4.流程节点自动布局，

作者：刘敏  
日期：2015-7-29 09:43:10

许可：在保留作者信息的前提下，本文件可以随意修改、传播、使用，但对可能由此造成的损失作者不负担任何责任。

使用示例：
    $("#statemachine-demo").escFlowChart({
        flowData: flowData,//流程json数据
        url:"/flowChart/save",//流程图数据保存提交地址
        isEdit: true,//是否允许编辑流程,true:允许，false:不允许，默认允许编辑
        isShowMergeNode: true//0:安书记的show字段标识（true显示合并节点、false显示子节点），1:显示合并节点，2:显示子节点.默认是0
    });
属性：
    url:null,//流程图数据保存提交地址
    flowData: [],//流程json数据
    submitJson:{},//保存需要提交的数据对象
    isEdit: true,//是否允许编辑流程,true:允许，false:不允许，默认允许编辑
    showMergeNode: 0,//0:安书记的isShow字段标识（true显示合并节点、false显示子节点），1:显示合并节点，2:显示子节点.默认是0
    connector:"StateMachine",//Bezier:贝塞尔曲线,Straight:直线,Flowchart：经典的流程图连接方式,StateMachine：微弯的线条。默认StateMachine(详见https://jsplumbtoolkit.com/community/doc/connectors.html)
    wayOfDisplay:1,//展示方式 ，1:按节点的流程顺序自动横向排列，2：按视图的上节点坐标的位置展示。默认1
    rankDir:"LR",//布局方式， "TB" (top-to-bottom) / "BT" (bottom-to-top) / "LR" (left-to-right) / "RL" (right-to-left),默认“LR”
    rankSep: 50,//横向距离，默认30
    edgeSep: 40,//纵向距离，默认10
方法：
    refresh(flowData)：根据指定的流程数据刷新流程图
    getValues()//获取视图上的流程数据
        
*/
(function() {
    //定义EscFlowChart的构造函数
    var EscFlowChart = function(ele, opt) {
        $this = this;
        $this.$element = ele,
        $this.defaults = {
        	url:null,//流程图数据保存提交地址
        	updateUrl:null,//流程图数据保存提交地址
        	flowState:0,//流程图状态
            flowData: [],//流程json数据
            submitJson:{},//保存需要提交的数据对象
            isEdit: true,//是否允许编辑流程,true:允许，false:不允许，默认允许编辑
            isSysEdit: false,//是否是应用系统展示配置操作
            isMergeNode:true,//是否允许合并节点（当允许编辑时生效）
            isShowNodeState:true,//是否显示节点状态（当允许编辑时）
            isViewPprocessMenu:true,//是否显示空白区域右键菜单
            showMergeNode: 0,//0:安书记的isShow字段标识（true显示合并节点、false显示子节点），1:显示合并节点，2:显示子节点.默认是0
            dic : new Dictionary(),//流程节点数据缓存，<节点编号，节点对应的数据>
            mergeNodes : [],//缓存合并节点的数据
            scrollWidth : ele[0].scrollWidth,//展示视图区域宽
            scrollHeight : ele[0].scrollHeight,//展示视图区域高
            connector:"StateMachine",//Bezier:贝塞尔曲线,Straight:直线,Flowchart：经典的流程图连接方式,StateMachine：微弯的线条。默认StateMachine(详见https://jsplumbtoolkit.com/community/doc/connectors.html)
            wayOfDisplay:1,//展示方式 ，1:按节点的流程顺序自动横向排列，2：按视图的上节点坐标的位置展示。默认1
            rankDir:"LR",//布局方式， "TB" (top-to-bottom) / "BT" (bottom-to-top) / "LR" (left-to-right) / "RL" (right-to-left),默认“LR”
            rankSep: 70,//横向距离，默认30
            edgeSep: 40,//纵向距离，默认10
            point : null,//鼠标点击页面的坐标
            isSave:true,//编辑过视图后是否有保存设计
            colorIndex : 0,
            faIndex:0,
            instance:null,
            temp : null,
            currentNode: null,//右键操作时选中的节点
            dataIndex : 0,
            minWidth:0,//最小宽度
            minHeight:0,//最小高度
            showSubProcess:function(node){},//显示子流程
            sysNodeSelect:function(node){}//应用系统节点选择事件
        },
        $this.options = $.extend({}, $this.defaults, opt);
    };
    //定义EscFlowChart的方法
    EscFlowChart.prototype = {
        //初始化
        init:function(){
            var flowData = $this.setMergeNodeStatus($this.options.flowData);
            //初始化流程节点数据缓存
            for(var i = 0 ; i < flowData.length ; i++){
                if(flowData[i].type == "merge"){
                    flowData[i].color = $this.getColor();
                    flowData[i].fa = $this.getFa();
                    if($this.options.showMergeNode == 1){
                        flowData[i].isShow = 1;
                    }else if($this.options.showMergeNode == 2){
                        flowData[i].isShow = 0;
                    }
                }
                $this.options.dic.Add(flowData[i].id,flowData[i]);
            }
            //布局
            $this.laout();
            
            // setup some defaults for jsPlumb.
            $this.options.instance = jsPlumb.getInstance({
            	Endpoint: ["Blank", {radius: 2}],
//                HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
                ConnectionOverlays: [
                    [ "Arrow", {
                        location: 1,
                        id: "arrow",
                        length: 10,
                        width:10,
                        foldback: 0.5
                    } ],
                    [ "Label", { label: "", id: "label", cssClass: "aLabel" }]
                ],
                Container: $this.$element.attr("id")
            });
            
            if(!$this.options.isSysEdit){
	            //非节点右键菜单
	            $this.$element.contextMenu('viewPprocessMenu', {
	                shadow:false,
	                bindings: {
	                    'pmCreateTask': $this.pmCreateTask,//新建节点
	                    'pmModify': function(t) {//修改链路名称
	                        var text = $this.options.temp.text();
	                        $this.options.temp.html("");
	                        $this.options.temp.append("<input type='text' maxlength=50 value='" + text + "' />");
	                        $this.options.temp.children("input").mouseleave(function () {
	                            $this.options.temp.html($("input[type='text']").val());
	                            $this.options.temp.children("input").remove();
	                            $this.options.isSave = false;
	                        });
	                    },
	     
	                    'pmSave': function(t) {//保存编辑后的视图
	                        $this.submitData(function(){});
	//                    	//获取当前节点的位置，转换为视图位置的百分比
	//                        $this.convertPoint();
	//                    	
	//                        if(!$this.options.url){
	//                        	// window.top.$.messager.alert("系统提示","请先配置提交ur","info");
	//                        	 window.top.$.messager.alert("系统提示","请先配置提交url","info");
	//                        	return;
	//                        }
	//                    	var data=$this.options.dic.Values();
	////                    	alert(1);
	////                    	console.log(data);
	//                    	var arrDate = data.concat();
	//                    	
	//                        
	//                      //排序
	//                    	arrDate.sort(function(a,b){
	//                        	var _style = a.style;
	//                        	
	//                    		var arr = _style.split(";");
	//                    		var _left = arr[0].substring(0,arr[0].length -1).split(":")[1];
	//                    		var _top = arr[1].substring(0,arr[1].length -1).split(":")[1];
	////                    		console.log("_left:"+_left);
	////                    		console.log("_top:"+_top);
	//                    		var style = b.style;
	//                    		arr = style.split(";");
	//                    		var left = arr[0].substring(0,arr[0].length -1).split(":")[1];
	//                    		var top = arr[1].substring(0,arr[1].length -1).split(":")[1];
	////                    		console.log("left:"+left);
	////                    		console.log("top:"+top);
	//                    		if(_left == left){
	//                    			return  $this.floatSub(parseFloat(_top) , parseFloat(top));
	//                    		}
	//                    		return $this.floatSub(parseFloat(_left),parseFloat(left));
	//                        });
	////                        console.log(parseInteger(left));
	////                        for(var i = 0 ; i < arrDate.length ; i++){
	////                        	console.log(arrDate[i].name+":"+arrDate[i].style);
	////                        }
	//                        $this.options.submitJson.data = arrDate;
	//                        $.ajax({
	//                            type: "POST",
	//	           				contentType: "application/json; charset=utf-8",
	//	           				dataType: "json", 
	//                            url:$this.options.url,
	//                            data:JSON.stringify($this.options.submitJson),
	//                            success: function (result) {
	//                        	     window.top.$.messager.alert("系统提示",result.message,"info");
	//                        	    $this.options.isSave = true;
	//                            },
	//                            error: function(result) {
	//                        	     window.top.$.messager.alert("系统提示","保存失败","info");
	//                            }
	//	           			 });
	                    },
	                    'pmRefresh': function(t) {//刷新整个视图
	                        $this.refresh();
	                    }
	                },
	                onShowMenu: function(e, menu) {//过滤显示菜单
	                    $this.options.temp = $(e.target);
	                    // console.log(e.target);
	                    // console.log(e.offsetX + ", "+e.offsetY);
	                    $this.options.point = {x: e.offsetX, y:e.offsetY};
	                    return menu;
	                }
	            });
            }

            $this.$element.mousedown(function(e) {
                if( e.which != 3 ) {//点击视图区域，隐藏节点右键菜单
                    $('div#jqContextMenu').hide();
                }
            });

            // 连接事件
            $this.options.instance.bind("connection", function(conn, originalEvent) {
//	confirm("是否连接");
            	
                // console.log(conn.connection);
                //link的source节点
                var nodeDiv = $("#"+conn.connection.sourceId);
                var sourceId = nodeDiv.attr("id");
                var targetId = conn.connection.targetId;
                
              //设置链路文本信息
                // conn.connection.getOverlay("label").setLabel(conn.connection.id);
                // conn.connection.getOverlay("label").hide();
                //不能连接自己
                if (conn.connection.sourceId == conn.connection.targetId) {
                    $this.options.instance.detach(conn);
                    $this.options.instance.deleteEndpoint(conn.sourceEndpoint,true);
                    $this.options.instance.deleteEndpoint(conn.targetEndpoint,true);
//                    $this.options.instance.deleteEveryEndpoint();
                    return false;
                }
                //不能重复连接
                $.each($this.options.instance.getEndpoints(conn.source), function(i, el) {
                	
                    if (conn.connection != el.connections[0] &&
                        (el.connections[0].targetId == conn.targetId || (el.connections[0].sourceId == conn.targetId && el.connections[0].targetId == conn.sourceId))) {
                        $this.options.instance.detach(conn);
                        return false;
                    }
                });
                
                var pId = nodeDiv.attr("pId");
                //取流程上一步的节点
                var process = null;
                //能取到pId，表示是合并过的子节点
                var node;
                if(!pId){
                    node = $this.options.dic.TryGetValue(sourceId);
                    process =  node.process;
                }else{
                    var pNode = $this.options.dic.TryGetValue(pId);
                    var subNode = pNode.subNode;
                    for(var i = 0 ; i < subNode.length ; i++){
                        if(sourceId == subNode[i].id){
                            node = subNode[i];
                            process =  node.process;
                            break;
                        }
                    }
                }
                //判断步骤是否有名称，有则显示，没有就隐藏lable
                var processName ;
                var temp = true;
                for(var i = 0 ; i < process.length ; i++){
                    if(targetId == process[i].id){
                        // conn.connection.getOverlay("label").setLabel(process[i].name);
                        processName = process[i].name;
                        temp = false;
                        break;
                    }
                }
                if(processName){
                    conn.connection.getOverlay("label").setLabel(processName);
                }else{
                    // conn.connection.getOverlay("label").setLabel(conn.connection.id);
                    conn.connection.getOverlay("label").hide();
                }
                //如果是新建的链路
                if(temp){
                    node.process.push({"id":targetId,"name":""});
                }
               
            });
//            // 取消连接事件
//            $this.options.instance.bind("connectionDetached", function(conn,originalEvent) {
//             	
//                //   var nodeDiv = $("#"+conn.sourceId);
//	             	if(!conn.targetId){
//	             		return ;
//	             	}
//	             	 var node = $this.options.dic.TryGetValue(sourceId);
//	                var process = node.process;
//                    for(var i = 0 ; i < process.length ; i++){
//                        if(process[i].id == targetId){
//                            process.splice(i,1);
//                            break;
//                        }
//                    }
//                    $this.options.instance.detach(conn);
//                    $this.options.isSave = false;
////                   var sourceId = conn.sourceId;
////                   var node = $this.options.dic.TryGetValue(sourceId);
////                  var p= node.process;
////                 //  $this.options.dic.Items(sourceId)['']
////                   for(var i=0;i<p.length;i++){ 
////                   	if(p[i]['id']==conn.targetId){
////                   		p.splice(i);
////                   		break;
////                   		//	i--;
////                   	}
////                   }
//                   $this.options.dic.Items(sourceId)['process']=p;
//            //	
//            	// 	confirm("是否取消连接");
//            	
//                 //nodeFlow.onConnectionChange && nodeFlow.onConnectionChange(conn);
//             });
            
            if($this.options.isEdit){
              // 双击取消连接
                $this.options.instance.bind("dblclick", function(conn, originalEvent) {
                	if($this.options.isSysEdit){
                		return;
                	}
                    //link的source节点
                    var nodeDiv = $("#"+conn.sourceId);
                    var sourceId = nodeDiv.attr("id");
                    var targetId = conn.targetId;
                    var pId = nodeDiv.attr("pId");
                    //取流程上一步的节点
                    //能取到pId，表示是合并过的子节点
                    var node;
                    if(!pId){
                        node = $this.options.dic.TryGetValue(sourceId);
                    }else{
                        var pNode = $this.options.dic.TryGetValue(pId);
                        var subNode = pNode.subNode;
                        for(var i = 0 ; i < subNode.length ; i++){
                            if(sourceId == subNode[i].id){
                                node = subNode[i];
                                break;
                            }
                        }
                    }
                    var process = node.process;
                    for(var i = 0 ; i < process.length ; i++){
                        if(process[i].id == targetId){
                            process.splice(i,1);
                            break;
                        }
                    }
                    $this.options.instance.detach(conn);
                    $this.options.isSave = false;
                });
            }
              //点击连接线删除
            // instance.bind("dblclick", function (conn, originalEvent) {
            //     if (confirm("确定删除吗？")){
            //         instance.detach(conn);
            //     }
            // });
            //初始化视图数据内容
            $this.initData();

           
            
            if($this.options.isEdit && !$this.options.isSysEdit){
            	if($this.options.isMergeNode){
            	    $this.$element.selectable({
                        filter: "div.w"
                    });
            	}else{
	                $this.$element.selectable({
	                    filter: "div.w",
	                    selecting: function( event, ui ) {//不能合并时禁止多选
	                            $("div.w").removeClass("ui-selected");
	                        }
	                });
            	}
            }
            if($this.options.wayOfDisplay == 2){
            	 //监听滚动条的变化
                // $(window).scroll(function() {
                //    drawing();
                // });
	            //监听浏览器大小变化
//	            $(window).bind("resize", function(){
//	            	$this.initScroll();
//	                $this.revalidate();
//	            });
            }
            
            //编辑模式下不需要显示节点状态
//            if(!$this.options.isEdit || $this.options.isShowNodeState){
            	$("div.tooltip").tooltip();
//            }
            
            $this.options['submitData']=function(afterF){
            	$this.submitData(afterF);
            };
        },
        submitData:function(afterF){
          	//获取当前节点的位置，转换为视图位置的百分比
            $this.convertPoint();

    		
            if(!$this.options.url){
            	// window.top.$.messager.alert("系统提示","请先配置提交ur","info");
            	flow_alertTipDiv("请先配置提交url",function(){});
            	// window.top.$.messager.alert("系统提示","请先配置提交url","info");
            	return;
            }
        	var data=$this.options.dic.Values();
//        	alert(1);
//        	console.log(data);
        	var arrDate = data.concat();
        	var arrDateIds="";
        	var process={};
        	var beginNId;
        	var endNId;
            $.each(arrDate,function(i,o){
            	var p=o['process'];
            	if( (p && p.length>0)){
            		arrDateIds+=JSON.stringify(p);
            	}
            	if(o.type=='begin'){
            		beginNId=o.id;
            	}
            	if(o.type=='end'){
            		endNId=o.id;
            	}
            	if(o.subNode){
                    $.each(o.subNode,function(i,k){
                    	var pk=k['process'];
                		arrDateIds+=JSON.stringify(k['process']);
                    	process[k.id]={'process':pk,'status':k['status'],'type':k['type'],'name':k['name'],'isNewNode':k['isNewNode'],'pId':k['pId']};
                    });
            	}
            	process[o.id]={'process':p,'status':o['status'],'type':o['type'],'name':o['name'],'isNewNode':o['isNewNode'],'pId':o['pId']};
            });

    		
            //验证
            // 1.节点是否均已连接
            var isSaveData=true;
            $.each(arrDate,function(i,o){
            	var p=o['process'];
            	var e=o['executePeopleId'];
            	var subnodes=o['subNode'];
            	//状态连验证
            	//1.已执行，可执行 节点后不能增加新的节点
            	var bor=true;
            	var targStatus;
            	if(o['isNewNode']=='1' && $this.options.isEdit && $this.options.isShowNodeState){
	                $.each(p,function(i,po){
	                	//下一节点状态
	                	 targStatus=process[po['id']]['status'];
	                	 var ty=process[po['id']]['type'];
	                	if(!(targStatus =='7'|| targStatus=='6' || targStatus=='5'  || targStatus=='23' || targStatus=='24' || ty=='end' || ty=='begin')){
	                		bor=false;
	                		return false;
	                	}
	                });
	                if(!bor){
	                	if(targStatus == 1 || targStatus == 2 || targStatus == 3 ){
	                		flow_alertTipDiv("流程步骤【"+o['name']+"】不能添加在已执行节点之前！",function(){	});
	                	}else if(targStatus == 4){//正在执行中
	                		flow_alertTipDiv("流程步骤【"+o['name']+"】不能添加在执行中节点之前！",function(){	});
	                	}
	            		else if(targStatus> 10 &&targStatus< 20){
	                		flow_alertTipDiv("流程步骤【"+o['name']+"】不能添加在暂停节点之前！",function(){	});
	            		}
	                	else if( targStatus ==21){
	                		flow_alertTipDiv("流程步骤【"+o['name']+"】不能添加在执行异常挂起节点之前！",function(){	});
	                	}
	                	else if( targStatus ==25){
	                		flow_alertTipDiv("流程步骤【"+o['name']+"】不能添加在执行超时节点之前！",function(){	});
	                	}
	                	else if( targStatus ==26){
	                		flow_alertTipDiv("流程步骤【"+o['name']+"】不能添加在演练展示新增节点之前！",function(){	});
	                	}
	                	isSaveData=false;
	            		return false;
	                }
            	}
            	//合并节点内节点验证
            	if(subnodes && $this.options.isShowNodeState){
            		var bor=true;
            		 $.each(subnodes,function(i,k){
                     	var pk=k['process'];
                		var borr=true;
                     	  $.each(pk,function(i,pko){
        	                	//下一节点状态
        	                	 targStatus=process[pko['id']]['status'];
         	                	 var isnew=process[pko['id']]['isNewNode'];
         	                	 var name=process[pko['id']]['name'];
        	                	 if((isnew =='1') ){
        	                		 flow_alertTipDiv("流程步骤【"+name+"】不能添加在合并节点之后！",function(){	});
	      	                		borr=false;
	      	                		return false;
        	                	 }
        	                });
                     	  if(!borr){
                     		  bor=false;
                         	  return false;
                     	  }
                     });
            		 if(!bor){
   	                	isSaveData=false;
   	            		return false;
  	                }  
            	}
            	
            	//新增节点验证
            	if(o['isNewNode']=='1' && o['type'] !='merge'   && $this.options.isEdit ){
            		var bor=true;
            		  $.each(p,function(i,po){

                      	
  	                	//下一节点状态
  	                	// targStatus=process[po['id']]['status'];
   	                	// var isnew=process[po['id']]['isNewNode'];
  	                	 var ty=process[po['id']]['type'];
  	                	 var pId=process[po['id']]['pId'];
  	                	 if( ty=='merge' || pId){
  	                		 flow_alertTipDiv("流程步骤【"+o['name']+"】不能添加在合并节点之前！",function(){	});
	                		bor=false;
	                		return false;
	                	}
  	                });
            			 if(!bor){
      	                	isSaveData=false;
      	            		return false;
     	                }  
            	}
            	if(o['type'] =='merge' ){
            		var bor=true;
            		 $.each(p,function(i,po){
   	                	//下一节点状态
   	                	 var isnew=process[po['id']]['isNewNode'];
   	                	var ty=process[po['id']]['type'];
   	                	var tn= process[po['id']]['name'];
	                	var targStatus=process[po['id']]['status'];
   	                	if((isnew =='1' || targStatus=='26') && ty!='merge'){
	                		flow_alertTipDiv("流程步骤【"+tn+"】不能添加在合并节点之后！",function(){	});
   	                		bor=false;
   	                		return false;
   	                	}
   	                });
            		 if(!bor){
 	                	isSaveData=false;
 	            		return false;
	                }
            		   
            	}
            	//是否被连
            	if(o.type=='begin'  && JSON.stringify(p).indexOf(endNId)>-1){
            		flow_alertTipDiv("开始节点不能直接连接结束节点！",function(){	});
            		isSaveData=false;
            		return false;
            	}
             	//是否被连
            	if(o.type!='begin'  && JSON.stringify(p).indexOf(beginNId)>-1){
            		flow_alertTipDiv("流程步骤【"+o['name']+"】不能连接开始节点！",function(){	});
            		isSaveData=false;
            		return false;
            	}
            	//是否被连
            	if(o.type!='begin'  && arrDateIds.indexOf(o['id'])<0){
            		flow_alertTipDiv("流程步骤【"+o['name']+"】存在没有完成的连线！",function(){	});
            		isSaveData=false;
            		return false;
            	}
            	//是否被连
            	if(o.type=='end'  && p && p.length>0){
            		flow_alertTipDiv("结束节点不能再次连接其他节点，没有正常结束！",function(){	});
            		isSaveData=false;
            		return false;
            	}
            	//是否连接其他节点
            	if(o.type!='end' && (!p || p.length<1)){
            		flow_alertTipDiv("流程步骤【"+o['name']+"】存在没有完成的连线！",function(){});
            		isSaveData=false;
            		return false;
            	}
              	if($this.options.isShowNodeState && o.type!='end'  && o.status!='26' && o.type!='begin' && o.type!='merge'  &&  !e && e!='null' && o.nodeStepType!='SubProcess' && o.nodeStepType!='CallActivity' ){
            		flow_alertTipDiv("流程步骤【"+o['name']+"】存在没有配置执行人！",function(){});
            		isSaveData=false;
            		return false;
            	}   
            	//2017 smq
              	if($this.options.isShowNodeState &&  o.nodeStepType=='CallActivity' && !o.subPrecautionId){	
              		flow_alertTipDiv("流程步骤【"+o['name']+"】存在没有配置外部预案！",function(){});
            		isSaveData=false;
            		return false;
              	}
            	
            	
            });
            if(!isSaveData){
            	afterF(false);
            	return;
            }
            
          //排序
        	arrDate.sort(function(a,b){
            	var _style = a.style;
            	
        		var arr = _style.split(";");
        		var _left = arr[0].substring(0,arr[0].length -1).split(":")[1];
        		var _top = arr[1].substring(0,arr[1].length -1).split(":")[1];
//        		console.log("_left:"+_left);
//        		console.log("_top:"+_top);
        		var style = b.style;
        		arr = style.split(";");
        		var left = arr[0].substring(0,arr[0].length -1).split(":")[1];
        		var top = arr[1].substring(0,arr[1].length -1).split(":")[1];
//        		console.log("left:"+left);
//        		console.log("top:"+top);
        		if(_left == left){
        			return  $this.floatSub(parseFloat(_top) , parseFloat(top));
        		}
        		return $this.floatSub(parseFloat(_left),parseFloat(left));
            });
//            console.log(parseInteger(left));
//            for(var i = 0 ; i < arrDate.length ; i++){
//            	console.log(arrDate[i].name+":"+arrDate[i].style);
//            }
        	
            $this.options.submitJson.data = arrDate;
            
            flow_create_topDiv();
          
            $.ajax({
                type: "POST",
   				contentType: "application/json; charset=utf-8",
   				dataType: "json", 
                url:$this.options.url, 
                data:JSON.stringify($this.options.submitJson),
                success: function (result) {

           		 flow_remove_topDiv();
//                	if(  window.top.$.messager){
//            	     window.top.$.messager.alert("系统提示",result.message,"info");
//            	  	afterF(result.success);
//            	    $this.options.isSave = result.success;
//                	}else{
                		flow_alertTipDiv(result.message,function(){
                		 	afterF(result.success);
                    	    $this.options.isSave = result.success;
                		});
              //  	}

//                	afterF(result.success);
//            	    $this.options.isSave = result.success;
                },
                error: function(result) {
            		flow_alertTipDiv("保存失败",function(){
//            		 	afterF(result.success);
//                	    $this.options.isSave = result.success;
            		});
//                	if(  window.top.$.messager){
//            	     window.top.$.messager.alert("系统提示","保存失败","info");
//                	}else{
//                		alert("保存失败");
//                		
//                	}
                }
   			 });
        },
        //布局
        laout:function(isRefresh){
        	
        	if(!$this.options.minHeight){
        		$this.options.minHeight = document.documentElement.clientHeight;
        	}
        	if(!$this.options.minWidth || document.documentElement.clientWidth > $this.options.minWidth){
        		$this.options.minWidth = document.documentElement.clientWidth;
        	}
        	if(!isRefresh){
        		$this.initScrollHeight($this.options.minHeight);
        	}
        	if($this.options.wayOfDisplay == 1){
        		var laout = layoutDirectedGraph.layout($this.options.dic,$this.options.scrollHeight, {
                	rankSep: $this.options.rankSep,//很想距离，默认30
                    nodeSep: $this.options.nodeSep,//节点距离，默认50
                    edgeSep: $this.options.edgeSep,//纵向距离，默认10
                    rankDir: $this.options.rankDir//布局方式， "TB" (top-to-bottom) / "BT" (bottom-to-top) / "LR" (left-to-right) / "RL" (right-to-left)
                });
                //第一次初始化的时候才设置视图的高和宽，刷新数据的时候不设置
                if(!isRefresh){
	                //如果布局后换算的高度大于初始化高度，则重新设置视图区域的高度
	                if(laout.height > $this.options.minHeight){
	                	$this.initScrollHeight(laout.height);
	                }
	                //如果布局后换算的宽度大于最小宽度
	                if(laout.width > $this.options.minWidth){
	                	$this.initScrollWidth(laout.width);
	                }else{
	                	$this.initScrollWidth($this.options.minWidth);
	                }
                }
        	}
        	
        },
        //初始化设置视图区域的高度
        initScrollHeight:function(height){
//        	if(height){
        		$this.$element.css("height",height);
        		$this.options.scrollHeight = height;
//        	}else{
//        		$this.$element.css("height",document.documentElement.clientHeight);
//        		$this.options.scrollHeight = document.documentElement.clientHeight;
//        	}
        },
        //初始化设置视图区域的宽度
        initScrollWidth:function(width){
//        	console.log(width);
//        	if(width){
    			$this.$element.css("width",width);
        		$this.options.scrollWidth = width;
//        	}else if($this.options.minWidth){
//        		$this.$element.css("width",$this.options.minWidth);
//        		$this.options.scrollWidth = $this.options.minWidth;
//        	}else{
//        		$this.$element.css("width",document.documentElement.clientWidth);
//        		$this.options.scrollWidth = document.documentElement.clientWidth;
//        	}
        	
//        	console.log($this.$element[0].scrollWidth+", "+$this.$element[0].scrollHeight);
        },
        //随机颜色获取函数
        getColor:function (){
            var colors=["#FFC500","#1d953f ","#FF8E46","#f15a22","#008ED6","#8E468E","#2AB6FF"];
            if($this.options.colorIndex >= colors.length){
                $this.options.colorIndex = $this.options.colorIndex%colors.length;
            }
            return colors[$this.options.colorIndex++];
        },
      //随机合并节点图标
        getFa:function (){
            var fas=["fa-tag","fa-cog","fa-cube","fa-user"];
            if($this.options.faIndex >= fas.length){
                $this.options.faIndex = $this.options.faIndex%fas.length;
            }
            return fas[$this.options.faIndex++];
        },
        //初始化视图内容
        initData:function (){
            //初始化流程节点
            $this.initNode();
            //初始化可拖动效果
            $this.drawing();
            // 生成链路
            $this.initProcess();
        },
        //初始化流程节点
        initNode:function (){
            var values = $this.options.dic.Values();
            //遍历节点数据，初始化流程节点
            for(var i = 0 ; i < values.length ; i++){
                $this.createNode(values[i]);
            }
        },
        //初始化流程节点
        initProcess:function (){
        	$this.options.instance.setSuspendDrawing(true); // 延迟加载
            var values = $this.options.dic.Values();
            //遍历节点数据，初始化流程节点
            for(var i = 0 ; i < values.length ; i++){
                //合并类型节点，显示子节点，连接线连接子节点
                if(values[i].type == "merge" && values[i].isShow == 0){
                    var subNode = values[i].subNode;
                    for(var j = 0 ; j < subNode.length ; j++){
                        var process = subNode[j].process;
                        for(var k = 0 ; k < process.length ; k++){
                            //如果target对应的合并节点没有创建，则不生成link
                            if($("#"+ process[k].id)[0]){
                                var obj = $this.options.instance.connect({ source: subNode[j].id, target: process[k].id });
                            }
                        }
                    }
                }else{
                	for(var l = 0 ; l < values[i].process.length ; l++){
                        //如果target对应的合并节点没有创建，则不生成link
                        if($("#"+ values[i].process[l].id)[0]){
                        	var obj = $this.options.instance.connect({ source: values[i].id, target: values[i].process[l].id });
                        }
                    }
                }
                
            }

            $this.options.instance.setSuspendDrawing(false,true); // 延迟加载，开始重绘
        },
        //重新刷新所有节点的连接线
        revalidate:function(){
            var nodes = jsPlumb.getSelector("."+$this.$element.attr("id")+" .w");
            for(var i = 0 ; i < nodes.length ; i++){
                $this.options.instance.revalidate(nodes[i]);
            }
        },
        //初始化可拖动效果
        drawing:function (nodes){
            if(!nodes){
                nodes = jsPlumb.getSelector("."+$this.$element.attr("id")+" .w");
                if($this.options.isEdit && !$this.options.isSysEdit){
                    // 可以拖动
                    $this.options.instance.draggable(nodes);
                }
            }

            // suspend drawing and initialise.
            $this.options.instance.batch(function () {
                $this.options.instance.makeSource(nodes, {
                	filter: $this.options.isEdit?".ep":".null",
                    anchor: ["Continuous", { faces:[ "right", "left" ] } ],
                    connector: [ $this.options.connector, { curviness: 10,cornerRadius: 5 } ],//Bezier:贝塞尔曲线,Straight:直线,Flowchart：经典的流程图连接方式,StateMachine：微弯的线条。(详见https://jsplumbtoolkit.com/community/doc/connectors.html)
                    connectorStyle: { strokeStyle: "#77787b", lineWidth: 1, outlineColor: "transparent", outlineWidth: 1 },
                    maxConnections: 5,
                    onMaxConnections: function (info, e) {
                         window.top.$.messager.alert("系统提示","Maximum connections (" + info.maxConnections + ") reached","info");
                    },
                    beforeDetach:function(conn){
                   // 	return confirm("是否断开");
                    }
                });

                // initialise all '.w' elements as connection targets.
                $this.options.instance.makeTarget(nodes, {
                    dropOptions: { hoverClass: "dragHover" },
                    anchor: ["Continuous", { faces:[ "right", "left" ] } ],
                    allowLoopback: true
                });
            });
   //   }
        },
        //在视图上创建节点
        //流程编辑器的功能
        createNode:function (nodeJson){
//        	if(nodeJson.type == "merge"){
//        		debugger;
//        	}
//        	debugger;
        	var classStr = "";
            //合并的节点类型
            if(nodeJson.type == "merge"){
                //显示子节点
                if(nodeJson.isShow == 0){
                    var subNode = nodeJson.subNode;
                    for(var i = 0 ; i < subNode.length ; i++){
                    	subNode[i].name=subNode[i].name;
                        $this.createNode(subNode[i]);
                    }
                    return;
                }
                classStr = "w circle";
            }
            else if(nodeJson.nodeStepType == "SubProcess"||nodeJson.nodeStepType == "CallActivity"){
                classStr = "w circle_subprocess";
            }  
            else{
                classStr = "w circle";
            }
            
            var status = nodeJson.status;
            var actualAfterDuration=0;
        	var durationTemp = nodeJson.duration?nodeJson.duration:0;
        	var fa;//节点图标样式
        	var mergeColor;//合并节点右上角颜色
        	var mergeFaColor;//合并节点右上角图标颜色
        	
			var curDate =   nodeJson.curDate?new Date(Date.parse(nodeJson.curDate.replace(/-/g, "/"))):new Date();
            var tooltip = "";
            
            //编辑模式下 并且isShowNodeState=false 不需要显示节点状态 
            if( !$this.options.isShowNodeState){
                status = "";
                if(nodeJson.type == "begin"){
            		classStr += " flow-begin";
            		fa = " fa fa-circle-o sc-unex";
            	}else if(nodeJson.type == "end"){
            		classStr += " flow-end";
            		fa = " fa fa-circle sc-unex";
            	}else if(nodeJson.type == "merge"){
            		classStr += " tooltip";
            		fa = " fa fa-play-circle sc-unex";
            		mergeColor = " merge-unex";
            		mergeFaColor = " merge-fa-other";
            		tooltip = "<div class='tooltip_description' style='display:none'><ul>" ;
            		tooltip += "<li id='duration_"+nodeJson.id+"'><span>预计用时：</span>"+(nodeJson.duration&&nodeJson.duration!='null'?convertDate(nodeJson.duration):convertDate(0))+"</li>";
            		tooltip += "<li id='executePeople_"+nodeJson.id+"'><span>负责人：</span>"+(nodeJson.executePeople?nodeJson.executePeople:"")+"</li>" ;
            		tooltip += "</ul></div>";
            	}else{
            		if(nodeJson.pId){
            			mergeColor = " merge-unex";
            			mergeFaColor = " merge-fa-other";
            		}
            		fa = " fa fa-play-circle sc-unex";
            	}
            }
            else  if( $this.options.isEdit && !$this.options.isShowNodeState){
                status = "";
            }
            else{
//            	if(nodeJson.type == "merge"&& nodeJson.id.indexOf("sid-") <0){//不是以“sid-”开头的节点数据不是流程初始定义的数据，而是在展示配置中添加的新节点,此类节点不纳入流程执行中，所有不需要展示状态和toolTip
//            		status = "";
//            	}
//            	else 
        		if(nodeJson.type != "merge" && nodeJson.id.indexOf("sid-") != 0){//不是以“sid-”开头的节点数据不是流程初始定义的数据，而是在展示配置中添加的新节点,此类节点不纳入流程执行中，所有不需要展示状态和toolTip
            		status = "";
            	}
            	else if(nodeJson.type == "begin"){//标记需要tip提示的div
            		classStr += " flow-begin";
            		fa = " fa fa-circle-o sc-unex";
            		if(nodeJson.beginTime){
	            		classStr += " tooltip";
	            		tooltip = "<div class='tooltip_description' style='display:none'><ul>" ;
	            		tooltip += "<li><span>开始时间：</span>"+nodeJson.beginTime+"</li>";
	            		tooltip += "</ul></div>";
            		}
            	}else if(nodeJson.type == "end"){
            		classStr += " flow-end";
            		fa = " fa fa-circle sc-unex";
            		if(nodeJson.endTime){
	            		classStr += " tooltip";
	            		tooltip = "<div class='tooltip_description' style='display:none'><ul>" ;
	            		tooltip += "<li><span>结束时间：</span>"+nodeJson.endTime+"</li>";
	            		tooltip += "</ul></div>";
            		}
            	}
            	// 演练展示配置新增节点
            	else if( nodeJson.status ==26 && nodeJson.nodeStepType!='merge' ){
            		classStr += " tooltip";
            		fa = "fa fa-check-circle sc-adopt";
            		mergeColor = " merge-adopt";
        			mergeFaColor = " merge-fa-other";
            		status = "after";
            		tooltip = "<div class='tooltip_description' style='display:none'><ul>" ;
            		tooltip += "<li><span>执行状态：</span>已执行</li>";
            		tooltip += "</ul></div>";
            	}
            	else if(nodeJson.nodeStepType=='SubProcess' || nodeJson.nodeStepType=='CallActivity'){
            		classStr += " tooltip";
            		tooltip = "<div class='tooltip_description' style='display:none'><ul>" ;
            		tooltip +=	"<li id='duration_"+nodeJson.id+"'><span>预计用时：</span>"+(nodeJson.duration&&nodeJson.duration!='null'?convertDate(nodeJson.duration):convertDate(0))+"</li>";
		
            		if(status == 1 || status == 2 || status == 3 ){
            			if(nodeJson.beginTime){
	            			//开始执行时间
	            			var beginTime = new Date(Date.parse(nodeJson.beginTime.replace(/-/g, "/")));
	            			//完成时间
	            			var endTime = new Date(Date.parse(nodeJson.endTime.replace(/-/g, "/")));
	            			var actualAfterDuration =  (endTime.getTime() -  beginTime.getTime())/1000;
	            			if(actualAfterDuration > durationTemp){
	            				//超时时间
	            				nodeJson.overtime = convertDate(actualAfterDuration - durationTemp);
	            			}
	            			//流程节点实际用时
	            			nodeJson.actualAfterDuration = convertDate(actualAfterDuration);
	            		}
	            		tooltip += "<li><span>实际用时：</span>"+nodeJson.actualAfterDuration+"</li>";
	            		//超时
		            	if(nodeJson.duration!=0 && nodeJson.overtime != 0  && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined"){
//		            		status = "after_overtime";
		            		tooltip += "<li><span>超时时间：</span>"+(nodeJson.overtime&&typeof(nodeJson.overtime) != "undefined"?nodeJson.overtime:"")+"</li>";
		            	}

		            	tooltip += "<li><span>开始时间：</span>"+(nodeJson.beginTime?nodeJson.beginTime:'')+"</li>";
		            	tooltip += "<li><span>结束时间：</span>"+(nodeJson.endTime?nodeJson.endTime:"")+"</li>";
//		            	if(status == 1){
//		            		tooltip += "<li><span>完成状态：</span>全部完成</li>";
//		            	}else if(status == 2 ){
//		            		tooltip += "<li><span>完成状态：</span>部分完成</li>";
//		            	}else{
//		            		tooltip += "<li><span>完成状态：</span>跳过</li>";
//		            	}
	            		status = "after";
	            	}else if(status == 4){//正在执行中
		            	status = "executing";
	            		if(nodeJson.beginTime){
	            			//开始执行时间
	            			var beginTime = new Date(Date.parse(nodeJson.beginTime.replace(/-/g, "/")));
	            			//流程节点已经执行时间
	            			var actualAfterDuration = (curDate.getTime() -  beginTime.getTime())/1000;
	            			if(actualAfterDuration > durationTemp){
	            				//超时时间
	            				nodeJson.overtime = convertDate(actualAfterDuration - durationTemp);
	            			}
	            			nodeJson.actualAfterDuration = convertDate((curDate.getTime() -  beginTime.getTime())/1000);
	            		}
	            		tooltip += "<li><span>已经用时：</span>"+nodeJson.actualAfterDuration+"</li>";
	            		//超时
		            	if(nodeJson.duration!=0 &&nodeJson.overtime != 0  && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined"){
		            	 	status = "optionexception";
		            		tooltip += "<li><span>执行状态：</span>执行超时</li>";	//超时
		            		tooltip += "<li><span>超时时间：</span>"+(nodeJson.overtime&&typeof(nodeJson.overtime) != "undefined"?nodeJson.overtime:"")+"</li>";
		            	}
		            	tooltip += "<li><span>开始时间：</span>"+(nodeJson.beginTime?nodeJson.beginTime:'')+"</li>";
//	            		tooltip += "<li><span>执行状态：</span>正在执行</li>";
	            	}
	        		else if(status> 10 &&status< 20){
	            		status = "optionstop";
	            		tooltip += "<li><span>执行状态：</span>已暂停</li>";
	        		}
	            	else if(status==20 ){
	            		status = "optionexception";
	            		tooltip += "<li><span>执行状态：</span>接收超时</li>";	//超时
	            	}
	            	else if( status ==21){
	            		status = "optionexception";
	            		tooltip += "<li><span>执行状态：</span>执行异常挂起</li>";
	            	}
	            	else if( status ==25){
	            		status = "optionexception";
	            		tooltip += "<li><span>执行状态：</span>执行超时</li>";	//超时
	            	}
	             	else if( status ==23){
	            		status = "nooptionanStart";
	            		tooltip += "<li><span>执行状态：</span>跳过</li>";//原意作废
	            	}
	             	else if( status ==24){
	            		status = "nooptionanStart";
	            		tooltip += "<li><span>执行状态：</span>跳过</li>";
	            	}
	            
	            	else{//未执行
	            		status = "before";
	            		tooltip += "<li><span>执行状态：</span>未执行</li>";
	            	}
	            	tooltip += "</ul></div>";
            	}
            	else {
            		classStr += " tooltip";
            		tooltip = "<div class='tooltip_description' style='display:none'><ul>" ;
            		tooltip += "<li id='executePeople_"+nodeJson.id+"'><span>执行人：</span>"+(nodeJson.executePeople?nodeJson.executePeople:"")+"</li>" +
								"<li id='duration_"+nodeJson.id+"'><span>预计用时：</span>"+(nodeJson.duration&&nodeJson.duration!='null'?convertDate(nodeJson.duration):convertDate(0))+"</li>";
            		//已经执行完成,节点执行状态（全部完成：1，部分完成：2，跳过：3，正在执行：4，可执行：5,准备执行：6，还未执行：7）
	            	if(status == 1 || status == 2 || status == 3 ){
	            		fa = "fa fa-check-circle sc-adopt";
	            		mergeColor = " merge-adopt";
            			mergeFaColor = " merge-fa-other";
//	            		classStr += " w-adopt after";
	            		if(nodeJson.beginTime){
	            			//开始执行时间
	            			var beginTime = new Date(Date.parse(nodeJson.beginTime.replace(/-/g, "/")));
	            			if(nodeJson.endTime){//合并节点后台执行完没有设置结束时间
		            			//完成时间
		            			var endTime = new Date(Date.parse(nodeJson.endTime.replace(/-/g, "/")));
		            			var actualAfterDuration =  (endTime.getTime() -  beginTime.getTime())/1000;
		            			if(actualAfterDuration > durationTemp){
		            				//超时时间
		            				nodeJson.overtime = convertDate(actualAfterDuration - durationTemp);
		            			}
		            			//流程节点实际用时
		            			nodeJson.actualAfterDuration = convertDate(actualAfterDuration);
	            			}
	            		}
	            		tooltip += "<li><span>实际用时：</span>"+nodeJson.actualAfterDuration+"</li>";
	            		//超时
		            	if(nodeJson.duration!=0 &&nodeJson.overtime != 0  && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined"){
//		            		status = "after_overtime";
		            		tooltip += "<li><span>超时时间：</span>"+(nodeJson.overtime&&typeof(nodeJson.overtime) != "undefined"?nodeJson.overtime:"")+"</li>";
		            	}
		            	tooltip += "<li><span>开始时间：</span>"+(nodeJson.beginTime?nodeJson.beginTime:'')+"</li>";
		            	tooltip += "<li><span>结束时间：</span>"+(nodeJson.endTime?nodeJson.endTime:"")+"</li>";
		            	if(status == 1){
		            		tooltip += "<li><span>完成状态：</span>全部完成</li>";
		            	}else if(status == 2 ){
		            		tooltip += "<li><span>完成状态：</span>部分完成</li>";
		            	}else{
		            		tooltip += "<li><span>完成状态：</span>跳过</li>";
		            	}
//		            	tooltip += "<li><span>完成状态：</span>已执行</li>";
		            	var message = nodeJson.message && nodeJson.message != 'null' ? nodeJson.message : '';
		            	message = message.length > 100 ? message.substr(0, 100) + '...' : ''; //日志过长，只显示一部分
	            		tooltip += "<li><span>完成情况：</span>"+message+"</li>";
	            		status = "after";
	            	}else if(status == 4 || status == 8){//正在执行中、自动执行中
	            		fa = "fa fa-pause-circle sc-incet-node";
//	            		classStr += " w-incet executing";
	            		status = "executing";
	            		mergeColor = " merge-incet";
            			mergeFaColor = " merge-fa-incet";
	            		if(nodeJson.beginTime){
	            			//开始执行时间
	            			var beginTime = new Date(Date.parse(nodeJson.beginTime.replace(/-/g, "/")));
	            			//流程节点已经执行时间
	            			var actualAfterDuration = (curDate.getTime() -  beginTime.getTime())/1000;
	            			if(actualAfterDuration > durationTemp){
	            				//超时时间
	            				nodeJson.overtime = convertDate(actualAfterDuration - durationTemp);
	            			}
	            			nodeJson.actualAfterDuration = convertDate((curDate.getTime() -  beginTime.getTime())/1000);
	            		}
	            		tooltip += "<li><span>已经用时：</span>"+nodeJson.actualAfterDuration+"</li>";
	            		//超时
		            	if(nodeJson.duration!=0 && nodeJson.overtime != 0  && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined"){
//		            	 	status = "optionexception";
//		            	 	fa = "fa fa-times-circle sc-error";
//		            		mergeColor = " merge-error";
//	            			mergeFaColor = " merge-fa-other";
		            		tooltip += "<li><span>执行状态：</span>执行超时</li>";	//超时
		            		tooltip += "<li><span>超时时间：</span>"+(nodeJson.overtime&&typeof(nodeJson.overtime) != "undefined"?nodeJson.overtime:"")+"</li>";
		            	}
		            	tooltip += "<li><span>开始时间：</span>"+(nodeJson.beginTime?nodeJson.beginTime:'')+"</li>";
//	            		tooltip += "<li><span>执行状态：</span>正在执行</li>";
		       
	            	}
	        		else if(status> 10 &&status< 20){//暂停
	        			fa = " fa fa-play-circle sc-unex";
	        			mergeColor = " merge-unex";
            			mergeFaColor = " merge-fa-other";
//	        			classStr += " optionstop";
//	            		status = "optionstop";
	            		tooltip += "<li><span>执行状态：</span>已暂停</li>";
	        		}
	            	else if(status==20 ){
	            		fa = "fa fa-times-circle sc-error";
	            		mergeColor = " merge-error";
            			mergeFaColor = " merge-fa-other";
//	            		classStr += " optionexception";
	            		status = "optionexception";
	            		tooltip += "<li><span>执行状态：</span>接收超时</li>";	//超时
		            	if(nodeJson.duration!=0 &&nodeJson.overtime != 0  && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined"){
		            		tooltip += "<li><span>超时时间：</span>"+(nodeJson.overtime&&typeof(nodeJson.overtime) != "undefined"?nodeJson.overtime:"")+"</li>";
		            	}
	            	}
	            	else if( status ==21){
	            		fa = "fa fa-times-circle sc-error";
	            		mergeColor = " merge-error";
            			mergeFaColor = " merge-fa-other";
//	            		classStr += " optionexception";
	            		status = "optionexception";
	            		tooltip += "<li><span>执行状态：</span>执行异常挂起</li>";
	            	}
	            	else if(status == 10){ //自动化任务执行失败
	            		fa = "fa fa-times-circle sc-error";
	            		mergeColor = " merge-error";
            			mergeFaColor = " merge-fa-other";
//	            		classStr += " optionexception";
	            		status = "optionexception";
	            		tooltip += "<li><span>执行状态：</span>执行失败</li>";
	            	}
	            	else if( status ==25){
	            		fa = "fa fa-times-circle sc-error";
	            		mergeColor = " merge-error";
            			mergeFaColor = " merge-fa-other";
//	            		classStr += " optionexception";
	            		status = "optionexception";
	            		if(nodeJson.beginTime){
	            			//开始执行时间
	            			var beginTime = new Date(Date.parse(nodeJson.beginTime.replace(/-/g, "/")));
	            			//流程节点已经执行时间
	            			var actualAfterDuration = (curDate.getTime() -  beginTime.getTime())/1000;
	            			if(actualAfterDuration > durationTemp){
	            				//超时时间
	            				nodeJson.overtime = convertDate(actualAfterDuration - durationTemp);
	            			}
	            			nodeJson.actualAfterDuration = convertDate((curDate.getTime() -  beginTime.getTime())/1000);
	            		}
	            		tooltip += "<li><span>已经用时：</span>"+nodeJson.actualAfterDuration+"</li>";
	            		tooltip += "<li><span>执行状态：</span>执行超时</li>";	//超时
		            	if(nodeJson.duration!=0 && nodeJson.overtime != 0  && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined" ){
		            		tooltip += "<li><span>超时时间：</span>"+(nodeJson.overtime&&typeof(nodeJson.overtime) != "undefined"?nodeJson.overtime:"")+"</li>";
		            	}
	            	}
	             	else if( status ==23){
	             		fa = " fa fa-play-circle sc-unex";
	             		mergeColor = " merge-unex";
            			mergeFaColor = " merge-fa-other";
//	             		classStr += " nooptionanStart";
//	            		status = "nooptionanStart";
	            		tooltip += "<li><span>执行状态：</span>跳过</li>";
	            	}
	             	else if( status ==24){
	             		fa = " fa fa-play-circle sc-unex";
	             		mergeColor = " merge-unex";
            			mergeFaColor = " merge-fa-other";
//	             		classStr += " nooptionanStart";
//	            		status = "nooptionanStart";
	            		tooltip += "<li><span>执行状态：</span>跳过</li>";
	            	}
	            	else{//未执行
	            		fa = " fa fa-play-circle sc-unex";
	            		mergeColor = " merge-unex";
            			mergeFaColor = " merge-fa-other";
//	            		classStr += " before";
	            		tooltip += "<li><span>执行状态：</span>未执行</li>";
	            		status = "before";
	            	}
	            	
	            	tooltip += "</ul></div>";
	            	if(nodeJson.type == "merge"){//合并节点不需要显示提示信息
//	            		classStr = "w";
	            		tooltip = "<div class='tooltip_description' style='display:none'><ul>" ;
	            		tooltip += "<li id='duration_"+nodeJson.id+"'><span>预计用时：</span>"+(nodeJson.duration&&nodeJson.duration!='null'?convertDate(nodeJson.duration):convertDate(0))+"</li>";
	            		tooltip += "<li id='executePeople_"+nodeJson.id+"'><span>负责人：</span>"+(nodeJson.executePeople?nodeJson.executePeople:"")+"</li>" ;
	            		tooltip += "</ul></div>";
	            		
	            	}
            	}
//        		classStr += " node-ep";
            }
            classStr += " "+status;
            var div;
            if(nodeJson.nodeStepType == "SubProcess"){
                div = "<div id='"+nodeJson.id+"' status='"+nodeJson.status+"' class='"+classStr+"' style='"+nodeJson.style+"' nodeType='"+(nodeJson.type?nodeJson.type:"")+"' pId='"+(nodeJson.pId?nodeJson.pId:"")+"'>" +
				"<span class='nodeItemName'>"+nodeJson.name+"</span>" +
				"<a  class='subicon'  href='javascript:;' title='查看子流程'  ></a>"+
				"<div class='ep' id='status"+nodeJson.id+"'></div>" +
				tooltip +
				"</div>";
            }  
            else if(nodeJson.nodeStepType == "CallActivity"){
                div = "<div id='"+nodeJson.id+"' status='"+nodeJson.status+"' class='"+classStr+"' style='"+nodeJson.style+"' nodeType='"+(nodeJson.type?nodeJson.type:"")+"' pId='"+(nodeJson.pId?nodeJson.pId:"")+"'>" +
				"<span class='nodeItemName'>"+nodeJson.name+"</span>" +
				"<a  class='subicon'  href='javascript:;' title='查看子流程'></a>"+
				"<div class='ep' id='status"+nodeJson.id+"'></div>" +
				tooltip +
				"</div>";
            }else{
                 div = "<div id='"+nodeJson.id+"' status='"+nodeJson.status+"' class=' "+classStr+"' style='"+nodeJson.style+"' nodeType='"+(nodeJson.type?nodeJson.type:"")+"' pId='"+(nodeJson.pId?nodeJson.pId:"")+"'>" +
                				"<i class='"+fa+"'></i><span class='nodeItemName'>"+nodeJson.name+"</span>" +
//                				"<i class='"+fa+"'></i><span class='nodeItemName'>"+nodeJson.name+">"+nodeJson.status+"</span>" +
                				"<div class='ep' id='status"+nodeJson.id+"'></div>" +
                				tooltip +
                				"</div>";
            }
            
     
//             console.log(nodeJson.id, nodeJson.status);
            var nodeDiv = $(div);
//            var fa = $this.getFa();
            if(nodeJson.pId){
//                nodeDiv.children("div.ep").css("background-color",$this.options.dic.TryGetValue(nodeJson.pId).color);
//            	nodeDiv.css("border-color",$this.options.dic.TryGetValue(nodeJson.pId).color);
            	nodeDiv.append("<div class='merge "+mergeColor+"'><i class='fa "+ $this.options.dic.TryGetValue(nodeJson.pId).fa + mergeFaColor +"'></i></div>");
            }else if(nodeJson.type == "merge"){
//            	console.log(fa)
//                nodeDiv.children("div.ep").css("background-color",nodeJson.color);
//            	nodeDiv.css("border-color",nodeJson.color);
            	nodeDiv.append("<div class='merge "+mergeColor+"'><i class='fa "+ nodeJson.fa +"s "+mergeFaColor+"'></i></div>");
            }
       //     alert(status);
            //绑定显示子流程的事件
        
            //显示流程执行状态的样式
//            nodeDiv.children("div.ep").addClass(status);//显示流程执行状态的样式
            //在非编辑状态下，只给合并节点和子节点添加右键菜单事件
            if($this.options.isEdit || (nodeJson.type == "merge" || nodeJson.pId)){
     
             	if($this.options.isSysEdit || ($this.options.isShowNodeState&&( nodeJson.pId || status =='after' || status == 'executing' || status == 'optionexception'
             		|| status == "optionstop" || status == "nooptionanStart" 
             		|| nodeJson.type == "end" ||nodeJson.type == "begin" ||nodeJson.nodeStepType == "SubProcess")) ){
             		
             	}else{
                nodeDiv.contextMenu('processMenu', {
                    shadow:false,
                    bindings: {
                        'pmCreateTask': $this.pmCreateTask,//新建节点
                    //    'pmCreateCallActivity': $this.pmCreateCallActivity,//新建外部子流程节点
                        'pmDelete': $this.deleteNode,//删除节点
                        'pmMerge': function(t) {//合并节点
                            var left = $this.options.currentNode.css("left");
                            var top = $this.options.currentNode.css("top");
                            $this.mergeNode(left,top);
                        },
                        //此方法为针对业务方法
                        'pmNodeInfo':function(){
                  
                        	var url=$this.options.updateUrl   ;
                    		var title=!title?"节点信息修改":title;
                    		var isEmecontentId=$this.options.dic.Item( nodeDiv.attr("id"))['isEmecontentId']?$this.options.dic.Item( nodeDiv.attr("id"))['isEmecontentId']:"1";
                			var peopleId=$this.options.dic.Item( nodeDiv.attr("id"))['executePeopleId'];
                    		var groupId=$this.options.dic.Item( nodeDiv.attr("id"))['groupId']?$this.options.dic.Item( nodeDiv.attr("id"))['groupId']:"";
                		
                    		createwindowForData(title, url,{ 
                    			empName:$this.options.dic.Item( nodeDiv.attr("id"))['executePeople'],
                    			nodeStepType:$this.options.dic.Item( nodeDiv.attr("id"))['nodeStepType'],
                    			empId:peopleId,
                    			groupId:groupId,
                    			isEmecontentId:!peopleId||isEmecontentId=='0'?'0':'1',//是否应急通讯录Id
                    			duration:$this.options.dic.Item( nodeDiv.attr("id"))['duration'],
                    			name:$this.options.dic.Item( nodeDiv.attr("id"))['name'],
                    			subPrecautionId:$this.options.dic.Item( nodeDiv.attr("id"))['subPrecautionId'],
                    			planInfoId:$this.options.dic.Item( nodeDiv.attr("id"))['planInfoId']?$this.options.dic.Item( nodeDiv.attr("id"))['planInfoId']:$this.options.dic.arrValues[0]['planInfoId'],
                				after : function(info) {
                			//		var v=nodeDiv.attr("id");
                					
                					$this.options.dic.Item( nodeDiv.attr("id"))['isEmecontentId']=	info.isEmecontentId
                					$this.options.dic.Item( nodeDiv.attr("id"))['name']=	info.name;
                					
                					if($this.options.dic.Item( nodeDiv.attr("id"))['nodeStepType']=="UserTask"){
                						$this.options.dic.Item( nodeDiv.attr("id"))['executePeople']=	info.empName;
                    					$this.options.dic.Item( nodeDiv.attr("id"))['executePeopleId']=	info.empId;
                    					$this.options.dic.Item( nodeDiv.attr("id"))['duration']=	info.duration;
                    					$this.options.dic.Item( nodeDiv.attr("id"))['groupId']=	info.groupId;
                    					$('#executePeople_'+nodeDiv.attr("id")).html('<span>执行人：</span>'+(info.empName));
                    					$('#duration_'+nodeDiv.attr("id")).html('<span>预计用时：</span>'+(	info.duration&&info.duration!='null'?info.duration:""));
                    				
                					}else{
                    					$this.options.dic.Item( nodeDiv.attr("id"))['subPrecautionId']=	info.precautionId;
                					}
                			//		var v=$this.options.dic.Item( nodeDiv.attr("id"));
                					//set_check_contact(contact);
                					nodeDiv.find('.nodeItemName').html(info.name);
                					$this.options.instance.revalidate(nodeDiv);   
                					$this.options.isSave = false;
                					
                					//刷新
                                    $this.refresh();
                				}
                			}); 
                         	// 	updateNewInfo(param);
                        },
                        'pmPerson':function(){
                        	var param = {
                    				singleSelect:true,
                    				after : function(emp) {
                    					$this.options.dic.Item( nodeDiv.attr("id"))['executePeople']=	emp[0].empName;
                    					$this.options.dic.Item( nodeDiv.attr("id"))['executePeopleId']=	emp[0].empId;
                    				//	var v=$this.options.dic.Item( nodeDiv.attr("id"));
                    					//set_check_contact(contact);
                    					$('#executePeople_'+nodeDiv.attr("id")).html('<span>执行人：</span>'+(	emp[0].empName));
                    				}
                    			};
                        	check_user_byp(param);
                        },
                        'pmRefresh': function(t) {//刷新整个视图
                            $this.refresh();
                        },
                        'pmCancel': function(t) {//取消合并节点
                            $this.cancelNode($this.options.currentNode);
                        },
                        'pmUnfold': function(t) {//展开节点
                           $this.unfoldNode($this.options.currentNode);
                        },
                        'pmShrink': function(t) {//收缩节点
                           $this.shrinkNode($this.options.currentNode);
                        },
                        'pmModify': function(t) {//修改节点名称
                            var text = nodeDiv.find('.nodeItemName').text();
                            nodeDiv.children("span").html("");
                            // nodeDiv.html("");
                            nodeDiv.append("<input type='text' maxlength=50 value='" + text + "' />");//最多输入50个字符
                            nodeDiv.children("input").mouseleave(function () {
                                var value = $("input[type='text']").val();
                                nodeDiv.children("span").html(value);
                                nodeDiv.children("input").remove();
                                // $this.drawing(nodeDiv);
                                $this.options.instance.revalidate(nodeDiv);
                                var id = nodeDiv.attr("id");
                                var pId = nodeDiv.attr("pId");
                                //能取到pId，表示是合并过的子节点
                                if(!pId){
                                    var node = $this.options.dic.TryGetValue(id);
                                    node.name = value;
                                }else{
                                    var target = $this.options.dic.TryGetValue(pId);
                                    var subNode = target.subNode;
                                    for(var i = 0 ; i < subNode.length ; i++){
                                        if(id == subNode[i].id){
                                            subNode[i].name = value;
                                            break;
                                        }
                                    }
                                }
                                $this.options.isSave = false;
                            });
                            // $this.drawing(nodeDiv);
                            $this.options.instance.revalidate(nodeDiv);
                        },
                        'pmPrincipal': function(t) {//配置属性
                        	var id = nodeDiv.attr("id");
                        	var node = $this.options.dic.TryGetValue(id);
                        	
                        	var url=path+'/detEditPro/mergeNodeEdit?id='+id+'&duration='+node.duration+'&executePeople='+node.executePeople+'&executeA='+node.executeA;
                    		createwindow("配置合并节点",url,750,150);
//                        	console.log("pmPrincipal",id);
//                        	var param = {
//                        			singleSelect:true,
//                        			after : function(users) {
//                        				var node = $this.options.dic.TryGetValue(id);
//                        				if(users && users.length > 0){
////                        					console.log("after",node,users);
//                        					node.executorA = users[0].userId;
//                        					node.executePeople = users[0].userName;
////                        					console.log(nodeDiv.find("#executePeople_"+node.id));
//                        					nodeDiv.find("#executePeople_"+node.id).empty().append("<span>负责人：</span>"+users[0].userName+"</li>");
//                        				}
//                        			}
//                        		};
//                        		check_sysuser_byp(param);
                         }
                    },
                    onShowMenu: function(e, menu) {
                        $this.options.point = {x: $this.options.scrollWidth/2, y:$this.options.crollHeight/2};
                        $this.options.currentNode = $(e.currentTarget);
                        var id = $this.options.currentNode.attr("pId");

                    	
                        if($(".ui-selected").length > 1){
                        	//多选只显示合并节点与新建节点菜单
                        		$('#pmDelete, #pmShrink, #pmUnfold, #pmModify, #pmUnfold, #pmCancel, #pmPrincipal', menu).remove();
                        }else{
                        	  if($this.options.currentNode.attr("class").indexOf( "subprocess")>-1&&!$this.options.isShowNodeState){//合并节点不显示合并与收缩菜单
                          		$('#pmDelete, #pmShrink, #pmUnfold, #pmModify,#pmMerge, #pmUnfold, #pmCancel', menu).remove();
	                            }
                        	  else if($this.options.currentNode.attr("pId")){//子节点不显示合并与展开菜单
	                                $('#pmMerge, #pmUnfold, #pmCancel, #pmPrincipal', menu).remove();
	                            }else if($this.options.currentNode.attr("nodetype") == "merge"){//合并节点不显示合并与收缩菜单
	                                $('#pmDelete, #pmMerge, #pmShrink', menu).remove();
	                            }
	                            else if($this.options.currentNode.attr("id").indexOf("sid-") == 0&&!$this.options.isShowNodeState){//以“sid-”开头的节点是创建预案时新建的节点，不允许删除
	                                $('#pmMerge, #pmUnfold, #pmShrink, #pmCancel, #pmPrincipal', menu).remove();
	                            }
	                            else if($this.options.currentNode.attr("id").indexOf("sid-") == 0&&$this.options.isShowNodeState){//以“sid-”开头的节点是创建预案时新建的节点，不允许删除
	                                $('#pmMerge, #pmUnfold, #pmShrink, #pmCancel, #pmPrincipal', menu).remove();
	                            }
	                            else{
	                                $('#pmMerge, #pmUnfold, #pmShrink, #pmCancel, #pmPrincipal', menu).remove();
	                            }
                        	
                        }
                        return menu;
                    }
                });
             	}
            }
            
            $this.$element.append(nodeDiv);
            nodeDiv.find(".subicon").bind('click',function(){
            	var n=$this.options.dic.Item( nodeDiv.attr("id"));
            	$this.options.showSubProcess(n);
            });
            
            //节点双击事件
            nodeDiv.dblclick( function () { 
            	$this.options.sysNodeSelect($(this));
            });
            
            return nodeDiv;
        },
        //删除节点
        deleteNode:function (t){
            var node = $(t);
            var nodeType = node.attr("nodeType");
            if(nodeType == "begin"){
                 window.top.$.messager.alert("系统提示","流程开始节点不能删除！","info");
                return;
            }else if(nodeType == "end"){
                 window.top.$.messager.alert("系统提示","流程结束节点不能删除！","info");
                return;
            }
            var id = node.attr("id");
            var pId = node.attr("pId");
            //能取到pId，表示是合并过的子节点
            if(!pId){
                $this.options.dic.Remove(id);
            }else{
                var target = $this.options.dic.TryGetValue(pId);
                var subNode = target.subNode;
                for(var i = 0 ; i < subNode.length ; i++){
                    if(id == subNode[i].id){
                        subNode.splice(i,1);
                        break;
                    }
                }
                //合并节点下还剩一个子节点，则自动删除合并节点数据，只保留子节点
                if(subNode.length == 1){
                    var nodeJson = subNode[0];
                    nodeJson.pId = "";
                    $this.options.dic.Add(nodeJson.id,nodeJson);
                    $this.options.dic.Remove(target.id);
                }
            }
            $this.removeProcess(id);
            $this.refresh();
            $this.options.isSave = false;
        },

        //合并节点
        mergeNode:function (left,top){
            //获取选择的节点
            var nodes = $(".ui-selected");
            
            for(var i = 0 ; i < nodes.length ; i++){
                var id = $(nodes[i]).attr("id");
                var nodeJson = $this.options.dic.TryGetValue(id);
                
                if(!nodeJson || nodeJson.type == "merge"){
                     window.top.$.messager.alert("系统提示","不能与已经合并过的节点进行第二次合并！","info");
                    return;
                }
	             else if(nodeJson.type == "begin"){
	                  window.top.$.messager.alert("系统提示","开始节点不能进行合并！","info");
	                 return;
	             }else if(nodeJson.type == "end"){
	                  window.top.$.messager.alert("系统提示","结束节点不能进行合并！","info");
	                 return;
	             }
	             else if(nodeJson.nodeStepType == "CallActivity"){
	                  window.top.$.messager.alert("系统提示","外部流程子节点不能进行合并！","info");
	                 return;
	             }
	             else if(nodeJson.nodeStepType == "SubProcess"){
	                  window.top.$.messager.alert("系统提示","内部子流程节点不能进行合并！","info");
	                 return;
	             }
                //判断连接
	             else if (!nodeJson['process'] || nodeJson['process'].length<1){
	                  window.top.$.messager.alert("系统提示","节点连线不正确，不能合并！","info");
	                  return;
	             }
	             else if (!$this.validBackProcessForNode(id)){
	                  window.top.$.messager.alert("系统提示","节点连线不正确，不能合并！","info");
	                  return;
	             }
            }

            var arr = [];
            for(var i = 0 ; i < nodes.length ; i++){
                var id = $(nodes[i]).attr("id");
                var nodeJson = $this.options.dic.TryGetValue(id);
                var process = nodeJson.process;
                for(var j = 0; j < process.length ; j++){
                    arr.push([nodeJson.id,process[j].id]);
                }
            }
            var mergeNodeId = new Date().getTime();
            //设置选中节点的上一步连接合并后的节点
            $this.setBackProcess(nodes, mergeNodeId);
            var process = $this.getProcess(nodes);
            
            if(!$this.validationMergeNode(nodes, process)){
            	 window.top.$.messager.alert("系统提示","选中的节点不能进行合并！","info");
            	return;
            }
            
            var mergeNodeJson = {
                            "id": mergeNodeId+"",
                            "pId":"",
                            "name": "合并节点",
                            "process": process,
                            "type":"merge",
                            "isShow": 1,
                            'isNewNode':"1",
                            "style": "left: "+left+";top: "+top+";",
                            "subNode":[],
                            "color":$this.getColor(),
                            "fa":$this.getFa()
                            };
            
            var duration = 0;//合并节点预计用时时间
            for(var i = 0 ; i < nodes.length ; i++){
                var id = $(nodes[i]).attr("id");
                var nodeJson = $this.options.dic.TryGetValue(id);
                nodeJson.pId = mergeNodeId;
                duration += nodeJson.duration;
                mergeNodeJson.subNode.push(nodeJson);
                $this.options.dic.Remove(id);
            }
            mergeNodeJson.duration =duration;
            $this.options.dic.Add(mergeNodeId,mergeNodeJson);
            $this.refresh();
            $this.options.isSave = false;
        },
        //检验选中的节点是否可以合并
        validationMergeNode:function(nodes, mProcess){
//        	console.log(mProcess);        	//下一步只有一个节点，选中的节点可以进行合并
        	if(mProcess.length == 1){
        		return true;
        	}
            //选中节点的id数组
            var idArr = [];
            var temp = true;
            for(var i =0 ; i < nodes.length ; i++){
            	var nodeJson = $this.options.dic.TryGetValue($(nodes[i]).attr("id"));
            	if(nodeJson.process.length > 1){
            		temp = false;
            	}
                idArr.push($(nodes[i]).attr("id"));
            }
            //如果合并后节点的下一步流程有多个，并且选中的节点中，下一步没有多个流程分支，节点不能合并
            if(temp){
            	return false;
            }
            for(var i =0 ; i < mProcess.length ; i++){
            	//idArr是否是process对应节点的后续流程，是返回true，
//            	if(!$this.options.dic.TryGetValue(mProcess[i].id)){
//					return false;
//				}
            //	temp = $this.isNext(idArr,$this.options.dic.TryGetValue(mProcess[i].id).process);
            	temp = $this.isNext(idArr,$this.getDicValueById(mProcess[i].id).process);
            	if(temp){
            		return false;
            	}
            }
            return true;
        },
        //idArr是否是process对应节点的后续流程，不是返回true，
        isNext:function(idArr, process){
        	for(var i = 0 ; i < process.length ; i++){
            	if(idArr.indexOf(process[i].id) != -1){
            		return true;
            	}else{
            		//var nodeJson = $this.options.dic.TryGetValue(process[i].id);
            			var	nodeJson=$this.getDicValueById(process[i].id);
            		return $this.isNext(idArr, nodeJson.process);
            	}
            }
        	return false;
        },
        //根据id 向下获取，包括合并节点内部的子节点
        getDicValueById:function(id){
        	
        	var values=$this.options.dic.arrValues;
        	var nodeJson=null;
        	$.each(values,function(i,o){
        		var vId=o['id'];
        		if(vId==id){
        			nodeJson=o;
        			return false;
        		}
        		if(o['subNode'] && o['subNode'].length>0){
                	$.each(o['subNode'],function(k,j){
                		vId=j['id'];
                		if(vId==id){
                			nodeJson=o;
                			return false;
                		}
                	});
        		}
        		if(nodeJson){
        			return false;
        		}
        	});
        	
        	if(!nodeJson){
                throw "没有找到节点数据。";
        	}
        	return nodeJson;
        },
        //校验所有的节点是否都有上一步
        validBackProcess:function(){
        	var temp = false;
        	 var values = $this.options.dic.Values();
             for(var i = 0 ; i < values.length ; i++){
            	 temp = false;
            	 if(values[i].type == "begin"){
            		 continue;
            	 }
            	 for(var j = 0 ; j < values.length ; j++){
//            		 temp = false;
                	 var process = values[j].process;
                	 for(var k = 0 ; k < process.length ; k++){
//                		 if(values[i].id == "a3"){
//                			 console.log(values[j]);
//                			 console.log(process[k]);
//                		 }
                		 if(values[i].id == process[k].id){
//                			 console.log(values[i].name);
                			 temp = true;
                			 break;
                		 }
                	 }
                	 if(temp){
                		 break;
                	 }
                 }
//            	 if(values[i].id == "a3"){
//            		 console.log(temp);
//            	 }
            	 //如果一个节点遍历完成后都没有找到连接到它的节点
            	 if(!temp){
            		// console.log(values[i]);
            		 return false;
            	 }
             }
             return true;
        },

        //校验指定的节点是否都有上一步
        validBackProcessForNode:function(nodeId){
        	var temp = false;
        	 var values = $this.options.dic.Values();
             for(var i = 0 ; i < values.length ; i++){
            	 if(values[i].id!=nodeId){
            		 continue;
            	 }
            	 temp = false;
            	 if(values[i].type == "begin"){
            		 continue;
            	 }
            	 for(var j = 0 ; j < values.length ; j++){
//            		 temp = false;
                	 var process = values[j].process;
                	 for(var k = 0 ; k < process.length ; k++){
//                		 if(values[i].id == "a3"){
//                			 console.log(values[j]);
//                			 console.log(process[k]);
//                		 }
                		 if(values[i].id == process[k].id){
//                			 console.log(values[i].name);
                			 temp = true;
                			 break;
                		 }
                	 }
                	 if(temp){
                		 break;
                	 }
                 }
//            	 if(values[i].id == "a3"){
//            		 console.log(temp);
//            	 }
            	 //如果一个节点遍历完成后都没有找到连接到它的节点
            	 if(!temp){
            		// console.log(values[i]);
            		 return false;
            	 }
             }
             return true;
        },
        
        //获取合并后的节点的下一步流程对象
        getProcess:function (nodes){
            //选中节点的id数组
            var idArr = [];
            var processArr = new Dictionary();
            for(var i =0 ; i < nodes.length ; i++){
                idArr.push($(nodes[i]).attr("id"));
            }
            for(var i =0 ; i < nodes.length ; i++){
                var id = $(nodes[i]).attr("id");
                var nodeJson = $this.options.dic.TryGetValue(id);
                var process = nodeJson.process;
                for(var j = 0 ; j < process.length ; j++){
                    if(idArr.indexOf(process[j].id) == -1){
                        if(!processArr.ContainsKey(process[j].id)){
                            processArr.Add(process[j].id, process[j]);
                        }
                    }
                }
            }
            return processArr.Values();
        },

        //设置选中节点的上一步连接合并后的节点
        setBackProcess:function (nodes, nextId){
        	
            //选中节点的id数组
            var idArr = [];
            for(var i =0 ; i < nodes.length ; i++){
                idArr.push($(nodes[i]).attr("id"));
            }
//            console.log(idArr);
            var values = $this.options.dic.Values();
            for(var i = 0 ; i < values.length ; i++){
                //因为是找上一步连接的节点，所有已经选中的节点不在判断的范畴中
                if(idArr.indexOf(values[i].id) != -1){
                    continue;
                }
                var process = values[i].process;
                for(var j = 0 ; j < process.length ; j++){
                    //如果节点先前有连接被选中的节点
                    if(idArr.indexOf(process[j].id) != -1){
                        process.push({"id":nextId+"","name":""});
                        break;
                    }
                }
                if(values[i].type == "merge"){
                    var subNode = values[i].subNode;
                     for(var j = 0 ; j < subNode.length ; j++){
                        var subProcess = subNode[j].process;
                        for(var k = 0 ; k < subProcess.length ; k++){
                            if(idArr.indexOf(subProcess[k].id) != -1){
                                subProcess.push({"id":nextId+"","name":""});
                                break;
                            }
                        }
                     }
                }
            }
        },

        //删除节点的时候同时删除数据上的链路关系
        removeProcess:function (id){
            var values = $this.options.dic.Values();
            for(var i = 0 ; i < values.length ; i++){
                var process = values[i].process;
                for(var j = 0 ; j < process.length ; j++){
                    if(process[j].id == id){
                        process.splice(j,1);
                        j--;
                    }
                }
                if(values[i].type == "merge"){
                    var subNode = values[i].subNode;
                     for(var j = 0 ; j < subNode.length ; j++){
                        var subProcess = subNode[j].process;
                        for(var k = 0 ; k < subProcess.length ; k++){
                            if(subProcess[k].id == id){
                                subProcess.splice(k,1);
                                k--;
                            }
                        }
                     }
                }
            }
        },

        //取消合并节点
        cancelNode:function (node){
            var id = node.attr("id");
            var nodeJson = $this.options.dic.TryGetValue(id);
            var subNode = nodeJson.subNode;
            for(var i = 0 ; i < subNode.length ; i++){
                subNode[i].pId = "";
                $this.options.dic.Add(subNode[i].id,subNode[i]);
            }
            $this.options.dic.Remove(id);
            //遍历删除之前与合并节点关联的数据
            $this.removeProcess(id);
            $this.refresh();
            $this.options.isSave = false;
        },

        //收缩节点
        shrinkNode:function (node){
            var pId = node.attr("pId");
            var nodeJson = $this.options.dic.TryGetValue(pId);
            nodeJson.isShow = 1;

            $this.refresh();
            $this.options.isSave = false;
        },

        //展开合并后的节点
        unfoldNode:function (node){
            var id = node.attr("id");
            var nodeJson = $this.options.dic.TryGetValue(id);
            nodeJson.isShow = 0;
            $this.refresh();
            $this.options.isSave = false;
        },

        //刷新视图
        refresh:function (flowData){
        	$this.options.colorIndex = 0;
        	//刷新删除已经提示出来的div
        	$(".jquery-gdakram-tooltip").remove();
            if(flowData){
                $this.options.dic.Clear();
                //初始化流程节点数据缓存
                for(var i = 0 ; i < flowData.length ; i++){
                	 if($this.options.showMergeNode == 1){
                         flowData[i].isShow = 1;
                     }else if($this.options.showMergeNode == 2){
                         flowData[i].isShow = 0;
                     }
                    if(flowData[i].type == "merge"){
                        flowData[i].color = $this.getColor();
                        flowData[i].fa = $this.getFa();
                    }
                    $this.options.dic.Add(flowData[i].id,flowData[i]);
                }
            }
            
            //获取当前节点的位置，转换为视图位置的百分比
//            $this.convertPoint();
          //布局
            $this.laout(true);
            //清除视图所有元素
            $this.removeAll();
            //根据数据重新初始化视图
            $this.initData();
          //编辑模式下  isShowNodeState=false 不需要显示节点状态
//            if(!$this.options.isEdit || $this.options.isShowNodeState){
            	$("div.tooltip").tooltip();
//            }
        },

        //删除视图所有元素
        removeAll:function (){
            $this.removeAllNode();
            $this.removeAllConnections();
            $('.jquery-gdakram-tooltip').remove();
        },

        //删除所有节点
        removeAllNode:function (){
            $("."+$this.$element.attr("id")+" .w").remove();
        },

        //删除所有link
        removeAllConnections:function (){
            //删除所有锚点
            $this.options.instance.deleteEveryEndpoint();
            var connections = $this.options.instance.getConnections();
            for(var i = 0 ; i < connections.length ; i++){
                $this.options.instance.detach(connections[i]);
            }
        },

        //删除节点相关的连接线
        deleteConnectionByNode:function (node){
            var connections = $this.options.instance.getConnections();
            for(var i = 0 ; i < connections.length ; i++){
                var source = connections[i].source;
                var target = connections[i].target;
                if(!!source && source.id == node.attr("id")){
                    $this.options.instance.detach(connections[i]);
                }else if(!!target && target.id == node.attr("id")){
                    $this.options.instance.detach(connections[i]);
                }
            }
        },
        //菜单事件，创建新的节点
        pmCreateTask:function (t){
//        	var nodeId = "sid-55c6c0a8-514b-46fd-a8d8-70ec0a60a363";
////        	var c = jsPlumb.getConnections({targetId:nodeId});
////        	console.log(c);
//        	var connections = $this.options.instance.getAllConnections();
//        	for(var i = 0 ; i < connections.length ; i++ ){
//        		if(connections[i].targetId == nodeId){
//	            	var childNodes = connections[i].canvas.childNodes;
//	//            	console.log(connections[i]);
//	            	if(childNodes){
//	            		for(var j = 0 ; j < childNodes.length ; j++ ){
//	            			var childNode = childNodes[j];
//	        				childNode.attributes.stroke.value="#179335"
//	    					if(j == (childNodes.length - 1)){
//	    						childNode.attributes.fill.value="#179335"
//	    					}
//	            		}
//	            	}
//        		}
//            	
//        	}
        	
        	
        	
            var id = new Date().getTime();
            id='sid-'+id;
            var nodeJson = {
                            "id":id+"",
                            "pId":"",
                            "name": "新建节点",
                            "process": [],
                            "type":"",
                            "duration":0,
                            "nodeStepType":"UserTask",
                            "status":"",
                            "isShow": 1,
                            "isNewNode":'1',
                            "style": "left: "+$this.options.point.x+"px;top: "+$this.options.point.y+"px;"
                            };

            var node = $this.createNode(nodeJson);
            // 可以拖动
            $this.options.instance.draggable(node);
            //可以连接链路
            $this.drawing(node);
            $this.options.dic.Add(id,nodeJson);
            $this.options.isSave = false;
        },
        //菜单事件，创建新的外部子流程节点
        pmCreateCallActivity:function (t){
            var id = new Date().getTime();
            id='sid-'+id;
            var nodeJson = {
                            "id":id+"",
                            "pId":"",
                            "name": "新建外部子流程",
                            "process": [],
                            "type":"",
                            "nodeStepType":"CallActivity",
                            "status":"",
                            "isShow": 1,
                            "isNewNode":'1',
                            "style": "left: "+$this.options.point.x+"px;top: "+$this.options.point.y+"px;"
                            };

            var node = $this.createNode(nodeJson);
            // 可以拖动
            $this.options.instance.draggable(node);
            //可以连接链路
            $this.drawing(node);
            $this.options.dic.Add(id,nodeJson);
            $this.options.isSave = false;
        },
        //获取当前节点的位置，转换为视图位置的百分比
        convertPoint:function (){
            var values = $this.options.dic.Values();
            for(var i = 0 ; i < values.length ; i++){
                // console.log($("#"+values[i].id).css("left"));
                if($("#"+values[i].id)[0]){
                    var left = parseFloat($("#"+values[i].id).css("left"));
                    var top = parseFloat($("#"+values[i].id).css("top"));
//                     console.log($this.forDight(left/_scrollWidth*100, 4) + ", " + $this.forDight(top/_scrollHeight*100, 4));

                    values[i].style = "left:"+$this.forDight(left/$this.options.scrollWidth*100, 4)+"%;top:"+$this.forDight(top/$this.options.scrollHeight*100, 4)+"%;";
                }
                if(values[i].type == "merge"){//合并节点
                    var subNode = values[i].subNode;
                    for(var j = 0 ; j < subNode.length ; j++){
                        if($("#"+subNode[j].id)[0]){
                            var left = parseFloat($("#"+subNode[j].id).css("left"));
                            var top = parseFloat($("#"+subNode[j].id).css("top"));
//                             console.log($this.forDight(left/_scrollWidth*100, 4) + ", " + $this.forDight(top/_scrollHeight*100, 4));

                            subNode[j].style = "left:"+$this.forDight(left/$this.options.scrollWidth*100, 4)+"%;top:"+$this.forDight(top/$this.options.scrollHeight*100, 4)+"%;";
                        }
                    }
                }
            }
        },

        //获取最开始的节点流程数据
        getBeginProcess:function (arr, id){
            if(!id){
                id = arr[0][1];
            }
            var proc = null;
            for(var i = 0 ; i < arr.length ; i++){
                if(id == arr[i][1]){
                    proc = $this.getBeginProcess(arr, arr[i][0]);
                    if(proc){
                        return proc;
                    }else{
                        return arr[i];
                    }
                }
            }
            return proc;
        },

        //获取id对应流程节点的上一步流程节点
        getBackNodeId:function (id){
            var values = $this.options.dic.Values();
            for(var i = 0 ; i < values.length ; i++){
                var process = values[i].process;
                for(var j = 0 ; j < process.length ; j++){
                    if(process[j].id == id){
                        return values[i].id;
                    }
                }
            }
            return null;
        },

        //获取分支流程结束的节点id数组
        getProcessEndId:function (idArr,process, subIdArr){
            for(var i =0 ; i < process.length ; i++){
                //判断id对应的节点是否被选中
                if($this.isSelect(process[i].id)){
                    subIdArr.push(process[i].id);
                    var nodeJson = $this.options.dic.TryGetValue(process[i].id);
                    $this.getProcessEndId(idArr,nodeJson.process,subIdArr);
                }else{
                    //第一层流程分支有可能有的没有选中，所以不纳入判断
                    // if(!isRoot){
                        idArr.push(process[i].id);
                    // }
                }
            }
        },

        //判断id对应的节点是否被选中
        isSelect:function (id){
            //获取选择的节点
            var nodes = $(".ui-selected");
            for(var i = 0 ; i < nodes.length ; i++){
                if(id == $(nodes[i]).attr("id")){
                    return true;
                }
            }
            return false;
        },

        //合并开始和结束节点相同的数据
        addBeginNodeData:function (arr){
            var idArr = [];
            //遍历得到选中节点的编号数组
            for(var i = 0 ; i < arr.length ; i++){
                idArr.push(arr[i][0]);
            }
            var values = $this.options.dic.Values();
            //遍历所有节点数据
            for(var i = 0 ; i < values.length ; i++){
                //如果节点已经在选中的数据中，则退出此次循环
                if(idArr.indexOf(values[i].id) != -1){
                    continue;
                }
                //获取子流程
                var process = values[i].process;
                //只判断一个节点下有多个子流程的情况
                if(process.length < 2){
                    continue;
                }
                for(var j = 0 ; j < process.length ; j++){

                    //如果选中的节点是多个子流程中的一个
                    if(idArr.indexOf(process[j].id) != -1){
                        for(var k = 0 ; k < process.length ; k++){
                            if(idArr.indexOf(process[k].id) != -1){
                                arr.unshift([values[i].id, process[k].id]);
                            }
                        }
                        return;
                    }
                }
            }
        },

        //合并流程数据，调用此方法前要见dataIndex置为0
        mergeNodeData:function (arr){
            if($this.options.dataIndex == arr.length){
                return;
            }
            var temp = false;
            // console.log(arr);
            // console.log(dataIndex);
            for(var i = 0 ; i < arr.length ; i++){
                if(arr.length == 1){
                    return;
                }
                if(arr[$this.options.dataIndex][1] == arr[i][0]){
                    arr[$this.options.dataIndex][1] = arr[i][1];
                    arr.splice(i,1);
                    temp = true;
                    i--;
                }
            }
            if(temp){
                $this.options.dataIndex = 0;
            }else{
                $this.options.dataIndex++;
            }
            $this.mergeNodeData(arr);
        },
        floatSub:function(arg1,arg2){  
            var r1,r2,m,n;  
            try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}  
            try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}  
            m=Math.pow(10,Math.max(r1,r2));  
            //动态控制精度长度  
            n=(r1>=r2)?r1:r2;  
            return ((arg1*m-arg2*m)/m).toFixed(n);  
        },


        // function mergeNodeData(arr,beginData){
        //     var beginId = beginData[0];
        //     var endId = beginData[1];
        //     for(var i = 0 ; i < arr.length ; i++){
        //         if(arr[i][0] == endId){
        //             endId = arr[i][1];
        //             arr.splice(i,1);
        //             i--;
        //         }
        //     }
        //     console.log(arr);
        // }

        // var arr = [["6", "8"], ["7", "8"], ["8", "9"], ["5", "6"], ["5", "7"]];
        // arr.push([6,1438048090550]);
        // arr.push([7,8]);
        // arr.push([1438048090550,8]);
        // var beginData = getBeginProcess(arr, null);
        // console.log(arr);
        // console.log(beginData);
        // mergeNodeData(arr,beginData);
        // console.log(arr);


        /*Javascript设置要保留的小数位数，四舍五入。
        *ForDight(Dight,How):数值格式化函数，Dight要格式化的 数字，How要保留的小数位数。
        *这里的方法是先乘以10的倍数，然后去掉小数，最后再除以10的倍数。
        */  
        forDight:function (Dight,How){  
            Dight = Math.round(Dight*Math.pow(10,How))/Math.pow(10,How);  
            return Dight;  
        },
        isSave:function(){
        	return $this.options.isSave;
        },
        //绑定操作菜单html
        appendMenu:function (){
            //节点的右键菜单
        	//
        	var processMenu;
        	if($this.options.isShowNodeState){
             processMenu = "<div id='processMenu' style='display:none;'>"+
              "<ul>"+
              		//2017 smq
                "<li id='pmCreateTask'><i class='icon-plus'></i>&nbsp;<span class='_label'>新建任务</span></li>"+
           //     "<li id='pmCreateCallActivity'><i class='icon-plus'></i>&nbsp;<span class='_label'>新建外部流程</span></li>"+
   //             "<li id='pmModify'><i class='icon-edit'></i>&nbsp;<span class='_label'>修改名称</span></li>"+
     //           "<li id='pmPerson'><i class='icon-trash'></i>&nbsp;<span class='_label'>修改执行人</span></li>"+
                "<li id='pmNodeInfo'><i class='icon-edit'></i>&nbsp;<span class='_label'>修改信息</span></li>"+
         //       "<li id='pmShrink'><i class='icon-resize-small'></i>&nbsp;<span class='_label'>收缩节点</span></li>"+
         //       "<li id='pmUnfold'><i class='icon-resize-full'></i>&nbsp;<span class='_label'>展开节点</span></li>"+
              //  "<li id='pmMerge'><i class='icon-trash'></i>&nbsp;<span class='_label'>合并节点</span></li>"+
            //    "<li id='pmCancel'><i class='icon-repeat'></i>&nbsp;<span class='_label'>取消合并</span></li>"+
                "<li id='pmDelete'><i class='icon-trash'></i>&nbsp;<span class='_label'>删除节点</span></li>"+
                "<li id='pmRefresh'><i class='icon-refresh'></i>&nbsp;<span class='_label'>刷新视图</span></li>"+
              "</ul>"+
            "</div>";
        	}else{ 
                processMenu = "<div id='processMenu' style='display:none;'>"+
                "<ul>"+
                  "<li id='pmCreateTask'><i class='icon-plus'></i>&nbsp;<span class='_label'>新建任务</span></li>"+
               //   "<li id='pmCreateCallActivity'><i class='icon-plus'></i>&nbsp;<span class='_label'>新建外部流程</span></li>"+
                  "<li id='pmModify'><i class='icon-edit'></i>&nbsp;<span class='_label'>修改名称</span></li>"+
                  "<li id='pmShrink'><i class='icon-resize-small'></i>&nbsp;<span class='_label'>收缩节点</span></li>"+
                  "<li id='pmUnfold'><i class='icon-resize-full'></i>&nbsp;<span class='_label'>展开节点</span></li>"+
                  "<li id='pmMerge'><i class='icon-trash'></i>&nbsp;<span class='_label'>合并节点</span></li>"+
                  "<li id='pmCancel'><i class='icon-repeat'></i>&nbsp;<span class='_label'>取消合并</span></li>"+
                  "<li id='pmDelete'><i class='icon-trash'></i>&nbsp;<span class='_label'>删除节点</span></li>"+
                  "<li id='pmPrincipal'><i class='icon-user'></i>&nbsp;<span class='_label'>配置属性</span></li>"+
                "</ul>"+
              "</div>";
        	}
            if(!$this.options.isEdit){//非编辑状态不显示右键菜单
                processMenu = "<div id='processMenu' style='display:none;'>"+
//                      "<ul>"+
//                        "<li id='pmShrink'><i class='icon-resize-small'></i>&nbsp;<span class='_label'>收缩节点</span></li>"+
//                        "<li id='pmUnfold'><i class='icon-resize-full'></i>&nbsp;<span class='_label'>展开节点</span></li>"+
//                      "</ul>"+
                    "</div>";
            }else{
            	if($this.options.isViewPprocessMenu){
                //视图空白区域的右键菜单
                viewPprocessMenu = "<div id='viewPprocessMenu' style='display:none;'>"+
                      "<ul>"+
                        "<li id='pmCreateTask'><i class='icon-plus'></i>&nbsp;<span class='_label'>新建节点</span></li>"+
                      //		//2017 smq  "<li id='pmCreateCallActivity'><i class='icon-plus'></i>&nbsp;<span class='_label'>新建节点</span></li>"+
                        "<li id='pmSave'><i class='icon-ok'></i>&nbsp;<span class='_label'>保存设计</span></li>"+
                        "<li id='pmRefresh'><i class='icon-refresh'></i>&nbsp;<span class='_label'>刷新视图</span></li>"+
                      "</ul>"+
                    "</div>";
                $(document.body).append(viewPprocessMenu);
            	}
            }
            $(document.body).append(processMenu);
        },
        //获取编辑后的数据
        getValues:function (){  
            return $this.options.dic.Values();  
        },
        updateStatus:function (nodeJson,flowState){
        	$this.options.flowState = flowState;
//        	console.log($this.options.dic.Values());
        	var processId=nodeJson.id;
        		var status=nodeJson.status;
        		var scolor = "";
            //创建新的 数据
        	var durationTemp = nodeJson.duration?nodeJson.duration:0;
			var curDate =   nodeJson.curDate?new Date(Date.parse(nodeJson.curDate.replace(/-/g, "/"))):new Date();
			var tooltip="";
			var fa;//节点图标样式
			var mergeColor;//合并节点右上角颜色
        	var mergeFaColor;//合并节点右上角图标颜色
    		//初始化超时时间
    		nodeJson.overtime = 0;
    		//初始化
    		nodeJson.actualAfterDuration = 0;
//    		if(nodeJson.type == "merge" && nodeJson.id.indexOf("sid-") < 0){//不是以“sid-”开头的节点数据不是流程初始定义的数据，而是在展示配置中添加的新节点,此类节点不纳入流程执行中，所有不需要展示状态和toolTip
//        		status = "";
//        	}
        	if(nodeJson.type != "merge" && nodeJson.id.indexOf("sid-") != 0){//不是以“sid-”开头的节点数据不是流程初始定义的数据，而是在展示配置中添加的新节点,此类节点不纳入流程执行中，所有不需要展示状态和toolTip
        		status = "";
        	}else if(nodeJson.type == "begin"){//标记需要tip提示的div
        		if(nodeJson.beginTime){
            		tooltip = "<ul>" ;
            		tooltip += "<li><span>开始时间：</span>"+(!nodeJson.beginTime?'':nodeJson.beginTime)+"</li>";
            		tooltip += "</ul>";
        		}
        	}else if(nodeJson.type == "end"){
        		if(nodeJson.endTime){
            		tooltip = "<ul>" ;
            		tooltip += "<li><span>结束时间：</span>"+(!nodeJson.beginTime?'':nodeJson.beginTime)+"</li>";
            		tooltip += "</ul>";
        		}
        	}
          	// 演练中新增或合并的节点 合并节点不显示 状态
//        	else if( nodeJson.status ==26 && nodeJson.nodeStepType!='merge' ){
//        		tooltip = "<ul>" ;
//        		tooltip += "<li><span>执行状态：</span>已执行</li>";
//        		tooltip += "</ul>";
//        		scolor = "#CDCDCD";
//        	}
        	else if(nodeJson.nodeStepType=='SubProcess' || nodeJson.nodeStepType=='CallActivity'){
        		tooltip = "<ul>" ;
        		tooltip +="<li><span>预计用时：</span>"+(nodeJson.duration&&nodeJson.duration!='null'?convertDate(nodeJson.duration):convertDate(0))+"</li>";
        		//已经执行完成,节点执行状态（全部完成：1，部分完成：2，跳过：3，正在执行：4，可执行：5,准备执行：6，还未执行：7）
            	if(status == 1 || status == 2 || status == 3 ){
            	  	scolor = "#9DDBFF";
            	  	if(nodeJson.beginTime){
            			//开始执行时间
            			var beginTime = new Date(Date.parse(nodeJson.beginTime.replace(/-/g, "/")));
            			//完成时间
            			var endTime = new Date(Date.parse(nodeJson.endTime.replace(/-/g, "/")));
            			var actualAfterDuration =  (endTime.getTime() -  beginTime.getTime())/1000;
            			if(actualAfterDuration > durationTemp){
            				//超时时间
            				nodeJson.overtime = convertDate(actualAfterDuration - durationTemp);
            			}
            			//流程节点实际用时
            			nodeJson.actualAfterDuration = convertDate(actualAfterDuration);
            			}
            		tooltip += "<li><span>实际用时：</span>"+nodeJson.actualAfterDuration+"</li>";
            		
            		//超时
	            	if(nodeJson.duration!=0 &&nodeJson.overtime != 0  && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined"){
//	            		status = "after_overtime";
	            		tooltip += "<li><span>超时时间：</span>"+nodeJson.overtime+"</li>";
	            	}
	            	tooltip += "<li><span>开始时间：</span>"+(!nodeJson.beginTime?'':nodeJson.beginTime)+"</li>";
	            	tooltip += "<li><span>结束时间：</span>"+nodeJson.endTime+"</li>";
//	            	if(status == 1){
//	            		tooltip += "<li><span>完成状态：</span>全部完成</li>";
//	            	}else if(status == 2 ){
//	            		tooltip += "<li><span>完成状态：</span>部分完成</li>";
//	            	}else{
//	            		tooltip += "<li><span>完成状态：</span>跳过</li>";
//	            	}
            		status = "after";
            	}else if(status == 4){//正在执行中
            		
            		if(nodeJson.beginTime){
            			//开始执行时间
            			var beginTime = new Date(Date.parse(nodeJson.beginTime.replace(/-/g, "/")));
            			//流程节点已经执行时间
            			var actualAfterDuration = (curDate.getTime() -  beginTime.getTime())/1000;
            			if(actualAfterDuration > durationTemp){
            				//超时时间
            				nodeJson.overtime = convertDate(actualAfterDuration - durationTemp);
            			}
            			nodeJson.actualAfterDuration = convertDate((curDate.getTime() -  beginTime.getTime())/1000);
            		}
            		tooltip += "<li><span>已经用时：</span>"+nodeJson.actualAfterDuration+"</li>";
            		//超时
	            	if(nodeJson.duration!=0 &&nodeJson.overtime != 0  && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined"){
	            		tooltip += "<li><span>超时时间：</span>"+nodeJson.overtime+"</li>";
	            	}
	            	tooltip += "<li><span>开始时间：</span>"+(!nodeJson.beginTime?'':nodeJson.beginTime)+"</li>";
	            	scolor = "#FFC48E";
            	}
        		else if(status> 10 &&status< 20){
        			scolor = "#CDCDCD";
            		tooltip += "<li><span>执行状态：</span>已暂停</li>";
        		}
            	else if(status==20 ){
            		scolor = "#FC7474";
            		tooltip += "<li><span>执行状态：</span>接收超时</li>";	//超时
            	}
            	else if( status ==21){
            		scolor = "#FC7474";
            		tooltip += "<li><span>执行状态：</span>执行异常挂起</li>";
            	}
            	else if( status ==25){
            		scolor = "#FC7474";
            		tooltip += "<li><span>执行状态：</span>执行超时</li>";	//超时
            	}
             	else if( status ==23){
            		//status = "#CDCDCD";
            		tooltip += "<li><span>执行状态：</span>跳过</li>";
            		scolor = "#CDCDCD";
            	}
             	else if( status ==24){
            	//	status = "#CDCDCD";
            		tooltip += "<li><span>执行状态：</span>跳过</li>";
            		scolor = "#CDCDCD";
            	}
            	else{//未执行
            		scolor = "#CDCDCD";
            		tooltip += "<li><span>执行状态：</span>未执行</li>";
            	}
            	tooltip += "</ul>";
            	if(nodeJson.type == "merge"){//合并节点不需要显示提示信息
            		tooltip = "";
            	}
            }
        	else {
        		tooltip = "<ul>" ;
        		tooltip += "<li><span>执行人：</span>"+(nodeJson.executePeople?nodeJson.executePeople:"")+"</li>" +
							"<li><span>预计用时：</span>"+(nodeJson.duration&&nodeJson.duration!='null'?convertDate(nodeJson.duration):convertDate(0))+"</li>";
        		//已经执行完成,节点执行状态（全部完成：1，部分完成：2，跳过：3，正在执行：4，可执行：5,准备执行：6，还未执行：7）
            	if(status == 1 || status == 2 || status == 3 ){
            		fa = "fa fa-check-circle sc-adopt";
            		mergeColor = " merge-adopt";
        			mergeFaColor = " merge-fa-other";
            	  	scolor = "#9DDBFF";
            		if(nodeJson.beginTime){
            			
	        			//开始执行时间
	        			var beginTime = new Date(Date.parse(nodeJson.beginTime.replace(/-/g, "/")));
	        			if(nodeJson.endTime){//合并节点后台执行完没有设置结束时间
		        			//完成时间
		        			var endTime = new Date(Date.parse(nodeJson.endTime.replace(/-/g, "/")));
		        			var actualAfterDuration =  (endTime.getTime() -  beginTime.getTime())/1000;
		        			if(actualAfterDuration > durationTemp){
		        				//超时时间
		        				nodeJson.overtime = convertDate(actualAfterDuration - durationTemp);
		        			}
		        			//流程节点实际用时
		        			nodeJson.actualAfterDuration = convertDate(actualAfterDuration);
	        			}
        			}
            		tooltip += "<li><span>实际用时：</span>"+nodeJson.actualAfterDuration+"</li>";
            		
            		//超时
	            	if(nodeJson.duration!=0 &&nodeJson.overtime != 0  && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined"){
//	            		status = "after_overtime";
	            		tooltip += "<li><span>超时时间：</span>"+nodeJson.overtime+"</li>";
	            	}
	            	tooltip += "<li><span>开始时间：</span>"+(!nodeJson.beginTime?'':nodeJson.beginTime)+"</li>";
	            	tooltip += "<li><span>结束时间：</span>"+nodeJson.endTime+"</li>";
	            	if(status == 1){
	            		tooltip += "<li><span>完成状态：</span>全部完成</li>";
	            	}else if(status == 2 ){
	            		tooltip += "<li><span>完成状态：</span>部分完成</li>";
	            	}else{
	            		tooltip += "<li><span>完成状态：</span>跳过</li>";
	            	}
	            	var message = nodeJson.message && nodeJson.message != 'null' ? nodeJson.message : '';
	            	message = message.length > 100 ? message.substr(0, 100) + '...' : ''; //日志过长，只显示一部分
            		tooltip += "<li><span>完成情况：</span>"+ message +"</li>";
            		status = "after";
            	}else if(status == 4 || status == 8){//正在执行中、自动执行中
            		fa = "fa fa-pause-circle sc-incet-node";
            		status = "executing";
            		mergeColor = " merge-incet";
        			mergeFaColor = " merge-fa-incet";
            		if(nodeJson.beginTime){
            			//开始执行时间
            			var beginTime = new Date(Date.parse(nodeJson.beginTime.replace(/-/g, "/")));
            			//流程节点已经执行时间
            			var actualAfterDuration = (curDate.getTime() -  beginTime.getTime())/1000;
            			if(actualAfterDuration > durationTemp){
            				//超时时间
            				nodeJson.overtime = convertDate(actualAfterDuration - durationTemp);
            			}
            			nodeJson.actualAfterDuration = convertDate((curDate.getTime() -  beginTime.getTime())/1000);
            		}
            		tooltip += "<li><span>已经用时：</span>"+nodeJson.actualAfterDuration+"</li>";
            		//超时
	            	if(nodeJson.duration!=0 &&nodeJson.overtime != 0 && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined") {
//	            		fa = "fa fa-times-circle sc-error";
//	            		mergeColor = " merge-error";
//	        			mergeFaColor = " merge-fa-other";
	            		tooltip += "<li><span>超时时间：</span>"+nodeJson.overtime+"</li>";
	            	}
	            	tooltip += "<li><span>开始时间：</span>"+(!nodeJson.beginTime?'':nodeJson.beginTime)+"</li>";
	            	scolor = "#FFC48E";
            	}
        		else if(status> 10 &&status< 20){
        			fa = " fa fa-play-circle sc-unex";
        			mergeColor = " merge-unex";
        			mergeFaColor = " merge-fa-other";
//        			status = "optionstop";
        			scolor = "#CDCDCD";
            		tooltip += "<li><span>执行状态：</span>已暂停</li>";
        		}
            	else if(status==20 ){
            		fa = "fa fa-times-circle sc-error";
            		mergeColor = " merge-error";
        			mergeFaColor = " merge-fa-other";
            		status = "optionexception";
            		scolor = "#FC7474";
            		tooltip += "<li><span>执行状态：</span>接收超时</li>";	//超时
	            	if(nodeJson.duration!=0 && nodeJson.exceptionTimeoutTime != 0  && nodeJson.exceptionTimeoutTime!='' && typeof(nodeJson.exceptionTimeoutTime) != "undefined" ){
	            		tooltip += "<li><span>超时时间：</span>"+ convertDate(nodeJson.exceptionTimeoutTime)+"</li>";
	            	}
            	}
            	else if( status ==21){ //执行异常
            		fa = "fa fa-times-circle sc-error";
            		mergeColor = " merge-error";
        			mergeFaColor = " merge-fa-other";
            		status = "optionexception";
            		scolor = "#FC7474";
            		tooltip += "<li><span>执行状态：</span>执行异常挂起</li>";
            	}
            	else if(status == 10){ //自动化任务执行失败
            		fa = "fa fa-times-circle sc-error";
            		mergeColor = " merge-error";
        			mergeFaColor = " merge-fa-other";
//            		classStr += " optionexception";
            		status = "optionexception";
            		tooltip += "<li><span>执行状态：</span>执行失败</li>";
            	}
            	else if( status ==25){
            		fa = "fa fa-times-circle sc-error";
            		mergeColor = " merge-error";
        			mergeFaColor = " merge-fa-other";
            		status = "optionexception";
            		scolor = "#FC7474";
            		if(nodeJson.beginTime){
            			//开始执行时间
            			var beginTime = new Date(Date.parse(nodeJson.beginTime.replace(/-/g, "/")));
            			//流程节点已经执行时间
            			var actualAfterDuration = (curDate.getTime() -  beginTime.getTime())/1000;
            			if(actualAfterDuration > durationTemp){
            				//超时时间
            				nodeJson.overtime = convertDate(actualAfterDuration - durationTemp);
            			}
            			nodeJson.actualAfterDuration = convertDate((curDate.getTime() -  beginTime.getTime())/1000);
            		}
            		tooltip += "<li><span>已经用时：</span>"+nodeJson.actualAfterDuration+"</li>";
            		tooltip += "<li><span>执行状态：</span>执行超时</li>";	//超时
	            	if(nodeJson.duration!=0 &&nodeJson.overtime != 0   && nodeJson.overtime!='' && typeof(nodeJson.overtime) != "undefined" ){
	            		tooltip += "<li><span>超时时间：</span>"+nodeJson.overtime+"</li>";
	            	}
            	}
             	else if( status ==23){
             		fa = " fa fa-play-circle sc-unex";
             		mergeColor = " merge-unex";
        			mergeFaColor = " merge-fa-other";
//             		status = "nooptionanStart";
            		//status = "before";
            		tooltip += "<li><span>执行状态：</span>跳过</li>";
            		scolor = "#CDCDCD";
            	}
             	else if( status ==24){
             		fa = " fa fa-play-circle sc-unex";
             		mergeColor = " merge-unex";
        			mergeFaColor = " merge-fa-other";
//             		status = "nooptionanStart";
            		//status = "before";
            		tooltip += "<li><span>执行状态：</span>跳过</li>";
            		scolor = "#CDCDCD";
            	}
            	else{//未执行
            		fa = " fa fa-play-circle sc-unex";
            		mergeColor = " merge-unex";
        			mergeFaColor = " merge-fa-other";
            		status = "before";
//            		tooltip += "<li><span>执行状态：</span>未执行</li>";
            		scolor = "#CDCDCD";
            	}
            	tooltip += "</ul>"; 
            	if(nodeJson.type == "merge"){//合并节点
            		tooltip = "<ul>" ;
            		tooltip += "<li id='duration_"+nodeJson.id+"'><span>预计用时：</span>"+(nodeJson.duration&&nodeJson.duration!='null'?convertDate(nodeJson.duration):convertDate(0))+"</li>";
            		tooltip += "<li id='executePeople_"+nodeJson.id+"'><span>负责人：</span>"+(nodeJson.executePeople?nodeJson.executePeople:"")+"</li>" ;
            		tooltip += "</ul>";
            	}
        	}
        	$('#'+nodeJson.id).removeClass("before nooptionanStart optionexception optionstop after executing");
        	$('#'+nodeJson.id).addClass(status);
        	$('#'+nodeJson.id).children(":first").removeAttr("class").addClass(fa);
        	
        	if(nodeJson.pId){
//        		console.log($('#'+nodeJson.id).find(".merge"));
        		$('#'+nodeJson.id).find(".merge").remove();
        		$('#'+nodeJson.id).append("<div class='merge "+mergeColor+"'><i class='fa "+ $this.options.dic.TryGetValue(nodeJson.pId).fa + mergeFaColor +"'></i></div>");
        	}else if(nodeJson.type == "merge"){
        		$('#'+nodeJson.id).find(".merge").remove();
        		$('#'+nodeJson.id).append("<div class='merge "+mergeColor+"'><i class='fa "+ nodeJson.fa +"s "+mergeFaColor+"'></i></div>");
        	}
        	
        	$('#'+processId).find('.tooltip_description').empty();
        	$('#'+processId).find('.tooltip_description').append(tooltip);
//         $('#status'+processId).css('background-color',scolor);
        	$this.refreshConnectionsColor(nodeJson);
        },
        //设置合并节点的负责人和预计用时
        setExecutePeopleAndDuration: function(id,executePeople,executorA,duration) {
//        	console.log(id,executePeople,executorA,duration);
        	var nodeJson = $this.options.dic.TryGetValue(id);
        	nodeJson.executePeople = executePeople;
        	nodeJson.executorA = executorA;
        	nodeJson.duration = duration;
        	$('#'+nodeJson.id).find("#duration_"+nodeJson.id).empty().append("<span>预计用时：</span>"+(nodeJson.duration&&nodeJson.duration!='null'?convertDate(nodeJson.duration):convertDate(0))+"</li>");
        	$('#'+nodeJson.id).find("#executePeople_"+nodeJson.id).empty().append("<span>负责人：</span>"+nodeJson.executePeople+"</li>");
        },
        //添加合并节点数据，因为定时刷新的数据不包含合并节点
        addMergeNodeStatus: function(flowDatas) {
        	var mergeNodes = $this.options.mergeNodes;
//        	console.log(flowDatas,mergeNodes);
        	for(var i = 0 ; i < mergeNodes.length ; i++){
//        		debugger;
        		var mergeNode = mergeNodes[i];
        		var mergeNodeId = mergeNode.id;
        		var mergeNodeStatus = 7;//默认未执行
        		var temp1 = 0;
        		var temp2 = 0;
        		var temp3 = 0;
        		var newNodeIndex = 0;
        		//第一次遍历
        		for(var j = 0 ; j < flowDatas.length ; j++){
        			var flowData = flowDatas[j];
        			//找到对应的节点数据
        			if(flowData.pId == mergeNode.id){
	        			for(var k = 0 ; k < mergeNode.subNode.length ; k++){
							var mergeSubNode = mergeNode.subNode[k];
							//找到缓存合并节点下子节点所对应的数据，更新合并节点子节点数据
							if(mergeSubNode.id == flowData.id){
								mergeNode.subNode.splice(k,1);
								mergeNode.subNode.push(flowData);
							}
						}
        			}
        		}
        		var mergeSubNodes = mergeNode.subNode;
//        		console.log(mergeNode.name,mergeSubNodes);
        		//遍历数据，获取合并节点的子节点进行状态判断
        		for(var j = 0 ; j < mergeSubNodes.length ; j++){
        			var mergeSubNode = mergeSubNodes[j];
        			if(mergeSubNode.pId == mergeNode.id){
        				var status = mergeSubNode.status;
        				//如果是演练展示配置新增节点，忽略，只有子节点全部是新增节点，合并节点才显示绿色
    					if( status ==26 && mergeSubNode.nodeStepType!='merge' ){
//    						console.log(flowData);
    						newNodeIndex++;
    						temp2--;
//    						temp1++;
//    						continue;
    					}
    					//如果子节点全部是跳过，则显示灰色
    					if( status == 23 || status == 24){
//    						console.log(flowData);
    						temp2--;
//    						continue;
    					}
        				
    					if(status == 21 || status == 25 || status == 20 ){
    						mergeNodeStatus = 21;//给合并节点设置一个异常状态
    						temp2++;
    						temp3++;
    						break;
    					}else if(status == 4){
    						mergeNodeStatus = 4;
    					}else if(status == 1 || status == 2 || status == 3 ){
    						//每次都进这个判断，表示合并节点是执行完成
							temp1++;
    					}
    					temp2++;
    					temp3++;
        			}
            	}
//        		console.log(mergeNode.name,mergeNode.status, mergeNodeStatus);
        		if(temp1 > 0 && mergeNodeStatus == 7){
					mergeNodeStatus = 4;
				}
        		if(temp2 == temp1 && temp2 !=0){
					mergeNodeStatus = 1;
				}
        		//全是新增节点，颜色为绿色
				if(newNodeIndex == temp3){
					mergeNodeStatus = 1;
				}
				
        		mergeNode.status = mergeNodeStatus;
        		flowDatas.push(mergeNode);
        	}
        	return flowDatas;
        },
        //设置合并节点状态
        setMergeNodeStatus: function(flowDatas) {
        	
        	for(var i = 0 ; i < flowDatas.length ; i++){
        		var flowData = flowDatas[i];
        		var mergeNodeStatus = 7;//默认未执行
        		//如果是合并节点
        		if(flowData.type == "merge"){
        			if($this.options.flowState <= 2){
        				flowData.status = mergeNodeStatus;
                	}else{
	        			var subNodes = flowData.subNode;
	        			if(subNodes && subNodes.length > 0){
	        				var temp = 0;
	        				var newNodeIndex = 0;
//	        				var temp2 = 0;
	        				var length = subNodes.length;
	        				for(var j = 0 ; j < subNodes.length ; j++){
	        					var subNode = subNodes[j];
	        					var status = subNode.status;
	        					//如果是演练展示配置新增节点，忽略，只有子节点全部是新增节点，合并节点才显示绿色
	        					if( status ==26 && subNode.nodeStepType!='merge' ){
//	        						console.log(flowData);
	        						newNodeIndex++;
	        						length--;
//	        						temp++;
//	        						continue;
	        					}
	        					//如果子节点全部是跳过，则显示灰色
	        					if( status == 23 || status ==24 ){
//	        						console.log(flowData);
	        						length--;
//	        						continue;
	        					}
	        					
	        					
	        					if(status == 21 || status == 25 || status == 20 ){
	        						mergeNodeStatus = 21;//给合并节点设置一个异常状态
	        						break;
	        					}else if(status == 4){
	        						mergeNodeStatus = 4;
	        					}else if(status == 1 || status == 2 || status == 3){
	        						//每次都进这个判断，表示合并节点是执行完成
	    							temp++;
	        					}
	        					
	        				}
//	        				console.log(flowData.name,flowData.status, mergeNodeStatus);
	        				if(temp > 0 && mergeNodeStatus == 7){
	        					mergeNodeStatus = 4;
	        				}
	        				if(length == temp){
	        					mergeNodeStatus = 1;
	        				}
//	        				console.log(flowData.name,temp1,subNodes.length);
	        				//全是新增节点，颜色为绿色
	        				if(newNodeIndex == subNodes.length){
    							mergeNodeStatus = 1;
    						}
//	        				if(temp2 == subNodes.length){
//    							mergeNodeStatus = 1;
//    						}
	        			}
//	        			console.log(flowData.name, mergeNodeStatus);
                		flowData.status = mergeNodeStatus;
                	}
        			
//        			console.log(flowData);
        			$this.options.mergeNodes.push(flowData);
        		}
        	}
        	
        	return flowDatas;
        },
        //根据节点状态刷新链路颜色
        refreshConnectionsColor:function (nodeJson){
        	
//        	if(nodeJson.name == "新建节点1"){
//        		debugger;
//        	}
        	
        	var status = nodeJson.status;
//        	console.log(nodeJson.name,status);
        	if(nodeJson.type == "end" && !nodeJson.endTime){
        		return;
        	}
        	
        	if(nodeJson.type == "merge"){
        		var subNodes = nodeJson.subNode;
//        		console.log(nodeJson.name);
        		for(var i = 0 ; i < subNodes.length ; i++ ){
        			var subNode = subNodes[i];
        			$this.refreshConnectionsColor(subNode);
        		}
//        		return;
        	}
        	if(status == 5 || status == 6 || status == 7 || status == 23 || status == 24 || (status> 10 && status< 20) ){
        		return;
        	}
        	
        	var nodeId = nodeJson.id;//"sid-55c6c0a8-514b-46fd-a8d8-70ec0a60a363";
	    	var connections = $this.options.instance.getAllConnections();
	    	for(var i = 0 ; i < connections.length ; i++ ){
	    		if(connections[i].targetId == nodeId){
	            	var childNodes = connections[i].canvas.childNodes;
	            	if(childNodes){
	            		for(var j = 0 ; j < childNodes.length ; j++ ){
	            			var childNode = childNodes[j];
//	            			console.log(childNode);
	            			if(j == 0){
//	            				childNode.setAttribute("stroke", "transparent");
//	            				childNode.setAttribute("stroke-width", 1);
	            			}else if(j == 1){
	            				childNode.setAttribute("stroke", "#179335");
	            				childNode.setAttribute("stroke-width", 1);
	            			}else if(j == 2){
	            				childNode.attributes.stroke.value="#179335"
	            				childNode.attributes.fill.value="#179335"
	            			}
	            		}
	            	}
	    		}
	        	
	    	}
    	},
        fullscreen:function (minWidth,minHeight){
        	//$this.initScrollHeight("680px");
            //$this.options.scrollHeight="680px";
        	$this.options.minHeight=minHeight;
            $this.laout();
        }
    };
    //在插件中使用EscFlowChart对象
    $.fn.escFlowChart = function(options) {
        //创建Beautifier的实体
        var flowChart = new EscFlowChart(this, options);
        flowChart.appendMenu();
        //调用其方法
        flowChart.init();
        return flowChart;
    };

    
    
})();



function flow_create_topDiv(){
	$('.loadinStart').show();
var str='<div class="topDiv" style="    position: fixed;  top: 0;  left: 0;right: 0;  bottom: 0;  width: 100%;'+
	   ' height: 100%;'+
	   ' background: rgb(227, 230, 235);    z-index: 9999990;'+
	 '   opacity: 0.3;    background-color: #000; ">'+
	'</div>';
var p=	 '<div class="topp importLoading" style=" display: block;width:250px">'+
//这里不能用 公用path 没办法
'<img src="/bcm/resources/images/main/spinner.gif" />数据加载中……'+
'</div>';
	$("body").append(str); 
	$("body").append(p);
}



/**
 *  confirm
 * @param title
 * @param content
 * @param alertF
 */
function flow_alertTipDiv(content,okfunction){
	var $addBody = null;
	$addBody = $(document.body)
	var $targetDom = $("<div class='conformTipDiv' id='conformTipDiv'>" +
			"<div class='panel-title'>系统提示 <a href='javascript:;' class='tool-close' id='toolClose'></a></div>" +
			"<div class='panel-body'>" +
				"<div class='windowTip'>" +
					"<div class='messageTip'><i class='messager-errortip'></i><span class='iConted'>" + content + "</span></div>" +
					"<div class='footer-colse'>" +
						"<input id='messageTipOk' type='button' value='确定' class='btnSave'>" +
					"</div>" +
				"</div>" +
			"</div>" +
		"</div>");
	
	$addBody.append($targetDom);
	var $shadowDom = addShadow($addBody);
	
	$addBody.find("#messageTipOk").click(function(){
		okfunction();
		closeMessageConformTip($targetDom,$shadowDom);
	});
	$addBody.find("#messageTipCancel").click(function() {
		closeMessageConformTip($targetDom,$shadowDom);
	});
	$addBody.find("#toolClose").click(function() {
		closeMessageConformTip($targetDom,$shadowDom);
	});
}

function closeMessageConformTip($targetDom, $shadowDom) {
	$targetDom.remove();
	$shadowDom.remove();
}

function addShadow($addBody) {
	var $shadowDom = $("<div class='messageShadowDiv'></div>");
	$addBody.append($shadowDom);
	return $shadowDom;
}

function flow_remove_topDiv(){
	$('.topDiv').remove();
	 
	$('.topp').remove();
	
}