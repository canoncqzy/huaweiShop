//配置短名称
require.config({
	baseUrl:"/",
	paths:{
		"jquery":"lib/jquery/jquery-1.12.4.min",
		"header":"js/header",
		"carousel":"lib/jquery-plugins/jquery.carousel",
		"template":"lib/art-template/template-web",
		"cartHeader":"js/cartHeader",
		"cookie":"lib/jquery-plugins/jquery.cookie"
	},
	shim: {
		"carousel": { // 为轮播插件指明依赖关系
			deps: ["jquery"]
		}
	}
});