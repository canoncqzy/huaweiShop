require(["config"],function(){
	require(["jquery","header","cookie"],function($){
		function Detail(){
			this.load();
		}
		$.extend(Detail.prototype,{
			load:function(){
				$.cookie.json = true;
				var id =$.cookie("id"),
					prod_info = $.cookie("prod_info");
				console.log(id,prod_info);
				
				var html = "";
				if(id[0]==1){
					html = `<a href="#"><i></i>手机</a>
							<a href="#"><i></i>${prod_info.title}</a>
							<a href="#"><i></i>${prod_info.name}</a>`;
				}else if(id[0]==2){
					html = `<a href="#"><i></i>笔记本&平板</a>
							<a href="#"><i></i>${prod_info.title}</a>
							<a href="#"><i></i>${prod_info.name}</a>`;
				}else if(id[0]==3){
					html = `<a href="#"><i></i>智能穿戴</a>
							<a href="#"><i></i>${prod_info.title}</a>
							<a href="#"><i></i>${prod_info.name}</a>`;
				}else if(id[0]==4){
					html = `<a href="#"><i></i>智能家居</a>
							<a href="#"><i></i>${prod_info.title}</a>
							<a href="#"><i></i>${prod_info.name}</a>`;
				}else if(id[0]==5){
					html = `<a href="#"><i></i>通用配件</a>
							<a href="#"><i></i>${prod_info.title}</a>
							<a href="#"><i></i>${prod_info.name}</a>`;
				}else{
					html = `<a href="#"><i></i>专属配件</a>
							<a href="#"><i></i>${prod_info.title}</a>
							<a href="#"><i></i>${prod_info.name}</a>`;
				}
				//渲染title
				$(".content-container-title").append(html);
				$(".details-title").text(prod_info.name);
				$(".price-span").text(prod_info.price);
			}
		})
		new Detail();
	})
})