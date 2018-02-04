/*
 * 插件对象化
 * 包括：①主体
 * 				②file队列
 * 		
 * 
 * */
(function($) {

	var methods = {
		op : '',
		//默认路径一般不允许修改
		resolveUrl : 'file/uploadFile',//文件表单提交位置
		fileCount : 0,//记录添加文件时的顺序 
		uploadFile : new Array(),//记录上传文件下标及进度
		uploadCount : 0,//已上传个数
		t : null,//取消时间循环
		init : function(options) {
			return this.each(function() {
				var $this = $(this);
				//制定默认值
				var defaultattr = {
					// Required Settings
					id : $this.attr('id'), // The ID of the DOM object
					url:'file/uploadFile',//后台解析文件的方法，用于返回文件的类型，大小等类型
					buttonText : '上传文件', // 按钮文字
					fileSizeLimit : '200MB', //上传文件的最大大小（KB MB GB单位接受B如果字符串，0为不限制）
					maxFileSize : '200MB', //上传文件的最大大小（KB MB GB单位接受B如果字符串，0为不限制）
					 press:'',//文件夹
					//fileTypeDesc : 'All Files', /// /允许的扩展在浏览对话框（服务器端验证也应该用）
				//	fileTypeExts : '*.*', // Allowed extensions in the browse dialog (server-side validation should also be used)
					notFileType:'*.sql,*.java,*.bpm,*.dll,*.exe',
					multi : true, // 真的，允许多个文件选择在浏览对话框
					notAllowed : [], // 限制哪些文件名称不允许上传
					queueID : false, //队列显示位置
					uploadLimit : 6, // 你可以上传的最大文件数 3个
					onUploadAfter:function(){},
					onSelectFile:function(){}
				};
				var setting = $.extend(defaultattr, options);
				methods.op = setting;
			
				methods.resolveUrl=setting.url;
				if(setting.press&& setting.press!=''){
					 methods.resolveUrl+="?press="+setting.press;
				}
				//添加file的按钮
				var $add_btn_div = $('<a href="#"  id="file_btn" 	class="btnSave" 	role="button"	>'+methods.op.buttonText+'</a> ');
				$this.wrap($add_btn_div);
				$this.bind('change', function() {
					//添加一个 上传的文件
					methods.addFiles();
				});
				//ajax 初始化时清空队列
				$.post(path+'/file/queueFile',null,function(){});
			});
		},

		//添加file的按钮
		addFiles : function() {
			methods.onSelectFile();
			//原始文本域
			var $f = $("#" + methods.op.id);
			//克隆原始文本域
			var $clone = $f.clone();
			//验证文件类型 及上传的个数 此时的this 表示dome选中的元素
			if (!methods.validateUpload($f)) {
				return;
			}
			methods.fileCount++;

			var formId = "fileform_" + methods.op.id + "_" + methods.fileCount;
			var iframeId = "fileiframe_" + methods.op.id + "_"+ methods.fileCount;
			var file_div_IdName = "file_div_" + methods.op.id + "_"+ methods.fileCount;
			var file_info_div_IdName = "file_info_div" + methods.op.id + "_"+ methods.fileCount;
			var file_state_div_IdName = "file_state_div_" + methods.op.id + "_"+ methods.fileCount;
			var upload_close_btn__IdName = "upload_close_btn_" + methods.op.id+ "_" + methods.fileCount;
			var file_progess_div = "file_progess_div_" + methods.op.id + "_"+ methods.fileCount;
			var file_progess_bfb = "file_progess_bfb_" + methods.op.id + "_"+ methods.fileCount;
			
			//文件队列
			var $file_div_box = $(methods.op.queueID);
		
			//一个文件
			var $file_div = $('<div id="' + file_div_IdName+ '"  class="file_div"></div>');
			//文件信息
			var $fileInfoDiv = $('<div class="file_info_div"></div>');
			var v = $f.val();
			var fileName = v.substring(v.lastIndexOf('\\') + 1);
			//文本基本信息
			var $fileInfo = $('<div id="' + file_info_div_IdName+ '" class="file_info">' + fileName + '</div>');
			//状态
			var $fileState = $('<div id="' + file_state_div_IdName+ '"  class="file_state_div">待上传</div>');
			//文件操作
			var $fileOption = $("<a id='" + upload_close_btn__IdName+ "'  class='upload_close_btn'  filediv_id='"+ file_div_IdName + "'  href='#'>取消</a>");
			//用于提交的表单
			var $uploadfrom = $('<form id="'+ formId+ '" class="file_from"  method="post" enctype="multipart/form-data"  target="'+ iframeId + '"><form>');
			//用于form 提交的iframe 
			var $uploadIframe = $('<iframe src="" style="display:none"  scrolling="no" class="fileIframe"    name="'+ iframeId + '"></iframe>');
			//文件上传进度条
			var $fileProgess = $('<div class="votebox"  ><dl class="barbox"><dt class="barline" ><div id="'+ file_progess_div+ '"  style="width:0px;"  class="file_progess_div"></div><span id="'+ file_progess_bfb+ '"  class="lodingBar">0%</span></dt></dl></div>');

			//点击单文件取消
			$fileOption.bind('click', function() {
				methods.fileCount--;
				methods.removeUpload(this);
			});
			//文件选择之后 递归
			$clone.bind('change', function() {
				methods.addFiles();
			});

			$('#file_btn').append($clone);
			$f.removeAttr('id');
			$f.removeAttr('class');
			$f.attr('name', 'fileName');
			$f.attr('index', methods.fileCount);
			$uploadfrom.attr('action',  methods.resolveUrl);
			//组装
			$fileInfoDiv.append($fileInfo);
			$fileInfoDiv.append($fileState);
			$fileInfoDiv.append($fileOption);
			$uploadfrom.append($f);
			$file_div.append($fileInfoDiv);
			$file_div.append($fileProgess);
			$file_div.append($uploadfrom);
			$file_div.append($uploadIframe);
			$file_div_box.append($file_div);
			$f.hide();

			//上传文件数组添加一个 上传文件 state 状态：0：未上传 1：正在上传 2：完成
			methods.uploadFile.push({
				fileId : file_div_IdName,
				fileName:fileName,
				originalFileName:fileName,
				formId : formId,
				index : methods.fileCount,
				state : 0,
				id:'',
				//fileName:'',
				size:''
			});

			methods.submitUpload();
		},

		//文件验证 类型,个数,及是否重复上传
		validateUpload : function(obj) {
			var v = obj.val();
			if(!v) {
				return false;
			}
			var fileType = v.substring(v.lastIndexOf('.') + 1);
			var limitFileType = methods.op.limitFileType;
			if (limitFileType&&limitFileType.indexOf(fileType) < 0) {
				alertTip('只能上传' + limitFileType+ ' 格式的文件');
				return false;
			}
			var notFileType = methods.op.notFileType;
			if (notFileType.indexOf(fileType) > 0) {
				alertTip('不能上传' + notFileType+ ' 格式的文件');
				return false;
			}
			if (methods.uploadFile.length + 1 > methods.op.uploadLimit) {
				alertTip('最多上传' + methods.op.uploadLimit + ' 个文件');
				return false;
			}
			var flog=true;
			$.each(methods.uploadFile, function(idx, o) {
					if(v.indexOf(o.fileName)!=-1){
						alertTip("文件："+o.fileName+"已添加至队列");
						flog= false;
						return;
					}
				});
			
			$.each(methods.op.notAllowed,function(i,n){
				if(v.indexOf(n)!=-1){
					alertTip("文件："+n+"已上传，不允许再次添加");
					flog= false;
					return;
				}
			});
			if(flog){
				return true;
			}else{
				return false;
			}
			//return true;
		},

		//文件验证大小
		validateFileSize : function(size) {
	
			var fs = methods.op.fileSizeLimit;
			var max=methods.op.maxFileSize;
			max = parseInt(max) * 1024;
			//如果 fs==0 不限制大小
			if (fs == 0 || fs == '0') {
				return true;
			}
			//转换kb进行比较
			if (fs.indexOf('M') > -1) {
				fs = parseInt(fs * 1024);
			}
			if (size.indexOf('M') > -1) {
				size = parseInt(size) * 1024;
			}
			if(parseInt(max)< parseInt(size)){
				alertTip('上传文件不能大于' + methods.op.fileSizeLimit);
				return false;
			}
			if (parseInt(fs) < parseInt(size)) {
				alertTip('上传文件不能大于' + methods.op.maxFileSize);
				return false;
			}
			return true;
		},

		//取消上传
		removeUpload : function(obj) {
		
			methods.onSelectFile();
			var filediv = $(obj).attr('filediv_id');
			var file = $('#' + filediv);
			var iframes = $('#' + filediv + " iframe");
		
			var now = methods.uploadFile[methods.uploadCount];
			//取消当前上传的文件
			if (now&&now.fileId == filediv) {
				clearInterval(methods.t);
				methods.uploadFile.splice(methods.uploadCount, 1);
				//取消当前进度循环
				$.ajax({
					url : path + "/file/clearFile",
					data:{fileName:now.fileName},
					type : 'post',
					dataType : 'json',
					async : false,
					success : function(data) {
						
					}
				});

			} else {
				for ( var i = 0; i < methods.uploadFile.length; i++) {
					if (methods.uploadFile[i].fileId == filediv) {
						//如果被删除的文件 已经上传成功 methods.uploadCount(上传文件下标减一)
						if(methods.uploadFile[i].state==2){
							//删除后台的文件  lba 20151012 上传成功后的fileName会加时间戳，所以新加一个属性originalFileName
							$.ajax({
								url : path + "/file/clearFile",
								data:{fileName:methods.uploadFile[i].originalFileName},
								type : 'post',
								dataType : 'json',
								async : false,
								success : function(data) {
									
								}
							});

							methods.uploadCount--;
						}
						methods.uploadFile.splice(i, 1);
						
						break;
					}
				}
			}
	

			iframes[0].contentWindow.document.write('');
			iframes[0].contentWindow.close();
			iframes.remove();
			file.empty();
			file.remove();
			//提交下一个文件
			methods.submitUpload();
			//切断后台联系
		},
		//确定上传 上传过程中不允许再次添加新的 文本域
		submitUpload : function() {
			//根据当前 上传文件数据的下标获取 当前上传文件信息
			//alert("当前下标："+methods.uploadCount+"上传"+methods.uploadFile[methods.uploadCount].fileId+"文件总数"+methods.uploadFile.length);
			var f = methods.uploadFile[methods.uploadCount];
			//如果 当前文件没有上传结束 这终止向下执行 
			if (!f || f.state != 0) {
				return;
			}

			var l = 3;
			methods.t = setInterval(
					function() {
						var f = methods.uploadFile[methods.uploadCount];
						if (!f|| methods.uploadCount >= methods.uploadFile.length) {
							clearInterval(methods.t);
							return;
						}
						if (f.state == 0) {
							var form = $('#' + f.formId);
							//提交 本次进行上传的表单
							form.submit();
							f.state = 1;
						}
						var index = f.index;//页面文件元素的编号
						var d = new Date();

						$.ajax({
									url : path + "/file/progress?random="	+ d.toString(),
									type : 'post',
									dataType : 'json',
									//避免同时上传
									async : false,
									error :function(XMLHttpRequest, textStatus, errorThrown) {
									
										//连接发生错误---------------------------------------------
										var $file_info_div = $("#upload_close_btn_" + methods.op.id+ "_" + index);
										//var d={$(obj).attr('filediv_id');}
										methods.removeUpload($file_info_div);
									},
									success : function(json) {	
										var $file_info_div = $("#file_info_div"+ methods.op.id + "_" + index);
										var $file_state_div = $("#file_state_div_"+ methods.op.id + "_" + index);
										var $upload_close_btn = $("#upload_close_btn_"+ methods.op.id + "_" + index);

										if(json.obj){
											var r = json.obj.writeLength;
											var c = json.obj.contentLength;
											var s = json.obj.nowFileSize;
											var n = json.obj.nowFileName;
										
											//验证上传文件大小
											if (!methods.validateFileSize(s)) {
												$upload_close_btn.click();
												return;
											}
										//var $upload_close_btn=$("#upload_close_btn_"+methods.op.id+"_"+index);
											$file_info_div.html($file_info_div.html()+ "(" + s + ")");
										
										}
										$file_state_div.html("上传中");
										//$upload_close_btn.hide();
										//默认加载到 3%的位置 确保上传等待时间类动画效果不停止
										var bl=(r / c) * 100;
										if(bl>l){
											l=bl;
										}
										function animate() {
											$("#file_progess_div_"+ methods.op.id+ "_" + index).each(
												function(i, item) {
													$('#file_progess_bfb_'	+ methods.op.id+ "_"+ index).html(l+ "%");
													$(item).animate({width : l+ "%"},100);
												});
										}
										animate();
										if (json.success) {
											//当前文件上传完成 修改页面显示
											$file_state_div.html("已上传");
											//重置进度比例
											l = 3;
											methods.uploadFile[methods.uploadCount].end = true;
											methods.uploadFile[methods.uploadCount].id="";
											methods.uploadFile[methods.uploadCount].fileName=n;
											methods.uploadFile[methods.uploadCount].size=s;
											methods.uploadFile[methods.uploadCount].state = 2;

											//下标移至下一个未上传文件
											if (methods.uploadCount + 1 <= methods.uploadFile.length) {
												methods.uploadCount++;
											}
										}
									}
								});
						//判断是否上传结束
						if(methods.isend()) {
							methods.onUploadAfter();
						}
					}, 1000);
		},
		//判断是否全部上传完成
		isend:function(){
			var flog=true;
			$.each(methods.uploadFile,function(i,obj){
				if(obj.state!=2){
					flog=false;
					return;
				}
			});
			return flog;
		},
		//获取所有上传的 文件包括 文件id name size
		getUploadFileInfo:function(){
			var files=[];
			$.each(methods.uploadFile,function(i,obj){
				files.push({'fileId':obj.id,'fileName':obj.fileName,'size':obj.size});
			});
			return files;
		},
		//获取所有上传的 文件包括 文件id name size
		getUploadFileCount:function(){
			
			return methods.fileCount;
		},
		onUploadAfter:function(){
			methods.op.onUploadAfter();
		},
		onSelectFile:function(){
			methods.op.onSelectFile();
		}
	};

	$.fn.escupload = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(	arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method' + method + 'does not exist on jQuery.tooltip');
		}
	};

})(jQuery);