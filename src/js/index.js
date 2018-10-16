require(["config"],function(){
	require(["jquery","template","header","carousel","cookie","rightNav"],function($,template){
		function Index(){
			this.showNavWindow();
			this.loadBanner();
			this.loadProducts();
			this.loadRecommend();
			this.toTop();
			this.verify();
			this.setLeft= 0;
		}
		Index.prototype={
			constructor:Index,
			showNavWindow:function(){
				//绑定监听事件
				this.addListener();
			},
			addListener:function(){
				//绑定鼠标移入li监听事件
				$("#nav-left").on("mouseenter","li",this.navEnter);
				//绑定鼠标移出li监听事件
				$("#nav-left").on("mouseleave","li",this.navLeave);
				//绑定点击向后翻页事件
				$(".forward").on("click", $.proxy(this.nextPage,this));
				//绑定点击向前翻页事件
				$(".backwards").on("click",$.proxy(this.frontPage,this));
				//绑定鼠标点击监听事件
				$("#nav-left").on("click","a",this.navClickHandler);
				//关闭头顶广告
				$(".close-adver").click(function(){
					$(".top-adver").hide();
				});
			},
			navEnter:function(){
				//获取当前li中ID
				var _id = $(this).find(".id").text();
				//字符串拼接二级菜单元素ID名
				var elem = "#nav-window"+_id;
				$(elem).show();
				//绑定鼠标移入nav-window监听事件
				$(elem).mouseenter(function(){
					$(this).show();
				});
				//ajax获取数据
				$.ajax({
					type:"get",
					url:"http://rap2api.taobao.org/app/mock/86514/nav",
					success:function(data){
						data.res_body.info.forEach(curr=>{
							if(curr.id==_id){
								//字符串拼接二级菜单商品列表id
								var list = "#nav-window-bottom-list"+_id;
								//遍历显示商品列表信息
								var html_list = "";
								curr.product.forEach(curr=>{
									html_list+=`<a href="#">
													<li>
														<div class="pic"><img src="${curr.img}"/></div>
														<p>${curr.name}</p>
														<p><span>￥${curr.price}</span></p>
													</li>
												</a>`;
								});
								$(list).html(html_list);
							}
						});
					}
				});
			},
			navLeave:function(){
				//获取当前li中ID
				var _id = $(this).find(".id").text();
				//字符串拼接二级菜单元素ID名
				var elem = "#nav-window"+_id;
				$(elem).hide();
				//绑定鼠标移出nav-window监听事件
				$(elem).mouseleave(function(){
					$(this).hide();
				});
			},
			navClickHandler:function(){
				var _id = $(this).parents(".box").siblings(".id").text(),
					arrId = [],
					arrTitles = [],
					str = "#nav-window"+_id;
					//当前点击a标签的文本
					arrTitles.push($(this).text());
					//获取标题
				var titles = $(str).find(".box").children();
				//push进数组
				titles.each(function(index,curr){
					arrTitles.push($(curr).text());
				});
				//id数组
				arrId.push(_id);
				$.cookie.json = true;
				$.cookie("id", arrId, {expires: 10, path: "/"});
				$.cookie("titles", arrTitles, {expires: 10, path: "/"});
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
			loadBanner:function(){
				$(".advertise-container").carousel({
					imgs:[
						{href:"#",src:"/img/20180718084432792.jpg"},
						{href:"#",src:"/img/20180824093821954.png"},
						{href:"#",src:"/img/20180913163850512.jpg"},
						{href:"#",src:"/img/20180930092027460.jpg"},
						{href:"#",src:"/img/20180930092036356.jpg"},
					],
					width: 1200,
					height: 120,
					duration: 3000,
					needTurnPage: false,
					circlePosition: "right"
				});
				//轮播公告
				this.slideGongGao();
			},
			loadRecommend:function(){
				$.ajax("http://rap2api.taobao.org/app/mock/86514/competitiveRecommend")
					.done($.proxy(this.handleCompetitiveData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/watchRecommend")
					.done($.proxy(this.handleWatchData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/houseRecommend")
					.done($.proxy(this.handleHouseData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/partsRecommend")
					.done($.proxy(this.handlePartsData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/brandPartsRecommend")
					.done($.proxy(this.handleBrandData, this));
			},
			handleCompetitiveData:function(data){
				var html = template("competitive-recommend-template", data);
				$(".c-ul",".competitive-box").prepend(html);
			},
			handleWatchData:function(data){
				var html = template("watch-recommend-template", data);
				$(".w-ul",".watch-box").prepend(html);
			},
			handleHouseData:function(data){
				var html = template("house-recommend-template", data);
				$(".h-ul",".house-box").prepend(html);
			},
			handlePartsData:function(data){
				var html = template("parts-recommend-template", data);
				$(".p-ul",".parts-box").prepend(html);
			},
			handleBrandData:function(data){
				var html = template("brand-parts-recommend-template", data);
				$(".bp-ul",".brand-parts-box").prepend(html);
			},
			loadProducts:function(){
				$.ajax("http://rap2api.taobao.org/app/mock/86514/hotProducts")
					.done($.proxy(this.hotProductsData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/phone")
					.done($.proxy(this.phoneData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/computer")
					.done($.proxy(this.computerData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/slab")
					.done($.proxy(this.slabData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/watch")
				.done($.proxy(this.watchData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/house")
				.done($.proxy(this.houseData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/hotParts")
				.done($.proxy(this.hotPartsData, this));
				$.ajax("http://rap2api.taobao.org/app/mock/86514/brandParts")
				.done($.proxy(this.brandPartsData, this));
			},
			hotProductsData:function(data){
				var html = template("hotProducts-template", data);
				$(".hot-product-ul").prepend(html);
			},
			phoneData:function(data){
				var html = template("phone-template", data);
				$(".phone-ul").append(html);
			},
			computerData:function(data){
				var html = template("computer-template", data);
				$(".computer-ul").append(html);
			},
			slabData:function(data){
				var html = template("slab-template", data);
				$(".slab-ul").append(html);
			},
			watchData:function(data){
				var html = template("watch-template", data);
				$(".watch-ul").append(html);
			},
			houseData:function(data){
				var html = template("house-template", data);
				$(".house-ul").append(html);
			},
			hotPartsData:function(data){
				var html = template("hotParts-template", data);
				$(".hotParts-ul").append(html);
			},
			brandPartsData:function(data){
				var html = template("brandParts-template", data);
				$(".brandParts-ul").append(html);
			},
			toTop:function(){
				$(window).scroll(function(){
					var top = $(window).scrollTop();
					if(top>=1000){
						$("a",".toTop").show()
					}else{
						$("a",".toTop").hide();
					}
				});
			},
			slideGongGao:function(){
				var step = 0;
				var li_height = $("li",".slide-gonggao").css("height").slice(0,2),
					li_num = $("li",".slide-gonggao").length;
				var timer = setInterval(function(){
					step-=li_height;
					if(step == -li_height*li_num){
						step=0;
						$(".slide-gonggao").css("margin-top",step);
					}
					$(".slide-gonggao").animate({
						"margin-top":step
					});
				},2000);
				//鼠标滑入停止计时器
				$("li",".slide-gonggao").mouseenter(function(){
					clearInterval(timer);
				});
				$("li",".slide-gonggao").mouseleave(function(){
					timer = setInterval(function(){
						step-=li_height;
						if(step == -li_height*li_num){
							step=0;
							$(".slide-gonggao").css("margin-top",step);
						}
						$(".slide-gonggao").animate({
							"margin-top":step
						});
					},2000);
				});
			},
			verify:function(){
				//用户信息判断
				$.cookie.json = true;
				var user = $.cookie("login-user");
				if (user){
					$(".loginPic-img").attr("src","/img/147747606341681858.JPEG");
					$(".login-register").html(`hi~${user}`);
				}
			}
		}
		new Index();
		//banner轮播
		function Banner(){
			this.lis = null; // 所有轮播的图片盒子
			this.circles = null; // 所有小圆
			this.currentIndex = 0; // 当前正显示的图片索引
			this.nextIndex = 1; // 即将显示图片的索引
			this.length = 1;
			
			this.creCircle();
			this.getEls();
			this.move();
			this.autoPlay();
			this.addListener();
		}
		Banner.prototype = {
			constructor:Banner,
			creCircle:function(){
				//获取图片张数
				this.length = $("li",".banner").length;
				//生成小圆点
				var html="";
				for (var i=0;i<this.length;i++) {
					html+=`<span class="current"></span>`;
				}
				//渲染
				$(".circle",".banner").html(html);
				//默认第一个小圆点
				$("span:first",".circle").css("background","#999999");
			},
			// 获取创建元素
			getEls: function() {
				this.lis = $("li",".banner"); // 所有轮播的图片盒子
				this.circles = $("span",".circle"); // 所有小圆
			},
			// 自动轮播
			autoPlay:function(){
				this.timer = setInterval($.proxy(this.move, this),3000);
			},
			// 轮播切换
			move: function() {
				// 当前显示的图片淡出
				$(this.lis[this.currentIndex]).fadeOut();
				// 即将显示的图片淡入
				$(this.lis[this.nextIndex]).fadeIn();
				// 修改小圆样式
				// 当前的小圆点去掉 "灰色" 样式
				$(this.circles[this.currentIndex]).css({background: "#fff"});
				// 即将显示的图片对应小圆点添加 "灰色" 样式
				$(this.circles[this.nextIndex]).css({background: "#999999"});
	
				// 修改显示图片索引
				this.currentIndex = this.nextIndex;
				this.nextIndex++;
				if (this.nextIndex >= this.length) // 超过最后一张图片的索引，则还原为0
					this.nextIndex = 0;
			},
			// 添加事件监听
			addListener: function() {
				// 鼠标移入移出容器
				$(".banner").hover($.proxy(this.enterHandler, this), $.proxy(this.leaveHandler, this));
				// 鼠标移入小圆点
				this.circles.on("mouseover", $.proxy(this.overHandler, this));
			},
			// 鼠标移入容器处理
			enterHandler: function() {
				clearInterval(this.timer);
			},
			// 鼠标移出容器处理
			leaveHandler: function() {
				this.autoPlay();
			},
			// 鼠标移入小圆点处理
			overHandler: function(event) {
				// 获取鼠标移入的小圆点索引
				var index = $(event.target).index();
				// 判断当前显示图片是否为所选中小圆点对应的图片
				if (index === this.currentIndex) // 是，则不用切换，结束函数执行
					return;
				// 将当前小圆点的索引设置为即将显示图片的索引
				this.nextIndex = index;
				// 调用 move() 切换
				this.move();
			},
		}
		new Banner();
	})
});




