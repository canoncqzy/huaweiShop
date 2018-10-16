<?php
	// 允许跨域资源访问：CORS
	header("Access-Control-Allow-Origin:*");
	// 从 POST 请求中获取注册用户信息
	$userName = $_POST["userName"];
	$password = $_POST["password"];

	/* 保存到数据库中 */
	$conn = mysqli_connect("localhost", "root", "123456", "huawei");

	// SQL
	$sql = "INSERT INTO users (userName,password) VALUES ('$userName', '$password')";
	// 执行SQL
	$result = mysqli_query($conn, $sql);
	// 判断执行结果
	if ($result){
		$arr = array("res_code"=>1, "res_message"=>"success");
		echo json_encode($arr);
	}
	else{
		$arr = array("res_code"=>-1, "res_message"=>"failed：" . mysqli_error($conn));
		echo json_encode($arr);
	}

	// 关闭数据库连接
	mysqli_close($conn);
?>