/*复用头部尾部*/
define(["jquery"],function($){
	function cartHeader(){
		this.load();
	}
	cartHeader.prototype={
		constructor:cartHeader,
		load:function(){
			//头部
			$("header").load("/html/include/cartHeader.html");
			//尾部
			$("footer").load("/html/include/footer.html");
		}
	}
	new cartHeader();
});
