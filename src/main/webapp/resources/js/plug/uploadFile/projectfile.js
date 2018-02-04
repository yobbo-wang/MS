
(function($) {
   
	var methods = {
			op : '',
			fileCount:0,
			fileInputId:'',
			fileIdArray:new Array(),
			fileNameArray:new Array(),
		init : function(options) {
	       return this.each(function () {
				var $this = $(this);
				//制定默认值
				var defaultattr = {
					// Required Settings
					id : $this.attr('id'), // The ID of the DOM object
					text:'添加附件',
					uploadLimit:6,
					onlySelect:false,
					 press:'',//文件夹
					fileSizeLimit:'200M',//单个文件 最大容量
					 projectId:''//关联Id
				};
				
				var setting = $.extend(defaultattr, options);
				//alert('#'+setting.id);
				
				methods.op = setting;
				//添加file的按钮
				var $projectAddFile=$('<div class="project_addfile_btn " ><i class="splashy-paper_clip"></i>'+methods.op.text+'</div>');
				var $projectFiles=$('<div class="project_files_div" ></div>');
				methods.fileInputId=methods.op.id+"_fileIds";
				var $fileIds=$("<input type='hidden' id='"+methods.fileInputId+"' name='fileIds' >");
				
				//是否只允许查看 和下载附件
				if(!methods.op.onlySelect){
					$projectAddFile.bind('click',function(){
						//判断 是否允许添加附件
						var count = setting.uploadLimit-methods.fileCount;
						if(	count==0){
							alertTip('最多上传'+setting.uploadLimit+'个文件');
							return;
						}
						methods.openFileCheck();
					});
				}
				
				$projectFiles.append($fileIds);
				$this.append($projectAddFile);
				$this.append($projectFiles);
				//初始化加载
				methods.getProjectFileById();
			});
		
		},
		//根据文件Id 删除服务器中的文件
		deleteProjectFile:function(obj){
			var  fileId=$(obj).attr('fileId');	
			var pprojectId=$(obj).attr('projectId');	
//			//如果改文件以及与 项目绑定
//			if(!methods.op.projectId){
//				methods.fileCount--;//当前文件个数减少
//				$('.file_info_box[fileId='+fileId+'] ').remove();	
//				return;
//			}
			$.post(path+'/file/deletefp',{'fileId':fileId,'porjectId':pprojectId},function(json){
				if(json){
					var j=eval('('+json+')');
					if(j.success){
						methods.fileCount--;//当前文件个数减少
						$('.file_info_box[fileId='+fileId+'] ').remove();	
						//更新数组元素
						$.each(methods.fileIdArray, function(idx, o) {
							if(o==fileId){
								methods.fileIdArray.splice(idx,1);
								methods.fileNameArray.splice(idx,1);
								}
							});
						methods.setFileIds();
					}
				}
			});
		},
		setFileIds:function(){
			var ids=methods.fileIdArray.join(',');
			$('#'+methods.fileInputId).val(ids);
		},

		
		getProjectFileById:function(){
			var pId=methods.op.projectId;
			if(!pId){
				return ;
			}
			var s= $('#'+methods.op.id).find('.project_files_div');
			if(!s){
				return ;
			}
			//ajax 访问后台
			$.post(path+'/file/getfileproject',{'projectId':methods.op.projectId,'press':methods.op.press},function(json){
				if(json){
					var j=eval('('+json+')');
					if(methods.op.onlySelect){
						//仅仅查看 下载
						methods.selectProjectFileById(j);
					}else{
						//可以 删除 下载
						methods.createFileDiv( j);
					}
				}
			});
		},
		
		//根据文件Id 打开或下载文件
		openProjectFile:function(obj){
			//var projectId=$(obj).attr('projectId');
			var  fileId=$(obj).attr('fileId');
			//下载
			location =path+'/file/openfp?fileId=' + fileId;
		},
		
		selectProjectFileById:function(fileInfo){
			var s= $('#'+methods.op.id).find('.project_files_div');
			if(!s||s.length<1){
				return ;
			}
			var $f=$(s[0]);
			$.each(fileInfo, function(idx, obj) {
				var projectId=obj.project?obj.projectId:'';
				var fileId=obj.fileId?obj.fileId:'';
				methods.fileIdArray.push(fileId);
				methods.fileNameArray.push(obj.fileName);
				var $d=$('<div class="file_info_box "	 fileId="'+fileId+'"></div>');
				var $del=$('<a href="#" projectId="'+projectId+'" fileId="'+fileId+'" ><i  class="splashy-document_a4_marked"></i></a>');
				var $span=$('<a href="#" fileId="'+fileId+'" ><span>'+obj.fileName+'('+obj.size+')</span></a>');
			
				//打开附件
				$span.bind('click',function(){
					methods.openProjectFile(this);
				});
				$d.append($del);
				$d.append($span);
				$f.append($d);
			});
			
			methods.setFileIds();
		},
		createFileDiv:function(fileInfo){
			//设置当前文件个数
			methods.fileCount+=fileInfo?fileInfo.length:0;
			//alert('#'+methods.op.id);
			var s= $('#'+methods.op.id).find('.project_files_div');
			if(!s||s.length<1){
				return ;
			}
			var $f=$(s[0]);
			$.each(fileInfo, function(idx, obj) {
				var projectId=obj.project?obj.projectId:'';
				var fileId=obj.fileId?obj.fileId:'';
				methods.fileIdArray.push(fileId);
				methods.fileNameArray.push(obj.fileName);
				var $d=$('<div class="file_info_box "	 fileId="'+fileId+'"></div>');
				var $del=$('<a href="#" projectId="'+projectId+'" fileId="'+fileId+'" ><i  class="splashy-document_a4_remove"></i></a>');
				var $span=$('<a href="#" fileId="'+fileId+'" ><span>'+obj.fileName+'('+obj.size+')</span></a>');
				//删除附件
				$del.bind('click',function(){
					methods.deleteProjectFile(this);
				});
				//打开附件
				$span.bind('click',function(){
					methods.openProjectFile(this);
				});
				$d.append($del);
				$d.append($span);
				$f.append($d);
			});
			
			methods.setFileIds();
		},
	
		//打开 文件选择弹出框
		openFileCheck:function(){
		
			//设置可以上传的文件个数
			var param= {
					uploadLimit:methods.op.uploadLimit-methods.fileCount,
					fileTypeExts:methods.op.fileTypeExts,//允许格式
					fileSizeLimit:methods.op.fileSizeLimit,
					notAllowed:methods.fileNameArray,
					press:methods.op.press
			}
	
			//设置回调函数
			param['after']=function(filesInfo){
				 methods.afterFile(filesInfo);
			 };
			 methods.upload(param);
		},
		
		afterFile:function(filesInfo){
			methods.createFileDiv(filesInfo);
		},
		
		//附件选择 弹出框
		 upload:function(data){
			var param=data!=null?data:null;
			var url=path+"/common/common_uploadify.jsp?random="+Math.random();
			var data=param;
			data['onClosed']=function(){$.post(path+'/file/queueFile',null,function(){})};
			createwindowForData('附件选择', url,data,600,250) ;
//			$.lgdialog({
//				content: 'url:'+path+"/common/common_uploadify.jsp?random="+Math.random() ,
//				lock : true,
//				width:600,
//				height:250,
//				data:param,
//				title:"附件选择",
//				parent: p,//获取当前窗口对象，设置子窗口的perent属性，可以让遮罩层效果持续，层次不会发生错乱，zIndex属性来控制层次
//				zIndex: 1976,
//				opacity : 0.3,
//				min : false,
//				cache:false,
//				closed:function(){
//					//ajax 访问后台关闭的时候清空队列
//					$.post(path+'/file/queueFile',null,function(){});
//				}
//			});
		}
};
	

	$.fn.escprojectfile = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(	arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method' + method + 'does not exist on jQuery.tooltip');
		}
	};
	

})(jQuery);