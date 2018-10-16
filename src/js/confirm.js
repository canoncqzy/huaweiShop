require(["config"],function(){
	require(["jquery","template","cookie","rightNav"],function($,template){
		function Confirm(){
			this.load();
			this.loadConsigneeAddress();
			this.addListener();
		}
		$.extend(Confirm.prototype,{
			load:function(){
				//头部
				$("header").load("/html/include/cartHeader.html",$.proxy(function(){
					$("#my-cart").text("确认订单");
					$(".box",".right").css("background","url(/img/sprites6.8c58970.png) no-repeat 0 -50px");
					this.verify();
					this.loadCartNumber();
				},this));
				//尾部
				$("footer").load("/html/include/footer.html");
				//从cookie中读出购物车数据
				$.cookie.json = true;
				var products = $.cookie("cart");
				//渲染模版
				var data = {products},
					html = template("products-list-template",data);
				$(".products-box-list").html(html);
				//动态设置高度
				$(".info",".box").css("height",$(".box").css("height"));
				//计算合计
				var sum = 0;
				$(products).each(function(index,curr){
					sum += curr.price
				});
				$(".totl-price").text("￥"+sum.toFixed(2));
				//积分
				$(".pay-grade").text(Math.floor(sum/10));
			},
			//加载收货地址
			loadConsigneeAddress:function(){
				// 从 cookie 中读取以有的地址数据
				$.cookie.json = true; // 配置自动在JS值与JSON文本之间相互转换
				var address = $.cookie("address"),
					data = {address},
					html = template("new-address-template",data);
				$(".add-new-address").prepend(html);
			},
			addListener:function(){
				//添加收货地址事件绑定
				$(".add-box").on("click",$.proxy(this.addAddressHandler,this));
				//保存使用地址
				$(".save-and-use").click($.proxy(this.saveAndUseAddress,this));
				//关闭模态框
				$(".close-mask").click(function(){$(".mask").hide();});
				//删除收货地址
				$(".created-address").on("click",".delete-address",$.proxy(this.deleteAddressHandler,this));
			},
			//添加收货地址
			addAddressHandler:function(e){
				//显示模态框
				$(".mask").show();
				//加载地址数据
				this.loadAddress();
			},
			//加载地方数据
			loadAddress:function(){
				//先加载省份数据
				this.loadProvice();
				//省份发生改变是加载城市
				$(".province").on("change",this.loadCity);
				//城市发生改变是加载区县
				$(".city").on("change", this.loadDistrict);
			},
			//加载省份
			loadProvice:function(){
				var url1 = "http://route.showapi.com/1149-1?showapi_appid=29550&showapi_sign=fe01daee5a6a400c91e9f8523813fc61&level=1&page=1&maxSize=20",
					url2 = "http://route.showapi.com/1149-1?showapi_appid=29550&showapi_sign=fe01daee5a6a400c91e9f8523813fc61&level=1&page=2&maxSize=20";
				$.when($.ajax(url1),$.ajax(url2))
					.done(function(data1,data2){
							var html = '<option value="-1">请选择省份</option>';
						  	data1[0].showapi_res_body.data
					  		.concat(data2[0].showapi_res_body.data)
					  		.forEach(function(curr) {
					  			html += `<option value="${curr.id}">${curr.areaName}</option>`;
					  		});
					  	$(".province-select").html(html);
					});
			},
			//加城市
			loadCity:function(){
				// 获取选择的省份 id
				var id = $(".province-select").val();
				// 根据 id 查询城市
				var url = `http://route.showapi.com/1149-2?showapi_appid=29550&showapi_sign=fe01daee5a6a400c91e9f8523813fc61&parentId=${id}`;
				$.ajax(url).done(function(data) {
					var html = '<option value="-1">请选择城市</option>';
					data.showapi_res_body.data.forEach(function(curr) {
						html += `<option value="${curr.id}">${curr.areaName}</option>`;
					});
					$(".city-select").html(html);
				});
			},
			//加载区县
			loadDistrict:function(){
				// 获取选择的城市 id
				var id = $(".city-select").val();
				// 根据 id 查询区县
				var url = `http://route.showapi.com/1149-2?showapi_appid=29550&showapi_sign=fe01daee5a6a400c91e9f8523813fc61&parentId=${id}`;
				$.ajax(url).done(function(data) {
					var html = '<option value="-1">请选择区县</option>';
					data.showapi_res_body.data.forEach(function(curr) {
						html += `<option value="${curr.id}">${curr.areaName}</option>`;
					});
					$(".district-select").html(html);
				});
			},
			//保存使用地址
			saveAndUseAddress:function(){
				// 从 cookie 中读取以有的地址数据
				$.cookie.json = true; // 配置自动在JS值与JSON文本之间相互转换
				var address = $.cookie("address") || [];
				var currAddress = {
					consignee: $(".consignee").val(),
					phoneNumber: $(".phoneNumber").val(),
					province: $(".province-select option:selected").text(),
					city: $(".city-select option:selected").text(),
					district: $(".district-select option:selected").text(),
					addressDetails: $(".address-details").val()
				};	
				address.push(currAddress);
				// 保存收货地址
				$.cookie("address", address, {expires: 10, path:"/"});
				//将新增地址信息显示到页面
				//模版
				var html = template("addToAddressBox-template",currAddress);
				$(".add-new-address").prepend(html);
				console.log(currAddress);
				//关闭模态框
				$(".mask").hide();
				//还原初始数据
				$(".consignee").val("");
				$(".phoneNumber").val("");
				$(".address-details").val("");
				$(".city-select option").remove();
				$(".district-select option").remove();
			},
			deleteAddressHandler:function(e){
				var src = e.target,
					consignee = $(src).parent().siblings(".name-phone").children("span:first-of-type").text(),
					phoneNumber = $(src).parent().siblings(".name-phone").children("span:last-of-type").text(),
					province = $(src).parent().siblings(".city").children("span:first-of-type").text(),
					city = $(src).parent().siblings(".city").children("span:nth-of-type(2)").text(),
					district = $(src).parent().siblings(".city").children("span:nth-of-type(3)").text(),
					addressDetails = $(src).parent().siblings(".city").children("span:last-of-type").text();
				//从cookie中删除
				//从cookie中读取收货地址数据
				$.cookie.json = true;
				var address = $.cookie("address");
				$(address).each(function(index,curr){
					if(curr.consignee==consignee&&curr.phoneNumber==phoneNumber&&curr.province==province&&curr.city==city&&curr.district==district&&curr.addressDetails==addressDetails){
						address.splice(index,1);
					}
				});
				//存回cookie
				$.cookie("address",address,{espires:10,path:"/"});
				//删除dom
				$(src).parents(".created-address").remove();
			},
			//验证身份信息
			verify:function(){
				//用户信息判断
				$.cookie.json = true;
				var user = $.cookie("login-user");
				if (user){
					var html1 = `<a href="#">用户:${user}</a>`,
						html2 = `<a href="#" class="logout">退出</a>`;
					
					$(".header-login").html(html1);
					$(".header-register").html(html2);
				}
				//退出
				$(".logout").click(function(){
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
		new Confirm();
	})
})