require(["config"],function(){
	require(["jquery","template","header","carousel"],function($,template){
		function Index(){
			this.showNavWindow();
			this.loadBanner();
			this.loadRecommend();
			this.toTop();
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
									html_list+=`<a href="/html/detail.html">
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
				// 渲染
				var html = template("competitive-recommend-template", data);
				$("ul",".competitive-box").prepend(html);
			},
			handleWatchData:function(data){
				// 渲染
				var html = template("watch-recommend-template", data);
				$("ul",".watch-box").prepend(html);
			},
			handleHouseData:function(data){
				// 渲染
				var html = template("house-recommend-template", data);
				$("ul",".house-box").prepend(html);
			},
			handlePartsData:function(data){
				// 渲染
				var html = template("parts-recommend-template", data);
				$("ul",".parts-box").prepend(html);
			},
			handleBrandData:function(data){
				// 渲染
				var html = template("brand-parts-recommend-template", data);
				$("ul",".brand-parts-box").prepend(html);
			},
			toTop:function(){
				$(window).scroll(function(){
					var top = $(window).scrollTop();
					if(top>=1500){
						$("a",".toTop").show()
					}else{
						$("a",".toTop").hide();
					}
				});
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
			}
		}
		new Banner();
	})
});




