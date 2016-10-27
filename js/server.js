
/*鼠标滚动标记*/
var flag = true;
var scroll = true;

/*循环标记*/
var startID;

window.onload = function(){

	/*设置侧边栏效果*/
	Toolbar();

	/*定义页面滚动是否可用*/
	var listcontent = document.getElementById("list-content");
	listcontent.onmouseover = function(){scroll = false;}
	listcontent.onmouseout = function(){scroll = true;}

	/*设置鼠标滚动事件*/
	if (document.addEventListener) {
		document.addEventListener('DOMMouseScroll',scrollFunc,false);
	}
	window.onmousewheel = document.onmousewheel = scrollFunc;

	/*设置开关状态事件*/
	document.getElementById("swi-check").onclick=function(){
		if (this.checked == false) {
			document.getElementById("swi-inner").innerHTML = "OFF";
			startID = window.clearInterval(startID);
		}else if (this.checked == true) {
			document.getElementById("swi-inner").innerHTML = "ON";
			startID = window.setInterval(getRTData,1000);
		}
	}

	/*时间选择器*/
	var begin = document.getElementById("time-begin");
	var end = document.getElementById("time-end");

	begin.oninput = function(){getTime(begin,end);}
	end.oninput = function(){getTime(begin,end);}

}

function Toolbar(){
	var home = document.getElementById("home");
	var history = document.getElementById("history");
	var advise = document.getElementById("advise");
	var top = document.getElementById("top");

	home.onmouseover = function(){highToolbar()};
	home.onmouseout = function(){lowToolbar()};

	history.onmouseover = function(){highToolbar()};
	history.onmouseout = function(){lowToolbar()};

	advise.onmouseover = function(){highToolbar()};
	advise.onmouseout = function(){lowToolbar()};

	top.onmouseover = function(){highToolbar()};
	top.onmouseout = function(){lowToolbar()};
	top.onclick = function(){backtop()};
}

function backtop(){
	document.getElementById("home").checked = true;
}

function highToolbar(){

	var home = document.getElementById("a-home");
	var history = document.getElementById("a-history");
	var advise = document.getElementById("a-advise");
	var top = document.getElementById("a-top");

	home.style.opacity = "1";
	history.style.opacity = "1";
	advise.style.opacity = "1";
	top.style.opacity = "1";
}

function lowToolbar(){

	var home = document.getElementById("a-home");
	var history = document.getElementById("a-history");
	var advise = document.getElementById("a-advise");
	var top = document.getElementById("a-top");

	home.style.opacity = "0.3";
	history.style.opacity = "0.3";
	advise.style.opacity = "0.3";
	top.style.opacity = "0.3";
}


var scrollFunc = function(e){
	e = e || window.event;

	flag = !flag;

	if(flag && scroll){
		/*此处设置事件*/
		changeRadio(e.wheelDelta);
	}
}

function changeRadio(mark){
	var rad1 = document.getElementById("home");
	var rad2 = document.getElementById("history");
	var rad3 = document.getElementById("advise");

	var radios = new Array();
	radios[0] = rad1;
	radios[1] = rad2;
	radios[2] = rad3;

	var i = 0;
	for (; i < radios.length; i++) {
		if (radios[i].checked) {
			change(mark,radios,i);
			break;
		}
	}
	if (i==3) {
		change(mark,radios,0);
	}
}

function change(mark,radios,index){

	if (mark>0&&index!=0) {
		radios[index-1].checked=true;
	}
	if (mark<0&&index!=2) {
		radios[index+1].checked=true;
	}
}

/*获取实时数据*/
function getRTData(){

	var xmlRequest;
	if (window.XMLHttpRequest) {
		xmlRequest = new XMLHttpRequest();
	}else{
		xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlRequest.open("GET","php/humitureServer.php?Time=NOW" + randomString(10));
	xmlRequest.send();

	xmlRequest.onreadystatechange = function(){
		if (xmlRequest.readyState === 4&&xmlRequest.status === 200) {
			var jsonData = xmlRequest.responseText;

			var json = JSON.parse(jsonData);
			document.getElementById("tempdata").innerHTML = json.temp;
			document.getElementById("humidata").innerHTML = json.humi;

			console.log(json.temp+"  "+json.humi);
		}
	}
}

/*获取输入的时间*/
function getTime(begin,end){
	var time_from = (begin.value).replace(/T/," ");
	var time_to = (end.value).replace(/T/," ");

	if (time_from != ""&&time_to != ""&&time_to >= time_from) {
		getHisData(time_from,time_to);
	}
}

/*获取历史数据*/
function getHisData(time_from,time_to){
	var xmlRequest;
	if (window.XMLHttpRequest) {
		xmlRequest = new XMLHttpRequest();
	}else{
		xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}

	var postData = "from=" + time_from + "&to=" + time_to;

	xmlRequest.open("POST","php/humitureServer.php");
	xmlRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlRequest.send(postData);

	xmlRequest.onreadystatechange = function(){
		if (xmlRequest.readyState === 4 && xmlRequest.status === 200) {
			var str_his = xmlRequest.responseText;
			console.log(str_his);

			var json_his = JSON.parse(str_his);

			showInForm(json_his);
		}
	}
}

/*产生随机字符串以避免缓存*/
function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

function showInForm(json_his){

	var datalist = document.getElementById("datalist");
	var data_temp;
	var data_humi;
	var data_time;

	var length = datalist.getElementsByTagName("li").length;
	/*删除原有记录*/
	if (length != 0) {
		datalist.innerHTML = "";
	}

	/*从新格式化数据长度*/
	length = json_his.length - 1;
	length = length * 2;
	var index = 0;
	for (var i = 0; i < length; i++) {
		var li = document.createElement("li");
		data_temp = document.createElement("data-temp");
		data_temp.id = "data-temp";
		data_humi = document.createElement("data-humi");
		data_humi.id = "data-humi";
		data_time = document.createElement("data-time");
		data_time.id = "data-time";

		if (i % 2 == 1) {
			var temperature = json_his[index].temp;
			var humidity = json_his[index].humi;
			var time = json_his[index].time;
			index ++;

			data_temp.innerHTML = temperature + "℃";
			data_humi.innerHTML = humidity + "%";
			data_time.innerHTML = time;

			li.style.backgroundColor = "#969696";
		}

		datalist.appendChild(li);
		li.appendChild(data_temp);
		li.appendChild(data_humi);
		li.appendChild(data_time);
	}
}