require(["config"],function(){
	require(["jquery","template","header","cookie","zoom","rightNav"],function($,template){
		function Detail(){
			this.load();
			this.setLeft= 0;
			this.toCeiling();
		}
		$.extend(Detail.prototype,{
			load:function(){
				//渲染详情数据
				$.ajax("http://rap2api.taobao.org/app/mock/86514/detail")
					.done($.proxy(this.handleData,this));
				//加载详情图片
				$.ajax("http://rap2api.taobao.org/app/mock/86514/moredetails")
					.done(function(data){
						data = data.res_body;
						var html = template("detailPic-template",data);
						$(".detailPic").append(html);
					});
				//加载关联产品
				$.ajax("http://rap2api.taobao.org/app/mock/86514/connectProduct")
					.done(function(data){
						var html = template("connectProducts-template",data);
						$(".connectProducts-ul").append(html);
					});
			},
			handleData:function(data){
				// 获取使用数据
				data = data.res_body;
				//渲染
				var html = template("detail-template", data);
				$(".container",".content").prepend(html);
				
				//获取cookie
				$.cookie.json = true;
				var id =$.cookie("id"),
					prod_info = $.cookie("prod_info");
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
				
				//初始选定一个
				this.selectOne();
				//添加选择参数到title
				this.addSelectedToTitle();
				//放大镜
				this.zoom();
				//选择商品
				this.selectProduct();
				//改变商品编号
				this.changeProdCode();
				//监听加减按钮
				this.addListener();
			},
			zoom:function(){
				$(".middle-zoom").elevateZoom({
					gallery:'gal1', 
					cursor: 'pointer', 
					galleryActiveClass: 'active'
				});
			},
			selectOne:function(){
				var colors = $(".colors",".selectColor").children(),
					versions = $(".versions",".selectVersion").children(),
					service = $(".sec-services",".securityService").children();
				$(colors).each(function(index,curr){
					//不是第一个移出style
					if(index!=0){
						$(curr).removeAttr("style");
					}
				});
				$(versions).each(function(index,curr){
					//不是第一个移出style
					if(index!=0){
						$(curr).removeAttr("style");
					}
				});
				$(service).each(function(index,curr){
					//不是第一个移出style
					if(index!=0){
						$(curr).removeAttr("style");
					}
				});
			},
			selectProduct:function(){
				$(".selectProduct").on("click",$.proxy(function(event){
					var src = event.target;
					if(src.tagName=="IMG"||src.tagName=="SPAN"){
						$(src).parents(".selectProduct").css("border-color","#CA141D");
						$(src).parents(".selectProduct").siblings().removeAttr("style");
					}else{
						$(src).css("border-color","#CA141D");
						$(src).siblings().removeAttr("style");
					}
					//添加选择参数到title
					this.addSelectedToTitle();
				},this));
			},
			changeProdCode:function(){
				$(".change-prod-code").click(function(){
					var prod_code = Number($(".product-code").text());
					prod_code++;
					$(".product-code").text(prod_code);
				});
			},
			//添加选择参数到title
			addSelectedToTitle:function(){
				var params = $(".selectProduct"),
					addTotitle = [];
				$(params).each(function(index,curr){
					if($(curr).css("border-color")=="rgb(202, 20, 29)"){
						addTotitle.push($(curr).text());
					}
				});
				//从cookie中读出title
				$.cookie.json = true;
				var prod_info = $.cookie("prod_info");
				var html=`${prod_info.title}&nbsp;`,
					html2=`${prod_info.title}&nbsp;`,
					html3="";
				addTotitle.forEach(curr=>{
					html+=`${curr}&nbsp;`;
					html2+=`${curr}&nbsp;`;
					html3+=`<span>/${curr}&nbsp;</span>`
				});
				$("a:last",".content-container-title").html(html);
				$(".details-title").html(html2);
				$(".selected-container").html(html3);
			},
			addListener:function(){
				// +/-数量
				$(".num-box").on("click", ".increment,.decrement", $.proxy(this.decIncHandler, this));
				//添加到购物车
				$(".addtocart").click(this.addToCart);
				//立即下单
				$(".addtopay").click(this.addToPayHandler);
				//点击小图切换中图
				$(".gal1").on("click",".small-pic",this.handleChangePic);
				//绑定点击向后翻页事件
				$(".next").on("click", $.proxy(this.nextPage,this));
				//绑定点击向前翻页事件
				$(".pre").on("click",$.proxy(this.frontPage,this));
			},
			//处理增加减少数量
			decIncHandler:function(event){
				var src = event.target,
					num = $(src).siblings("input").val();
					if(src.className=="increment"){
						num++;
						$(src).siblings("input").val(num);
					}else{
						num--;
						$(src).siblings("input").val(num);
						if(num<=1)
							$(src).siblings("input").val("1");
					}
			},
			//处理加入购物车
			addToCart:function(){
				//获取当前商品信息
				var currProduct = {
					id:$(".product-code").text(),
					price:Number($(".price-span").text().slice(1)),
					title:$(".details-title").text(),
					img:$(".gal1 img:first").attr("src"),
					amount:Number($("input",".num-box").val())
				};
				
				//判断是否已选过当前商品
				// 从 cookie 中读取以有的购物车数据
				$.cookie.json = true; // 配置自动在JS值与JSON文本之间相互转换
				var products = $.cookie("cart") || [];
				// 判断是否已有选购
				var has = products.some(function(prod) {
					if (prod.id == currProduct.id) { 
						prod.amount+=currProduct.amount;
						return true;
					}
					return false;
				});
				if (!has) // 未选购
					products.push(currProduct);
				// 保存购物车：存回cookie
				$.cookie("cart", products, {expires: 10, path:"/"});
				
				//获取当前商品标题
				var pt = $(".details-title").text();
				//显示提示
				$(".mask").show();
				//提示框显示title
				$(".prod-title",".success").text(pt+"已成功加入购物车！");
				//关闭模态框
				$("span",".close").click(function(){$(".mask").hide();});
				//再看看
				$(".stayHere").click(function(){$(".mask").hide();});
				//去结算
				$(".gotopay").click(function(){location="/html/cart.html"});
				return false;
			},
			addToPayHandler:function(){
				//用户信息判断
				$.cookie.json = true;
				var user = $.cookie("login-user");
				if (!user){
					alert("请先登录,立即跳转到登录界面");
					location = "/html/login.html";
					return;
				}else{
					//获取当商品信息
					var selectedProd = [];//存储选中的商品
					var cp = {
						img: $(($(".small-pic")[0])).attr("src"),
						title:$(".details-title").text(),
						price:$(".price-span").text().slice(1),
						amount:$(".num-box-input").val()
					}
					selectedProd.push(cp);
					//存入cookie
					$.cookie("selectedProd",selectedProd,{expires:10, path:"/"});
					location = "/html/confirm.html";
				}
			},
			handleChangePic:function(){
				//将中图路径设为小图路径并改变大小
				$(".middle-zoom").attr("src",$(this).attr("src"));
				$(".middle-zoom").css({
					"width":450,
					"height":450
				});
				//改变当前点击的边框
				$(this).parent("li").css("border-color","#cccccc")
				$(this).parent("li").siblings().css("border-color","#FFFFFF");
			},
			nextPage:function(e){
				this.setLeft -=160;
				$(".gal1").animate({left:this.setLeft});
				if($(".gal1").css("left")=="-480px"){
					this.setLeft = -480;
					$(".gal1").animate({left:this.setLeft});
				}
			},
			frontPage:function(e){
				this.setLeft +=160;
				$(".gal1").animate({left:this.setLeft});
				if($(".gal1").css("left")=="0px"){
					this.setLeft = 0;
					$(".gal1").animate({left:this.setLeft});
				}
			},
			//吸顶效果
			toCeiling:function(){
				$(window).scroll(function(){
					var top = $(window).scrollTop();
					//判断什么时候显示吸顶效果
					if(top>=$(".moreServices").offset().top){
						$(".ceiling").show();
					}else{
						$(".ceiling").hide();
					}
				});
				//点击设置选中样式
				$("ul",".ceiling").on("click","a",function(){
					$(this).css({
						"color":"#ca141d",
						"border-bottom":"2px solid #ca141d"
					});
					//未点击的设为未选择样式
					$(this).parent("li").siblings().children("a").css({
						"color":"#a4a4a4",
						"border-bottom":"none"
					});
				});
				$(window).scroll(function(){
					var _productSize = $("#productSize").offset().top,//获取产品参数在当前视口的相对高度
						_package = $("#package").offset().top,//获取包装在当前视口的相对高度
						_commend = $("#commend").offset().top,//获取评论在当前视口的相对高度
						_top = $(this).scrollTop();//获取相对滚动条顶部位置
					//在产品参数和包装之间显示吸顶的产品参数样式
					if(_top>=_productSize&&_top<_package){
						//产品参数为红色
						$(".productSize").css({
							"color":"#ca141d",
							"border-bottom":"2px solid #ca141d"
						});
						//其他为灰色
						$(".productSize").parent("li").siblings().children("a").css({
							"color":"#a4a4a4",
							"border-bottom":"none"
						});
					}else if(_top>=_package&&_top<_commend){//在产品包装和评论之间显示吸顶的产品包装样式
						//产品包装为红色
						$(".package").css({
							"color":"#ca141d",
							"border-bottom":"2px solid #ca141d"
						});
						//其他为灰色
						$(".package").parent("li").siblings().children("a").css({
							"color":"#a4a4a4",
							"border-bottom":"none"
						});
					}else if(_top>=_commend){//显示吸顶的评论样式
						//评论为红色
						$(".commend").css({
							"color":"#ca141d",
							"border-bottom":"2px solid #ca141d"
						});
						//其他为灰色
						$(".commend").parent("li").siblings().children("a").css({
							"color":"#a4a4a4",
							"border-bottom":"none"
						});
					}
				});
			}
		})
		new Detail();
	})
})