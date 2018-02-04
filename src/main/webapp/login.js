/**
 * 用于首页 登录页面
 * 完成功能：
 * 1.样式控制：登录部分居中放置，且不变形。
 * 2.使用 jquery click 插件 记录登录的用户名和密码。
 * 3.云朵漂浮
 * 4.登录验证 不通过采样登录框摇头效果
 * 
 * */
//初始化

var errorLoginCount=1;
$(function(){
	//1.样式控制：登录部分居中放置，且不变形。
    //$('.loginbox').css({'position':'absolute','left':($(window).width()-600)/2});
    //$('.loginbox').css({'position':'absolute','top':($(window).height()-312)/2});
	// $(window).resize(function(){  
 //   		$('.loginbox').css({'position':'absolute','left':($(window).width()-500)/2});
 //   		$('.loginbox').css({'position':'absolute','top':($(window).height()-312)/2});
 //    }) 
 
    //绑定回车键登录
    $("#login_form").bind('keydown',function(e){
		if(e.keyCode==13){ 
			//login();
			$('#loginBtn').click();
		}
	});
	
	//用户焦点
	$("#loginName").focus();

	refreshvc();
}); 


/**
 * 以下是云朵飘js
 * */
var $main = $cloud = mainwidth = null;
var offset1 = 0;
var offset2 = 850;
var offsetbg = 1;
$(document).ready(function(){
    $main = $("#yun");
	$body = $("body");
    $cloud1 = $("#cloud1");
	$cloud2 = $("#cloud2");
    mainwidth = $main.outerWidth();
});
/**
 *  云朵随时间 飘动
 * */
setInterval(function flutter() {
    if (offset1 >= mainwidth) {
        offset1 =  -580;
    }
    if (offset2 >= mainwidth) {
		 offset2 =  -580;
    }
    offset1 += 1.1;
	offset2 += 1;
    $cloud1.css("background-position", offset1 + "px 10px")
	$cloud2.css("background-position", offset2 + "px 460px")
}, 70);
setInterval(function bg() {
    if (offsetbg >= mainwidth) {
        offsetbg =  -580;
    }
    offsetbg += 0.9;
    $body.css("background-position", -offsetbg + "px 0")
}, 90 );


/**
 * 登录 
 * */
function login(){
	var  loginName= $('#loginName').val();
	var password = $('#password').val();
	var vCode = $('#verificationcodereg').val();
	password=hex_md5(password);
	var ln=hex_md5(loginName);
	var ciphertext = strEnc (loginName+"@"+password+"@"+vCode,ln);  
	if(loginName==null||loginName==""){
		//alert("请输入用户名！");
		shake();
		$("#loginName").focus();
		return ;
	}
	if(password==null||password==""){
		//alert("请输入密码！");
		shake();
		$("#password").select();
		$('#password').focus();
		return ;
	}
	if(errorLoginCount>2&&(vCode==null||vCode=='')){
		//alert("请输入密码！");
		shake();
		$("#verificationcodereg").select();
		$('#verificationcodereg').focus();
		return ;
	}
	var url='LoginController/login';
	var d={logInfo:ciphertext,loginName:ln};
	disableButton("loginBtn");
	$.post(url,d,function(data){
		var json=eval('('+data+')');
		if(json.success){
			if(json.obj){
				enableButton("loginBtn");
				var jsonobj=json.obj;
				if(jsonobj.length==1){
					toMain(jsonobj[0]);
				}else{
					checkRoleDialog(jsonobj);
				}
			}else{
				shake();
				alertTipFn("该用户没有登录权限",function(){
					enableButton("loginBtn");
				});
			}
		}else if(json.obj == 1){
			shake();
			alertTipFn(json.message,function(){
				$("#loginName").select();
				$("#loginName").focus();
				enableButton("loginBtn");
				errorLoginCount++;
				refreshvc();
			});
			return;
		}else if(json.obj == 2){
			shake();
			alertTipFn(json.message,function(){
				$("#password").select();
				$('#password').focus();
				enableButton("loginBtn");
				errorLoginCount++;
				refreshvc();
			});
			return;
		}else if(json.obj == 3){
			shake();
			alertTipFn("请输入正确的验证码！",function(){
				$("#verificationcodereg").select();
				$('#verificationcodereg').focus();
				enableButton("loginBtn");
				errorLoginCount++;
				refreshvc();
			});
			return;
		}
		else{
			alertTip("系统异常，请联系管理员!");
		}
		
	});

}

function toMain(role){
	var url=path+'/LoginController/loginRole';
	var data={roleId:role.roleId};
	$.post(url,data,function(json){
		var j=eval('('+json+')');
		if(j.success){
			// 代理角色登入操作
//			if("R008" == role.roleCode) {
//				checkAgentDialog();
//			} else {
				window.location.href = 'LoginController/tomain';
//			}
		}else{
			alertTip(j.message);
		}
	});
}
function checkRoleDialog(data){
	var url=path+'/LoginController/getNowRoles';
	$.post(url,{},function(data){
		var json=eval('('+data+')');
		if(!json ||json.length<=1){
			 alertTip("无角色进行切换！");
			 return;
		} else {
			var url2=path+"/checkRole.jsp";
			var data=json;
			createwindowForData('角色选择', url2,data,300,200) ;
		}
	});
}
function checkAgentDialog(){
	var url=path+'/agentUser/showUserList';
	$.post(url,{},function(data){
		var json=eval('('+data+')');
		if(!json ||json.length<1){
			alertTip("无用户可以进行代理！");
			return;
		}
		var url2=path+"/checkAgent.jsp";
		var data=json;
		createwindowForData('用户选择', url2,data,300,200) ;
	});
}
// 代理用户登录
function loginAgent(userId) {
	var url='LoginController/agentLogin';
	var d={userId:userId};
	$.post(url,d,function(data){
		var json=eval('('+data+')');
		if(json.success){
			if(json.obj){
				enableButton("loginBtn");
				var jsonobj=json.obj;
				if(jsonobj.length==1){
					toMain(jsonobj[0]);
				}else{
					checkRoleDialog(jsonobj);
				}
			}else{
				shake();
				alertTipFn("该用户没有登录权限",function(){
					enableButton("loginBtn");
				});
			}
		} else{
			alertTip("系统异常，请联系管理员!");
		}
		
	});
}


/**
 * 2次输入失败就显示 验证码输入框
 * */
function refreshvc(){  
	$('#verificationcodereg').val('');
	if(errorLoginCount<3){
		$('.verification_li').hide();
		return;
	}
	$('.verification_li').show();
    //var path = $("#contextPath").val();  
    var refreshvcurl =path+"/VerificationCode/createcode?vcdemander=userregister&time="+new Date();  
    $("#verificationcodeimg").attr("src",refreshvcurl);  
}  

function codeRule(){
	
	var keynum;
	var keychar;
	var numcheck;
	var e=	window.event
	keynum = e.keyCode;
	keychar = String.fromCharCode(keynum)
	numcheck = /[ 0-9\-]+/;
	
	if( !numcheck.test(keychar)){
	    e.returnValue = false; 
	}
}


/**
 * 窗口抖动
 */
function shake(){
	var $panel = $(".loginbox"); //登录框		
    var box_left = ($(window).width() - $panel.width()) / 2;
    $panel.css({'left': box_left,'position':'absolute'});
    for(var i=1; 4>=i; i++){
        $panel.animate({left:box_left-(40-10*i)},50);
        $panel.animate({left:box_left+2*(40-10*i)},50);
    }
}

function disableButton(id) {
	$("#" + id).prop("disabled", true);
	$("#" + id).attr("class", "btnInfo btnInfoDisable");
}

function enableButton(id) {
	$("#" + id).prop("disabled", false);
	$("#" + id).attr("class", "loginBtn loginbotton");
}

document.onkeydown = function check(e) {
    var code;
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
	if (((event.keyCode == 8) &&                                                    //BackSpace 
	         ((event.srcElement.type != "text" && 
	         event.srcElement.type != "textarea" && 
	         event.srcElement.type != "password") || 
	         event.srcElement.readOnly == true)) || 
	        ((event.ctrlKey) && ((event.keyCode == 78) || (event.keyCode == 82)) )    //CtrlN,CtrlR 
	        ) {                                                   
	        event.keyCode = 0; 
	        event.returnValue = false; 
	    }
	return true;
}