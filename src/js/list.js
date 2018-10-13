require(["config"],function(){
	require(["jquery","template","header","cookie"],function($,template){
		function List(){
			this.loadList();
		}
		$.extend(List.prototype,{
			loadList:function(){
				$.cookie.json = true;
				var id =$.cookie("id"),
					titles = $.cookie("titles"),
					currTitle = titles.shift();
				var title_container = $(".title",".container"),
					kind_container = $("ul",".kind");
					
				//遍历titles渲染分类
				var kind_html  = "";
				titles.forEach(function(curr){
					kind_html+=`<li><a href="#">${curr}</a></li>`;
				});
				$(kind_container).append(kind_html);
				//获取分类查看是否与当前元素相同，有则改变颜色
				var li_a = $("a",".kind");
				$(li_a).each(function(index,curr){
					if($(curr).text()==currTitle){
						$(curr).css("color","#ed0213");
					}
				});
				var html = "";
				if(id[0]==1){
					html = `<a href="#"><i></i>手机</a>
							<a href="#"><i></i>${currTitle}</a>`;
				}else if(id[0]==2){
					html = `<a href="#"><i></i>笔记本&平板</a>
							<a href="#"><i></i>${currTitle}</a>`;
				}else if(id[0]==3){
					html = `<a href="#"><i></i>智能穿戴</a>
							<a href="#"><i></i>${currTitle}</a>`;
				}else if(id[0]==4){
					html = `<a href="#"><i></i>智能家居</a>
							<a href="#"><i></i>${currTitle}</a>`;
				}else if(id[0]==5){
					html = `<a href="#"><i></i>通用配件</a>
							<a href="#"><i></i>${currTitle}</a>`;
				}else{
					html = `<a href="#"><i></i>专属配件</a>
							<a href="#"><i></i>${currTitle}</a>`;
				}
				//渲染title
				$(title_container).append(html);
				
				//ajax获取数据
				$.ajax("http://rap2api.taobao.org/app/mock/86514/list")
					.done($.proxy(this.handleListData, this));
			},
			handleListData:function(data){
				var html = template("list-template", data);
				$(".list").append(html);
				$(".list").on("click",".box",this.handleBoxClick);
			},
			handleBoxClick:function(){
				var prod_info = {
					title:$("a:last",".title").text(),
					name:$(this).children(".name").text(),
					price:$(this).children(".price").text()
				};
				$.cookie("prod_info", prod_info, {expires: 10, path: "/"});
				
				window.open("/html/detail.html");
			}
		});
		new List();
	})
})