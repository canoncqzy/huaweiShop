require(["config"],function(){
	require(["jquery","cookie"],function($){
		function Login(){
			this.addListener();
		}
		$.extend(Login.prototype,{
			//事件监听
			addListener:function(){
				$(".login_sub").on("click", $.proxy(this.loginHandler, this));
			},
			//登录处理
			loginHandler:function(){
				// 获取表单中待提交的数据，序列化
				var data = {
					userName: $(".login-userName").val(),
					password:$(".login-password").val()
				};
				var url = "http://localhost/huawei_liu/api/login.php";
				$.post(url, data, this.loginSuccessHandler, "json");
				return false;
			},
			// 登录提交 ajax 请求成功的回调
			loginSuccessHandler: function(data) {
				if (data.res_code === 1) { // 登录成功
					// 将登录成功的用户信息保存到 cookie 中
					$.cookie.json = true;
					$.cookie("login-user", data.res_body.userName, {path: "/"});
					// 跳转页面
					location = "/";
				} else { // 登录失败
					$(".login-error").show();
				}
			}
		});
		new Login();
	})
});