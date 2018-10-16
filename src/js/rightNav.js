/*复用头部尾部*/
define(["jquery","cookie"],function($){
	function rightNav(){
		this.load();
	}
	rightNav.prototype={
		constructor:rightNav,
		load:function(){
			$(".rightNav").load("/html/include/rightNav.html",function(){
				$(".rightNav").mouseenter(function(){
					$(".rightNav").animate({
						width:180,
						height:80
					});
				});
				$(".rightNav").mouseleave(function(){
					$(".rightNav").animate({
						width:60,
						height:40,
						bottom:10
					});
				});
			});
		},
	}
	new rightNav();
});

