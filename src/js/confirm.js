require(["config"],function(){
	require(["jquery"],function($){
		function Confirm(){
			this.load();
		}
		$.extend(Confirm.prototype,{
			load:function(){
			//头部
			$("header").load("/html/include/cartHeader.html",function(){
				$("#my-cart").text("确认订单");
				$(".box",".right").css("background","url(/img/sprites6.8c58970.png) no-repeat 0 -50px");
			});
			//尾部
			$("footer").load("/html/include/footer.html");
			}
		});
		new Confirm();
	})
})