require(["config"],function(){
	require(["jquery","template","cookie","rightNav"],function($,template){
		function Cart(){
			this.products = null;
			this.load();
			this.addListener();
			this.setLeft= 0;
		}
		$.extend(Cart.prototype,{
			load:function(){
				$("header").load("/html/include/cartHeader.html",$.proxy(function(){
					this.verify();
					this.loadCartNumber();
				},this));
				$("footer").load("/html/include/footer.html");
				$.ajax("http://rap2api.taobao.org/app/mock/86514/competitiveRecommend")
					.done($.proxy(this.loadRecomend,this));
				//从cookie中读取数据，判断是否有选购商品
				$.cookie.json = true;
				var products = this.products= $.cookie("cart")||[];
				//判断是否为空
				if(products.length==0){
					$(".empty").show();
					$(".not-empty").hide();
					return;
				}
				//购物车非空
				$(".empty").hide();
				$(".not-empty").show();
				//渲染模版
				var data = {products};
				var html = template("list-template", data);
				$(".template-box").html(html);
			},
			loadRecomend:function(data){
				var html = template("recommend-template", data);
				$("ul",".hot-reg-box").prepend(html);
			},
			addListener:function(){
				//删除
				$(".prod-list").on("click",".delete",$.proxy(this.deleteHandler,this));
				//+-数量
				$(".num-box").on("click",".decrement,.increment",$.proxy(this.decIcrNum,this));
				//输入数量
				$(".num-box").on("blur",".amount-input",$.proxy(this.amountInput,this));
				//全选
				$(".checkAll").on("click",$.proxy(this.checkAllHandler,this))
				// 部分选中
				$(".prod-list").on("click", ".ck_prod", $.proxy(this.ckProdHandler, this));
				//清空购物车
				$(".clear-cart").click($.proxy(this.clearCartHandler,this));
				//绑定点击向后翻页事件
				$(".forward").on("click", $.proxy(this.nextPage,this));
				//绑定点击向前翻页事件
				$(".backwards").on("click",$.proxy(this.frontPage,this));
				//绑定立即结算按钮
				$(".pay-btn").on("click",$.proxy(this.payHandler,this));
			},
			//删除
			deleteHandler:function(event){
				var src = event.target,
					id = $(src).parent("li").siblings("b").text(),
					delElement = $(src).parents(".prod-list");
				//从数组中删除对应id商品对象
				this.products = this.products.filter(function(prod) {
					return !(prod.id == id);
				});
				// 从 cookie 中保存的购物车结构中删除商品数据
				$.cookie("cart", this.products, {expires: 10, path: "/"});
				// 从 DOM 树中删除 DOM结构
				delElement.remove();
				this.isEmpty();
			},
			//清空购物车
			clearCartHandler:function(e){
				// 清空cookie
				$.removeCookie("cart",{path:"/"});
				// 从 DOM 树中删除 DOM结构
				$(".template-box").remove();
				this.isEmpty();
			},
			//判空
			isEmpty:function(){
				//从cookie中读取数据，判断是否有选购商品
				$.cookie.json = true;
				var products = this.products= $.cookie("cart")||[];
				//判断是否为空
				if(products.length==0){
					$(".empty").show();
					$(".not-empty").hide();
					return;
				}
			},
			//+—数量
			decIcrNum:function(event){
				var src = event.target,
					prod_list = $(src).parents(".prod-list"),//事件源所在盒子
					id = $(src).parents("li").siblings("b").text();
				var product = this.products.filter(function(prod){
					return prod.id == id;
				})[0];
				// +/-数量
				if ($(src).is(".decrement")) { // -
					if (product.amount <= 1)
						return;
					product.amount--;
				} else { // +
					product.amount++;
				}
				// 保存到 cookie 中（修改数量后的数组）
				$.cookie("cart", this.products, {expires:10, path:"/"});

				// 页面渲染
				prod_list.find(".amount-input").val(product.amount);
				prod_list.find(".sub").text("￥"+(product.amount*product.price).toFixed(2));
				//计算合计
				this.calcTotal();
			},
			//输入数量
			amountInput:function(e){
				var src = e.target,
					prod_list = $(src).parents(".prod-list"),
					id = $(src).parents("li").siblings("b").text(),
					_amount = $(src).val(),
					product = this.products.filter(prod=>prod.id ==id)[0];
					var reg = /^[1-9]\d*$/;
					if (!reg.test(_amount)) { // 格式有误，则还原为原有数量值
						$(src).val(product.amount);
						return;
					}
					product.amount = _amount;
					//存回cookie
					$.cookie("cart",this.products,{expires:10,path:"/"});
					//显示小计
					prod_list.find(".sub").text("￥"+(product.amount*product.price).toFixed(2));
					//计算合计
					this.calcTotal();
			},
			//全选
			checkAllHandler:function(e){
				var status = $(event.target).prop("checked") // element.checked
				// 将各商品行前复选框选中状态设置为全选的选中状态
				$(".ck_prod").prop("checked", status);
				//获取购物车主体中选中的复选框个数
				var count = $(".ck_prod:checked",".prod-list").length;
				console.log(count);
				//显示已选商品数量
				$(".selected-product-num").text(count);
				//计算合计
				this.calcTotal();
			},
			//部分选择
			ckProdHandler:function(e){
				// 获取购物车主体中选中的复选框个数
				var count = $(".ck_prod:checked",".prod-list").length;
				// 设置全选复选框选中状态
				var status = count === this.products.length;
				$(".checkAll").prop("checked", status);
				//显示已选商品数量
				$(".selected-product-num").text(count);
				//计算合计
				this.calcTotal();
			},
			//计算合计金额
			calcTotal:function(){
				var sum = 0;
				$(".ck_prod:checked").each(function(index,curr){
					sum += Number($(curr).parent("span").siblings("ul").find(".sub").text().slice(1));
				});
				$(".calc-total-price").text("￥"+sum);
			},
			nextPage:function(e){
				var src = e.target;
				var li_num = $(src).siblings("ul").find("li").length,
					li_width = $(src).siblings("ul").find("li").width(),
					box_width = $(src).parent(".box").width(),
					ul_left = $(src).siblings("ul").position().left,
					_cursor = $(src).siblings(".backwards").css("cursor");
				//设置ul长度
				$(src).siblings("ul").css("width",li_num*li_width);
				if($(src).css("cursor")!="not-allowed"){
					if(li_num*li_width>(0-ul_left)){
						//每次移动盒子宽度
						this.setLeft-=li_width*2;
						$(src).siblings("ul").animate({
							left:this.setLeft
						});
						//设置后退按钮属性
						$(src).siblings(".backwards").css("cursor","pointer");
						//判断
						if(li_num*li_width+ul_left<=box_width+li_width*2){
							$(src).siblings("ul").animate({
								left:ul_left
							});
							$(src).css("cursor","not-allowed");
							this.setLeft = 0;
						}
					}
				}
			},
			frontPage:function(e){
				var src = e.target;
				var li_num = $(src).siblings("ul").find("li").length,
					li_width = $(src).siblings("ul").find("li").width(),
					box_width = $(src).parent(".box").width(),
					ul_left = $(src).siblings("ul").position().left,
					_cursor = $(src).siblings(".backwards").css("cursor");
				//设置ul长度
				$(src).siblings("ul").css("width",li_num*li_width);
				if($(src).css("cursor")!="not-allowed"){
					if(li_num*li_width>(0-ul_left)){
						//每次移动盒子宽度
						ul_left+=li_width*2;
						$(src).siblings("ul").animate({
							left:ul_left
						});
						//设置前进按钮属性
						$(src).siblings(".forward").css("cursor","pointer");
						//判断
						if(ul_left>=0){
							$(src).siblings("ul").animate({
								left:0
							});
							$(src).css("cursor","not-allowed");
							this.setLeft=0;
						}
					}
				}
			},
			payHandler:function(){
				//用户信息判断
				$.cookie.json = true;
				var user = $.cookie("login-user");
				if (!user){
					alert("请先登录,立即跳转到登录界面");
					location = "/html/login.html";
					return;
				}
				location = "/html/confirm.html";
			},
			//验证身份信息
			verify:function(){
				//用户信息判断
				$.cookie.json = true;
				var user = $.cookie("login-user");
				if (user){
					var html1 = `<a href="#">用户:${user}</a>`,
						html2 = `<a href="#" class="logout">退出</a>`;
					
					console.log($(".header-login"));
					$(".header-login").html(html1);
					$(".header-register").html(html2);
				}
				//退出
				$(".logout").click(function(){
					console.log("a");
					$.removeCookie("login-user",{path:"/"});
					location = "/html/cart.html";
					return false;
				});
			},
			loadCartNumber:function(){
				var cart = $.cookie("cart"),
					num = $(cart).length;
				$(".cart-number").text("("+num+")");
			}
		});
		new Cart();
	})
})