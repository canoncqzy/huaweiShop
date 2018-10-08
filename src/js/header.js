/*复用头部尾部*/
define(["jquery"],function(){
	//加载头部
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
	$("footer").load("/html/include/footer.html")
});