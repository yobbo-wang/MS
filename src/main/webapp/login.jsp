<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%
String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /> <!--优先使用最新版IE浏览器-->
<!-- <title>新疆农村信用社</title> -->
<title>业务连续性管理软件-登录</title>

<script type="text/javascript" src="<%=path%>/resources/js/jquery/jquery.min.js"></script>
<script type="text/javascript" src="<%=path%>/resources/js/jqueryeasyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=path%>/resources/js/jqueryeasyui/easyui-lang-zh_CN.js"></script>
<script type="text/javascript"	src="<%=path%>/resources/js/plug/lhgdialog/lhgdialog.min.js"></script>
<script type="text/javascript"	src="<%=path %>/common/common_tools.js"></script>
<script type="text/javascript" src="<%=path%>/resources/js/utils/jquery.pulsate.min.js" charset="utf-8"></script>
<script type="text/javascript" src="<%=path%>/resources/js/utils/md5-min.js"></script>
<!--  -->
<script type="text/javascript" src="<%=path%>/resources/js/utils/des.js"></script>
<script type="text/javascript" src="<%=path%>/resources/js/utils/comp-dropDown.js"></script>
<script type="text/javascript" src="login.js"></script>

<!--自定义遮罩层样式-->
<style>
#loading-mask{
    position:absolute;
    left:0;
    top:0;
    filter:alpha(opacity=50);opacity:.5;
    width:100%;
    height:100%;
    z-index:4;
    background-color:#DCE2F1;
     display:none;
}
</style>
<!-- 修改favicon.ico图标 -->
<link rel="Bookmark" href="<%=path%>/resources/images/main/bitbug_favicon.ico" />
<link rel="Shortcut Icon" href="<%=path%>/resources/images/main/bitbug_favicon.ico" />


<link rel="stylesheet" type="text/css"	href="<%=path%>/resources/css/easyui/themes/default/easyui.css">
<!-- 通用样式  用于控制系统的字体 和表单格式的统一 -->
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/layout.css" /> 
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/font/css/font-awesome.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/common_css.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/button.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/popUp.css" />
<link href="<%=path%>/resources/css/login.css" rel="stylesheet" type="text/css" />
</head>
<body>
<!-- 飘云 -->
<div id="yun">
	  <div id="cloud1" class="cloud"></div>
 	 <div id="cloud2" class="cloud"></div>
</div>

<!-- 中间 登录窗口 -->

<div class="loginbody">
    <div class="systemlogo"></div> 
    <div class="loginbox">
    	<form id="login_form" name="login_form"  method="post" action="">
		    <ul>
				<li>用户名称<input id="loginName" name="loginName" type="text" class="loginuser" value=""    placeholder="请输入用户名称 " /></li>
				<li>用户密码<input id="password" name="password" type="password" class="loginpassword" value=""   placeholder="请输入用户密码 "/></li>
				<li class="verification_li ">
					&nbsp;&nbsp;验证码
					  	<input type="text" id="verificationcodereg"  class="verificationcod"  name="verificationcodereg"    placeholder="请输入验证码"
				  	 tabindex="4" maxlength="4"
				  	  onkeypress ="codeRule()"  
				  	  style="ime-mode:disabled;"   
				  	 />  
				
				    <img   style="display:inline " id="verificationcodeimg"  onclick="refreshvc();" src="<%=path %>/resources/images/login/loading.gif" />  				    
				   
				</li>
			
				<li class="login-but">
					<input id="loginBtn" name="" type="button" class="loginBtn loginbotton" value="登 录"  onclick="login();"  />
					<input name="" type="reset" class="loginBtn loginBtnReset margin-right" value="重 置"  />
				</li>
		    </ul>
		    
		    <!-- <a href="javascript:;"    class="sjBrowser">Android下载安装</a>
		    <a href="javascript:;"  onClick="javascript:window.location.href='<%=path%>/file/downIOS'"   class="sjBrowser">IOS下载安装</a>
		    -->
		    <div class="row appDownload">
					<span class="dropDown dropDown_click"><a href="javascript:;" class="dropDown_A">Android下载安装</a>
						<span class="dropDown-menu box-shadow">
							<ol>
								<li><a href="<%=path%>/model/app/bcm.apk"><img src="<%=path%>/resources/images/login/icon-android.png" alt="Android下载安装二维码"></a></li>
								<li><a href="javascript:;">手机扫一扫二维码或点击图片下载安装</a></li>
							</ol>
						</span>
					</span>
					
					<!-- <span class="dropDown dropDown_click"><a href="javascript:;" class="dropDown_A">IOS下载安装</a>
						<span class="dropDown-menu box-shadow">
							<ol>
								<li><a href="<%=path%>/model/app/bcm.ipa'" ><img src="<%=path%>/resources/images/login/icon-ios.png" alt="IOS下载安装二维码"></a></li>
								<li><a href="javascript:;">手机扫一扫二维码或点击图片下载安装</a></li>
							</ol>
						</span>
					</span> -->
		    </div>
		    
	    </form>
    </div>
</div>
	
	
<!-- 尾部版权 -->
<!-- 
<div class="loginbm">
	<p>Copyright © 2015-<script>document.write((new Date()).getFullYear());</script>Xinjiang rural credit cooperatives Co., Ltd. &nbsp;新疆农村信用社 版权所有</p>
</div>
-->
<div class="loginbm">
	<p>Copyright © 2017-<script>document.write((new Date()).getFullYear());</script> &nbsp;深圳壹师城科技有限公司  版权所有</p>
</div> 
<!-- lhgdialog 使用自定义遮罩  -->
<div id="loading-mask"  ></div>
</body>
</html>
<script type="text/javascript">

var path='<%=path%>';

</script>
</html>