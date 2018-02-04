
$(function(){
	$(document).on("mouseenter",".dropDown",function(){
		$(this).addClass("hover");
	});
	$(document).on("mouseleave",".dropDown",function(){
		$(this).removeClass("hover");
	});
	$(document).on("mouseenter",".dropDown_hover",function(){
		$(this).addClass("open");
	});
	$(document).on("mouseleave",".dropDown_hover",function(){
		$(this).removeClass("open");
	});
	$(document).on("click",".dropDown-menu li a",function(){
		$(".dropDown").removeClass('open');
	});
	$(document).on('click', function(event){
		var e_t = $(event.target).parents('.dropDown_click');
		if($(".dropDown_click").hasClass('open')){
			if(e_t.hasClass('open')){
				e_t.removeClass('open');
				return;
			}
			$(".dropDown_click").removeClass('open');
			e_t.toggleClass('open');
		}else{
			e_t.toggleClass('open');
		}
	});
});