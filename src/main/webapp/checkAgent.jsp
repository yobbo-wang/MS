<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%
String path = request.getContextPath();
%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户选择</title>
	
<jsp:include page="/common/common.jsp"></jsp:include>
<style type="text/css">
	.no-padding{
		margin:0px !important;
	}
	.user-box{
		margin: 0px;
		padding: 0px;
		height: 140px;
	}
	.user-box li{
		border-bottom:1px solid #DDD;
		text-align:left;
	}
	.user-box li i{
		margin-right:8px;
	}
	.user-box .user  {
		padding:5px 0px 5px 10px;
		cursor: pointer;
	}
	.user-box  .userCheck{/*选中状态背景色*/
		background-color: #FFFFCC;
		color: #000;
	}
	.user-box .user:hover{
		background-color: #84CEFF;
		color: #fff;
	}
	.user-box .mCSB_inside .mCSB_container{
		margin-right:0px !important;
	}
</style>
</head>
<body class="no-padding">
	<div class="user-box" id="userContent">
		<ul id="userBox"></ul>
	</div>
</body>

<script>
(function($){
	$(window).load(function(){
		$("#userContent").mCustomScrollbar({
			live:true,
			theme:"inset-dark"
		});
	});
})(jQuery);

var api=frameElement.api;
var win = frameElement.api.opener; 
var data=api.data;
var userId;
var userName;
//根据选择的 状态获取绑定的按钮
$(function(){
	var userBox=$('#userBox');
	for(var i=0;i<data.length;i++){
		var div;
		if(i==0){
			div=$('<li class="user userCheck" name="user" userId="'+data[i].userId+'" userName="'+data[i].userName+'"><i class="si-user_suit"></i>' +data[i].userName+'</li>');
			userId= data[i].userId;
			 userName= data[i].userName;
		}else{
			div=$('<li class="user" name="user" userId="'+data[i].userId+'" userName="'+data[i].userName+'"><i class="si-user_suit"></i>' +data[i].userName+'</li>');
		}
		userBox.append(div);
	}
	//状态及按钮鼠标移动效果
	$('[name="user"]').mouseover(function() {
	//	$(this).css("background", "#FFC");
	}).mouseout(function() {	
	//	$(this).css("background", "none");
	}).bind('click',function(){
		userId= $(this).attr("userId");
		 userName= $(this).attr("userName");
		win.loginAgent(userId);
		api.close();
	})

});

</script>
</html>