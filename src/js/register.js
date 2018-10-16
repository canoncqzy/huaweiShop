require(["config"],function(){
	require(["jquery"],function($){
		function Register(){
			this.loadVerificationCode();
			this.addListener();
		}
		$.extend(Register.prototype,{
			loadVerificationCode:function(){
				$.ajax("http://route.showapi.com/26-4?showapi_appid=75561&showapi_sign=d3ca4cda5ed4484cae942ada741230f4&image_width=100&image_height=44&textproducer_char_length=4&textproducer_char_string")
					.done(function(data){
						var answer = data.showapi_res_body.text;
						console.log(answer);
						//显示验证码图
						$(".veriCodePic").attr("src",data.showapi_res_body.img_path);
						//判断验证码是否输入正确
						$(".verification-code").blur(function(){
							var veriCode = $(".verification-code").val();
							console.log(veriCode);
							//判断
							if(answer != veriCode)
								$(".verification-code-error").show();
							else
								$(".verification-code-error").hide();
						});
					});
			},
			addListener:function(){
				$(".phoneNumber").blur(this.phoneNumberHandler);
				//密码验证
				$(".password").blur(this.passwordHandler);
				$(".password-twice").blur(this.passwordCheckHandler);
				//点击注册事件
				$(".reg_submit").on("click", $.proxy(this.registerHandler, this));
			},
			phoneNumberHandler:function(){
				var phoneNumber = $(".phoneNumber").val(),
					reg = /^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/;
				if(!reg.test(phoneNumber))//手机号不正确
					$(".phoneNumber-error").show();
				else
					$(".phoneNumber-error").hide();
			},
			passwordHandler:function(){
				var password = $(".password").val(),
					reg = /^[a-zA-Z]\w{5,17}$/;//字母开头，长度6-18之间，字母数字下划线
				if(!reg.test(password))//手机号不正确
					$(".password-error").show();
				else
					$(".password-error").hide();
			},
			passwordCheckHandler:function(){
				var password = $(".password").val(),
					passwordTwice = $(".password-twice").val();
				if(password!=passwordTwice)
					$(".password-twice-error").show();
				else
					$(".password-twice-error").hide();
			},
			registerHandler:function(){
				//判断没有错误时提交表单信息
				var phoneNumber_error = $(".phoneNumber-error").css("display"),
					verification_code_error = $(".verification-code-error").css("display"),
					password_error = $(".password-error").css("display"),
					password_twice_error = $(".password-twice-error").css("display");
				if(phoneNumber_error=="none"&&verification_code_error=="none"&&password_error=="none"&&password_twice_error=="none"){
					//获取用户名密码
					var data = {
							userName:$(".phoneNumber").val(),
							password:$(".password").val()
						}
					// ajax 提交注册数据
					var url = "http://localhost/huawei_liu/api/register.php";
					$.post(url, data, this.regSuccessHandler, "json");
				}
				return false;
			},
			regSuccessHandler:function(data){
				if (data.res_code === 1) { // 注册成功
					location = "/html/login.html";
				} else { // 注册失败
					alert("注册失败！");
				}
			}
		});
		new Register();
	})
})
