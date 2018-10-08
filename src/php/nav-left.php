<?php
	$title = $_GET["title"];
	$arr = array("res_code"=>1,"res_message"=>"","res_body"=>"{'title:'.$title,'tags:'.}");
	if($title==="aaa"){
		echo json_encode($arr);
	}
?>