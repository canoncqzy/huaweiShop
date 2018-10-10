;
(function($) {
	// 轮播图构造函数
	function Carousel({imgs, width, height, duration, needTurnPage, circlePosition}) {
		this.imgs = imgs; // 所有轮播的图片的数组
		this.width = width; // 宽度
		this.height = height; // 高度
		this.length = imgs.length; // 图片张数
		this.container = null; // 轮播图容器
		this.duration = duration; // 轮播切换时间间隔
		this.needTurnPage = needTurnPage;//是否需要翻页
		this.circlePosition = circlePosition;//圆点位置
		
		this.lis = null; // 所有轮播的图片盒子
		this.circles = null; // 所有小圆
		this.prev = null; // 向前翻页按钮
		this.next = null; // 向后翻页按钮
		this.currentIndex = 0; // 当前正显示的图片索引
		this.nextIndex = 1; // 即将显示图片的索引
	}

	// 扩展 Carousel 的原型功能
	$.extend(Carousel.prototype, {
		// 初始化
		init: function(container) {
			// 创建DOM节点元素
			this.createDom(container);
			// 获取创建元素
			this.getEls();
			// 注册事件监听
			this.addListener();
			//是否需要翻页
			this.isNeedTurnPage();
			//小圆点位置
			this.cirPosition();
		},
		// 创建DOM结构
		createDom: function(container) {
			var imgs = this.imgs, 
				liHtml = "",
				iHtml = "";
			// 将轮播图布局的容器
			this.container = $(container);
				
			for (var i = 0, len = this.length; i < len; i++) {
				// 连接所有的 li 布局结构
				liHtml += `<li style="
										display: ${i == 0 ? 'block' : 'none'}; 
										width: ${this.width}px; 
										height: ${this.height}px;
										position: absolute;
										top: 0;
										left: 0;">
									<a href="${imgs[i].href}">
										<img src="${imgs[i].src}" style="
											width: ${this.width}px; 
											height: ${this.height}px;">
									</a>
								</li>`;
				// 连接所有的 i 布局结构
				iHtml += `<i style="
									display: inline-block; 
									width: 10px; 
									height: 10px; 
									border-radius: 5px; 
									background: ${i==0?'#ccc':'#fff'};
									margin: 5px;"></i>`;
			}
			// 布局HTML字符串
			var dom = `
				<ul style="
						list-style: none;
						position: relative;
						margin: 0;
						padding: 0;
						width: ${this.width}px; 
						height: ${this.height}px;">
					${liHtml}
				</ul>
				<div class="pages" style="
					width: ${this.width}px;
					height: 30px;
					position: absolute;
					bottom: 0;">
					${iHtml}
				</div>
				<div class="prev" style="
					width: 45px;
					height: 100px;
					background: rgba(0,0,0, .5);
					position: absolute;
					top: 0;
					bottom: 0;
					margin: auto;
					color: #fff;
					text-align: center;
					line-height: 100px;
					font-size: 50px;
					cursor: pointer;">&lt;</div>
				<div class="next" style="
					width: 45px;
					height: 100px;
					background: rgba(0,0,0, .5);
					position: absolute;
					top: 0;
					bottom: 0;
					right: 0;
					margin: auto;
					color: #fff;
					text-align: center;
					line-height: 100px;
					font-size: 50px;
					cursor: pointer;">&gt;</div>`;

			// 布局容器设置CSS样式，并将 HTML 字符串渲染进去
			this.container.css({
				width: this.width,
				height: this.height,
				overflow: "hidden",
				position: "relative"
			}).html(dom);
		},
		// 获取创建元素
		getEls: function() {
			this.lis = $("li", this.container); // 所有轮播的图片盒子
			this.circles = $("i", this.container); // 所有小圆
			this.prev = $(".prev", this.container); // 向前翻页按钮
			this.next = $(".next", this.container); // 向后翻页按钮
		},
		// 自动轮播
		autoPlay: function() {
			this.timer = setInterval($.proxy(this.move, this), this.duration);
		},
		// 轮播切换
		move: function() {
			// 当前显示的图片淡出
			$(this.lis[this.currentIndex]).fadeOut();
			// 即将显示的图片淡入
			$(this.lis[this.nextIndex]).fadeIn();
			// 修改小圆样式
			// 当前的小圆点去掉 "红色" 样式
			$(this.circles[this.currentIndex]).css({background: "#fff"});
			// 即将显示的图片对应小圆点添加 "红色" 样式
			$(this.circles[this.nextIndex]).css({background: "#ccc"});

			// 修改显示图片索引
			this.currentIndex = this.nextIndex;
			this.nextIndex++;
			if (this.nextIndex >= this.length) // 超过最后一张图片的索引，则还原为0
				this.nextIndex = 0;
		},
		// 添加事件监听
		addListener: function() {
			// 鼠标移入移出容器
			this.container.hover($.proxy(this.enterHandler, this), $.proxy(this.leaveHandler, this));
			// 鼠标移入小圆点
			this.circles.on("mouseover", $.proxy(this.overHandler, this));
			// 向前翻页
			this.prev.on("click", $.proxy(this.prevHandler, this));
			// 向后翻页
			this.next.on("click", $.proxy(this.nextHandler, this));
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
		// 向前翻页处理
		prevHandler: function() {
			// 即将显示图片的索引为：当前正显示索引-1
			this.nextIndex = this.currentIndex - 1;
			// 如果为负数，则设置为最后一张图片的索引
			if (this.nextIndex < 0)
				this.nextIndex = this.length - 1;
			// 切换
			this.move();
		},
		// 向后翻页处理
		nextHandler: function() {
			this.move();
		},
		//判断是否需要翻页
		isNeedTurnPage:function(){
			var isNeed = this.needTurnPage;
			if(!isNeed)
				$(".prev,.next").remove();
		},
		//圆点位置
		cirPosition:function(){
			if(this.circlePosition=="right")
				$(".pages").css("text-align","right");
			else if(this.circlePosition=="center")
				$(".pages").css("text-align","center");
			else
				$(".pages").css("text-align","left");
		}
	});

	// jQuery插件
	/*$.prototype.carousel = function() {}*/
	// 向 jQuery 原型中添加方法，即该方法可以被 jQuery 对象实例所调用
	/*$.fn.carousel = function(options) {
		this.each(function(index, element) {
			var c = new Carousel(options);
			c.init(element);
			c.autoPlay();
		});
	}*/
	$.fn.extend({
		carousel: function(options) {
			this.each(function(index, element) {
				var c = new Carousel(options);
				c.init(element);
				c.autoPlay();
			});
		}
	});

	// $.extend(object)
		// 给 jQuery 函数对象本身扩展功能，直接使用 jQuery 来调用，如：
		// $.extend({ max : function(array) {...}, min: function(array) {...}} );
		// 调用：   jQuery.max() 或 $.max()			jQuery.min() 或 $.min()
	// $.fn.extend(object);
		// 向 jQuery 原型中扩展功能，使用 jQuery 对象实例来调用这些扩展的功能，如：
		// $.fn.extend({zoom: function() {}, fly: function() {}, carousel: function(){} });
		// 调用： $(selector).zoom()   / 		$(selector).fly()

})(jQuery);
