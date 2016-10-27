<?php

header("Content-type:text/php;charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	getRTData();
}else if ($_SERVER["REQUEST_METHOD"] == "POST") {
	getHisData();
}

function getRTData(){
	if (!isset($_GET["Time"]) || empty($_GET["Time"])) {
		echo "参数错误";
		return;
	}

	$conn = mysql_connect("localhost","root","boboxiao3724");
	if (!$conn) {
		die('Could not connect:'.mysql_error());
		echo "Could not connect";
		return;
	}

	mysql_select_db("temphumidata",$conn);
	$result = mysql_query("select * from rtdata order by id desc limit 0,1");
	$row = mysql_fetch_array($result);
	$_RTData = new stdClass();
	$_RTData->temp = $row['temperature'];
	$_RTData->humi = $row['humidity'];
	echo json_encode($_RTData);
	mysql_close($conn);
}

function getHisData(){
	if(!isset($_POST["from"]) || empty($_POST["from"]) || !isset($_POST["to"]) || empty($_POST["to"])){
		echo "参数有误";
		return;
	}

	$time_from = $_POST["from"];
	$time_to = $_POST["to"];

	/*连接数据库*/
	$conn = mysql_connect("localhost","root","boboxiao3724");
	if (!$conn) {
		die('Could not connect:'.mysql_error());
		echo "Could not connect";
		return;
	}

	mysql_select_db("temphumidata",$conn);
	$sqlstr = "select * from htdata where time >='".$time_from."' and time<='".$time_to."'";
	$result = mysql_query($sqlstr);

	$json = "[";
	$index = 1;
	while ($row = mysql_fetch_array($result)) {
		$json = $json ."{\"temp\":".$row['temperature'].",\"humi\":".$row['humidity'].",\"time\":"."\"".$row['time']."\"},";
	}

	$json = $json ."{}]";

	echo $json;
	mysql_close($conn);
	return;
}

?>