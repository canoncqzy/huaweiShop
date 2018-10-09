/*复用头部尾部*/
define(["jquery"],function($){
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
		}
	}
	new Header();
});

/*//加载头部
	$.ajax({
		type:"get",
		url:"/html/include/header.html",
		success:function(data){
			$("header").html(data);
			//为搜索框绑定键盘事件
			$(".select>input:first").keyup(function(){
				var word = $(this).val(),
					url = `https://suggest.taobao.com/sug?code=utf-8&q=${word}&callback=?`;
				$.getJSON(url,function(data){
					var html = "";
					data.result.forEach(function(curr){
						html += `<div>${curr[0]}</div>`;
					});
					$(".suggest").html(html);
				});
			});
			//为搜索提示绑定点击事件
			$(".suggest").delegate("div","click",function(){
				$(".select>input:first").val($(this).text());
				$(".suggest").empty();
			});
		}
	});
	
	//加载底部
	$("footer").load("/html/include/footer.html")*/