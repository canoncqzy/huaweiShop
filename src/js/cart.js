require(["config"],function(){
	require(["jquery"],function($){
		function Cart(){
			this.load();
		}
		$.extend(Cart.prototype,{
			load:function(){
				$("header").load("/html/include/cartHeader.html");
				$("footer").load("/html/include/footer.html");
			}
		});
		new Cart();
	})
})