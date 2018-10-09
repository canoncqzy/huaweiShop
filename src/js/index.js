require(["config"],function(){
	require(["jquery","header"],function($){
		function Index(){
			this.showNavWindow();
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
			banner:function(){
				
			}
		}
		new Index();
	})
});




//banner轮播
//var banners = $("li",$(".banner")[0]),//所有图片盒子
//	lenght = banners.length,//图片张数
//	currentIndex = 0,//当前图片索引
//	nextIndex = 1,//下一张图片索引
//	circles = $("span",$(".circle")[0]);//圆点
//
////生成小圆点个数
//var html="";
//for (var i=0;i<banners.length;i++) {
//	html+=`<span class="current"></span>`;
//}
////显示小圆点
//$(".circle")[0].innerHTML = html;
////默认为第一个小圆点
//circles[0].style.opacity=1;
//
////图片轮播切换函数
//function move(){
//	//当前显示图片淡出
//	fadeOut(banners[currentIndex],300);
//	//下一张图片淡入
//	fadeIn(banners[nextIndex],300);
//	//修改小圆点样式
//	circles[currentIndex].style.opacity=0.3;
//	circles[nextIndex].style.opacity=1;
//	//修改显示图片索引
//	currentIndex = nextIndex;
//	nextIndex ++;
//	if(nextIndex >= lenght)
//		nextIndex = 0;
//}
////自动轮播
//var timer = setInterval(move,3000);
//
////鼠标移入停止/重启计时器
//$(".banner")[0].onmouseenter=function(){
//	clearInterval(timer);
//}
//$(".banner")[0].onmouseleave=function(){
//	timer = setInterval(move,3000);
//}
//
////鼠标移入小圆点,移动相应图片
////事件委派
//$(".circle")[0].onmouseover=function(event){
//	//事件源
//	var src = event.target;
//	if(src.nodeName==="SPAN"){
//		//获取当前移入小圆点坐标
//		var index = Array.from(circles).indexOf(src);
//		//判断当前下标是否一样
//		if(index===currentIndex)
//			return;
//		//将当前下标赋给下一张图片坐标
//		nextIndex = index;
//		//调用move()
//		move();
//	}
//}
