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
<title>APP手机客服端下载页面</title>
<script type="text/javascript" src="<%=path%>/resources/js/jquery/jquery.min.js"></script>

<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/reset.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/download-app.css" />

</head>

<body>
<div class="content_top">
	<div class="container">
	   	<h2>手机扫描二维码下载安装</h2>
	    <div class="col-md-6 span_3 wow fadeInRight animated">
   	   		<img src="<%=path%>/resources/download/code.png">
   	    </div>
   	    <div class="col-md-6 span_3 wow fadeInRight animated">
			<div class="col-md-3 span_2">
			   	 <h3>IOS手机客户端</h3>
			   	 <ul class="list1">
			   	 	<li><a href="<%=path%>/model/app/bcm.ipa"><img src="<%=path%>/resources/images/login/icon-ios.png" alt="IOS下载安装二维码"></a></li>
			   	 	<li><a href="<%=path%>/model/app/bcm.ipa">IOS系统的手机扫一扫或者点击二维码图片下载安装</a></li>
			   	 </ul>
		   </div>
		   <div class="col-md-3 span_2">
			   	 <h3>Android手机客户端</h3>
			   	 <ul class="list1">
			   	 	<li><a href="<%=path%>/model/app/bcm.apk" ><img src="<%=path%>/resources/images/login/icon-android.png" alt="Android下载安装二维码"></a></li>
			   	 	<li><a  href="<%=path%>/model/app/bcm.apk">Android系统的手机扫一扫或者点击二维码图片下载安装</a></li>
			   	 </ul>
		    </div>
   	    </div>
    </div>
</div>

<div class="content_bottom">
	<div class="container">
	   	<h2>成功案例</h2>
	   	<p>我们提供有多重不同的客户端解决方案！包含有pc、IOS手机客户端、Android手机客户端等等</p>
	   	<div class="grid_1 text-center">
	   	 	<div class="col-md-6 span_1">
	   	 		<img alt="" class="img-responsive" src="<%=path%>/resources/download/product-ios.png">
	   	 		<h3>IOS手机客户端</h3>
	   		</div>
	   		<div class="col-md-6 span_1">
	   	 		<img alt="" class="img-responsive" src="<%=path%>/resources/download/product-android.png">
	   	 		<h3>Android手机客户端</h3>
	   	 	</div>
	   	 	<div class="clearfix"> </div>
	   	</div>
	</div>
</div>
<div class="loginbm">
	<p>Copyright © 2015-<script>document.write((new Date()).getFullYear());</script> Shenzhen ESC Technology Co., Ltd. &nbsp;深圳壹师城科技有限公司 版权所有</p>
	<!-- <p>Copyright © 2015-<script>document.write((new Date()).getFullYear());</script>Xinjiang rural credit cooperatives Co., Ltd. &nbsp;新疆农村信用社 版权所有</p> -->
</div>
</body>
</html>