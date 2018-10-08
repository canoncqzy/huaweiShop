require(["config"],function(){
	require(["jquery","header"],function($){
		
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
///*============================================================================================*/
////左边导航鼠标移入显示目录，事件委派
//var lis = $("li",$("#nav-left"));
//for (let i=0;i<lis.length;i++) {
//	//鼠标进入li触发事件
//	lis[i].onmouseenter=function(){
//		//获取当前li中ID
//		var _id = Number(lis[i].firstElementChild.innerText);
//		//字符串拼接二级菜单元素ID名
//		var elem = "#nav-window"+_id;
//		//设置显示
//		$(elem).style.display="block";
//		$(elem).onmouseenter = function(){
//			$(elem).style.display="block";
//		}
//		//ajax获取数据
//		ajax({
//			url:"http://rap2api.taobao.org/app/mock/86514/nav",
//			dataType:"json",
//			success:function(data){
//				if(data.res_code===1){
//					//遍历匹配id
//					data.res_body.info.forEach(curr=>{
//						if(curr.id===_id){
//							//字符串拼接二级菜单商品列表id
//							var list = "#nav-window-bottom-list"+_id;
//							//遍历显示商品列表信息
//							var html_list = "";
//							curr.product.forEach(curr=>{
//								html_list+=`<a href="#">
//												<li>
//													<div class="pic"><img src="${curr.img}"/></div>
//													<p>${curr.name}</p>
//													<p><span>￥${curr.price}</span></p>
//												</li>
//											</a>`;
//							});
//							$(list).innerHTML = html_list;
//						}
//					});
//				}
//			}
//		});
//	}
//	//鼠标移出li触发事件
//	lis[i].onmouseleave=function(){
//		var _id = Number(lis[i].firstElementChild.innerText);
//		var elem = "#nav-window"+_id;
//		$(elem).style.display="none";//设置隐藏
//		$(elem).onmouseleave = function(e){
//			$(elem).style.display="none";
//		}
//	}
//}