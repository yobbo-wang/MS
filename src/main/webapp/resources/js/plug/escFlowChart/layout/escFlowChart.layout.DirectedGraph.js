if (typeof exports === 'object') {
    var dagre = require('dagre');
}

layoutDirectedGraph = {
	//换算每个节点的坐标
    layout: function(dic, scrollHeight, opt) {
        opt = opt || {};
        var nodes = dic.Values();
        var dagreGraph = new dagre.Digraph();
        for(var i = 0 ; i < nodes.length ; i++){
        	
        	if(nodes[i].type == "merge" && nodes[i].isShow  == 0){
        		var subNode = nodes[i].subNode;
        		for(var j = 0 ; j < subNode.length ; j++){
        			var p = layoutDirectedGraph.textSize(subNode[j].name);
        			dagreGraph.addNode(subNode[j].id, {
    	                width: 15*2+p.w,
    	                height: 15*2+p.h
    	            });
        		}
        	}else{
        		var p = layoutDirectedGraph.textSize(nodes[i].name);
	        	dagreGraph.addNode(nodes[i].id, {
	        		width: 15*2+p.w ,
	                height: 15*2+p.h 
	            });
        	}
        }
        
        for(var i = 0 ; i < nodes.length ; i++){
        	//合并节点显示子节点
        	if(nodes[i].type == "merge" && nodes[i].isShow  == 0){
        		var subNode = nodes[i].subNode;
        		for(var j = 0 ; j < subNode.length ; j++){
        			var process = subNode[j].process;
    	        	var sourceId = subNode[j].id;
    	        	var targetId ;
    	        	for(var k = 0 ; k < process.length ; k++){
    	        		targetId = process[k].id;
    	        		if(dagreGraph.hasNode(targetId)){
    	        			dagreGraph.addEdge(sourceId+"-"+targetId, sourceId, targetId, { minLen: 1 } );
    	        		}
    	        	}
        		}
        	}else{
	        	var process = nodes[i].process;
	        	var sourceId = nodes[i].id;
	        	var targetId ;
	        	for(var j = 0 ; j < process.length ; j++){
	        		targetId = process[j].id;
	        		if(dagreGraph.hasNode(targetId)){
	        			dagreGraph.addEdge(sourceId+"-"+targetId, sourceId, targetId, { minLen: 1 } );
	        		}
	        	}
        	}
        }
        
        var runner = dagre.layout();
        if (opt.debugLevel) { runner.debugLevel(opt.debugLevel); }
        if (opt.rankDir) { runner.rankDir(opt.rankDir); }
        if (opt.rankSep) {runner.rankSep(opt.rankSep); }
        if (opt.edgeSep) { runner.edgeSep(opt.edgeSep); }
        if (opt.nodeSep) { runner.nodeSep(opt.nodeSep); }
        var layoutGraph = runner.run(dagreGraph);
        //视图中间坐标位置与节点初始化出来的位置的高度差
        var heightDiff = 0;
        if(scrollHeight > layoutGraph.graph().height){
        	heightDiff = (scrollHeight - layoutGraph.graph().height)/2 ;
        }
        layoutGraph.eachNode(function(u, value) {
            if (value.dummy) return;
            var node = dic.TryGetValue(u);
            if(!node){
            	var temp = false;
            	for(var i = 0 ; i < nodes.length ; i++){
            		var subNode = nodes[i].subNode;
            		if(subNode){
	            		for(var j = 0 ; j < subNode.length ; j++){
	            			if(subNode[j].id == u){
	            				node = subNode[j];
	            				temp = true;
	            				break;
	            			}
	            		}
            		}
            		if(temp){
            			break;
            		}
            	}
            }
            
            node.style = "left: "+(value.x - value.width / 2 + 50)+"px;top: "+(value.y - value.height / 2 + heightDiff)+"px;";

        });
        return { width: layoutGraph.graph().width + 150, height: layoutGraph.graph().height + 20 };
    },
    //计算字符串所占屏幕的宽度和高度
    textSize:function(text) {
        var span = document.createElement("span");
        var result = {};
        result.w = span.offsetWidth;
        result.h = span.offsetWidth; 
        span.style.visibility = "hidden";
        document.body.appendChild(span);
        if (typeof span.textContent != "undefined")
            span.textContent = text;
        else span.innerText = text;
        result.w = span.offsetWidth - result.w;
        result.h = span.offsetHeight - result.h;
        span.parentNode.removeChild(span);
        return result;
    }
};
