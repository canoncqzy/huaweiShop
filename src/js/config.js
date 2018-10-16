//配置短名称
require.config({
	baseUrl:"/",
	paths:{
		"jquery":"lib/jquery/jquery-1.12.4.min",
		"header":"js/header",
		"rightNav":"js/rightNav",
		"carousel":"lib/jquery-plugins/jquery.carousel",
		"template":"lib/art-template/template-web",
		"cartHeader":"js/cartHeader",
		"cookie":"lib/jquery-plugins/jquery.cookie",
		"zoom": "lib/jquery-plugins/jquery.elevatezoom",
		"fly": "lib/jquery-plugins/jquery.fly"
	},
	shim: {
		"carousel": { // 为轮播插件指明依赖关系
			deps: ["jquery"]
		},
		"zoom": { // 为放大镜插件指明依赖关系
			deps: ["jquery"]
		},
		"fly": {
			deps: ["jquery"]
		}
	}
});