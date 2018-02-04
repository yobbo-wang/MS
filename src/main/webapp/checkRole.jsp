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
<title>角色选择</title>
	
<jsp:include page="/common/common.jsp"></jsp:include>
<style type="text/css">
	.no-padding{
		margin:0px !important;
	}
	.role-box{
		margin: 0px;
		padding: 0px;
		height: 140px;
	}
	.role-box li{
		border-bottom:1px solid #DDD;
		text-align:left;
	}
	.role-box li i{
		margin-right:8px;
	}
	.role-box .role  {
		padding:5px 0px 5px 10px;
		cursor: pointer;
	}
	.role-box  .roleCheck{/*选中状态背景色*/
		background-color: #FFFFCC;
		color: #000;
	}
	.role-box .role:hover{
		background-color: #84CEFF;
		color: #fff;
	}
	.role-box .mCSB_inside .mCSB_container{
		margin-right:0px !important;
	}
</style>
</head>
<body class="no-padding">
	<div class="role-box" id="roleContent">
		<ul id="roleBox"></ul>
	</div>
	<!--  
<div class="popup-btn-box">
	<a href="javascript:;"  role="button" class="btnSearch" onclick="checkRole()"><i class="splashy-check"></i> 确定</a>
</div>
-->
</body>

<script>
(function($){
	$(window).load(function(){
		$("#roleContent").mCustomScrollbar({
			live:true,
			theme:"inset-dark"
		});
	});
})(jQuery);

var api=frameElement.api;
var win = frameElement.api.opener; 
var data=api.data;
var roleId;
var roleName;
var roleCode;
//根据选择的 状态获取绑定的按钮
$(function(){
	var roleBox=$('#roleBox');
	for(var i=0;i<data.length;i++){
		var div;
		if(i==0){
			div=$('<li class="role roleCheck" name="role" roleCode="'+data[i].roleCode+'" roleId="'+data[i].roleId+'" roleName="'+data[i].roleName+'"><i class="si-user_suit"></i>' +data[i].roleName+'</li>');
			roleId= data[i].roleId;
			 roleName= data[i].roleName;
			 roleCode= data[i].roleCode;
		}else{
			div=$('<li class="role" name="role" roleCode="'+data[i].roleCode+'" roleId="'+data[i].roleId+'" roleName="'+data[i].roleName+'"><i class="si-user_suit"></i>' +data[i].roleName+'</li>');
		}
		roleBox.append(div);
	}
	//状态及按钮鼠标移动效果
	$('[name="role"]').mouseover(function() {
	//	$(this).css("background", "#FFC");
	}).mouseout(function() {	
	//	$(this).css("background", "none");
	}).bind('click',function(){
		roleId= $(this).attr("roleId");
		 roleName= $(this).attr("roleName");
		 roleCode= $(this).attr("roleCode");
		win.toMain({roleId:roleId,roleName:roleName,roleCode:roleCode});
		api.close();
	})

});
function checkRole (){
	win.toMain({roleId:roleId,roleName:roleName,roleCode:roleCode});
}

</script>
</html>