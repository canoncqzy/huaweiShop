/*复用头部尾部*/
define(["jquery","cookie"],function($){
	function rightNav(){
		this.load();
	}
	rightNav.prototype={
		constructor:rightNav,
		load:function(){
			$(".rightNav").load("/html/include/rightNav.html",function(){
				$(".rightNav-div").mouseenter(function(){
					$(".rightNav").stop().animate({
						width:180,
						height:80
					});
				});
				$(".rightNav-div").mouseleave(function(){
					$(".rightNav").stop().animate({
						width:60,
						height:40,
						bottom:10
					});
				});
			});
			this.toTop();
		},
		toTop:function(){
			$(window).scroll(function(){
				var top = $(window).scrollTop();
				if(top>=1000){
					$("a",".toTop").show();
				}else{
					$("a",".toTop").hide();
				}
			});
		}
	}
	new rightNav();
});

