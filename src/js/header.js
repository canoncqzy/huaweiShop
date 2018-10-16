/*复用头部尾部*/
define(["jquery","cookie"],function($){
	function Header(){
		this.load();
	}
	Header.prototype={
		constructor:Header,
		load:function(){
			//头部
			$.get("/html/include/header.html",$.proxy(this.headerHandler,this));
			//尾部
			$("footer").load("/html/include/footer.html");
		},
		headerHandler:function(data){
			//渲染头部
			$("header").html(data);
			this.verify();
			this.loadCartNumber();
			//注册监听事件
			this.addListener();
		},
		addListener:function(){
			//为搜索框绑定键盘事件
			$(".select>input:first").keyup(this.searchHandler);
			//为搜索提示绑定点击事件
			$(".suggest").on("click","div",this.suggestHandler);
		},
		searchHandler:function(){
			var word = $(this).val(),
				url = `https://suggest.taobao.com/sug?code=utf-8&q=${word}&callback=?`;
			$.getJSON(url,function(data){
				var html = "";
				data.result.forEach(function(curr){
					html += `<div>${curr[0]}</div>`;
				});
				$(".suggest").html(html);
			});
		},
		suggestHandler:function(){
			$(".select>input:first").val($(this).text());
			$(".suggest").empty();
		},
		verify:function(){
			//用户信息判断
			$.cookie.json = true;
			var user = $.cookie("login-user");
			if (user){
				console.log("a");
				var html1 = `<a href="#">用户:${user}</a>`,
					html2 = `<a href="#" class="logout">退出</a>`;
				$(".index-login").html(html1);
				$(".index-register").html(html2);
			}
			//退出
			$(".logout").click(function(){
				$.removeCookie("login-user",{path:"/"});
				location = "/index.html";
				return false;
			});
		},
		loadCartNumber:function(){
			var cart = $.cookie("cart"),
				num = $(cart).length;
			$(".cart-number").text("("+num+")");
		}
	}
	new Header();
});

