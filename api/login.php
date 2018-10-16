<?php 
	// 允许跨域资源访问：CORS
	header("Access-Control-Allow-Origin:*");
	// 从 POST 请求中获取登录的用户名与密码
	$userName = $_POST["userName"];
	$password = $_POST["password"];

	/* 验证数据库中是否有登录的用户信息 */
	$conn = mysqli_connect("localhost", "root", "123456", "huawei");

	// SQL
	$sql = "SELECT * FROM users WHERE userName='$userName' AND password='$password'";

	// 执行SQL
	$result = mysqli_query($conn, $sql);

	// 判断
	if (mysqli_num_rows($result) === 1) {
		// 获取查询结果集中的记录
		$row = mysqli_fetch_assoc($result);
		$arr = array("res_code"=>1, "res_message"=>"success", "res_body"=>$row);
		echo json_encode($arr);
	} else { // 用户名或密码错误
		$arr = array("res_code"=>-1, "res_message"=>"error");
		echo json_encode($arr);
	}

	// 关闭
	mysqli_close($conn);
 ?>