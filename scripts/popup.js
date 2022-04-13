
//chrome.storage.local.set({'GB_bcs': true});	/* GB_bcs */
chrome.storage.local.set({'GB_bcs': false});	/* GB_bcs */

var bLoad=true;
var status=-1;
var mcode='';
var query='';
var VL='';
var PlayTime=0;
var LogIn=0;
var Subscribe=0;
var Like=0;
var LogCnt=0;
var PlayEnd=0;
var cnt=-1;
var AC='';
var ED='';
var dd=0;

var TID=-1;
var WCR='';
var WCM=0;
var TRT='';
var MCL='';
var PVL='';
var QRY='';
var STA='';
var URL='';
var VPT='';
var LIN='';
var SUB='';
var LIK='';
var CPP='';
var TCH='';

var MC=new Array();	/* 시청할 채녈 목록 */

var LOG_URL='';


navigator.serviceWorker.getRegistrations().then((res) => {
	for (let worker of res) {
		console.log(worker)
		if (worker.active.scriptURL.includes('/scripts/background.js')) {
			return
		}
	}

	navigator.serviceWorker
	.register(chrome.runtime.getURL('/scripts/background.js'))
	.then((registration) => {
		console.log('Service worker success:', registration)
	}).catch((error) => {
		console.log('Error service:', error)
	})
});


/* 타겟 변경이벤트 시작/종료 ----------------------------------------------- */
function ch_target(){
	QRY = document.getElementById("q").innerHTML;
	TCH = document.getElementById("t").innerHTML;

	if (QRY=="" || TCH==""){
		disabled_start();
	}else{
		enabled_start();
	}
}
/* 끝 ------------------------------------------------------- */


/* 검색어 변경이벤트 시작/종료 ----------------------------------------------- */
function ch_query(){
	QRY = document.getElementById("q").innerHTML;
	TCH = document.getElementById("t").innerHTML;

	if (QRY=="" || TCH==""){
		disabled_start();
	}else{
		enabled_start();
	}
}
/* 끝 ------------------------------------------------------- */


/* 검사 시작/종료 ----------------------------------------------- */
function start(){

	var btnstart = document.getElementById("start").value;
	if (0==WCM){ /* 패널(0) */
		/* YT_SW */
		chrome.storage.local.get('YT_SW', function(result){
			if (result.YT_SW===undefined){
				QRY='';
			}else{
				QRY=result.YT_SW;

				/* YT_CN */
				chrome.storage.local.get('YT_CN', function(result1){
					if (result1.YT_CN===undefined){
					}else{
						TCH=result1.YT_CN;
					}
				});
			}
		});
	}else{ /* 서버(1) */
		QRY = "";
		TCH = "";
	}

	if ("START" == btnstart){
		document.getElementById("start").value = "STOP";

		chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){
			TID = tabs[0].id;

			chrome.storage.local.set({'GB_TID': TID});
		});

		setTimeout(function() { SM_start(); }, 10 );
	}else{
		document.getElementById("start").value = "START";

		chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){
			 TID = tabs[0].id;
		});

		setTimeout(function() { SM_stop(); }, 10 );
	}
}
/* 끝 ------------------------------------------------------- */


/* 검사 시작 메시지 ---------------------------------------------- */
function SM_start(){

	_DEBUG_Print("PS_START ==> " + TID);

	/* send msg : popup => background */
	chrome.runtime.sendMessage(
		{
			msg: 'PS_START',
			data: {
				tid: String(TID),
				WCM: String(WCM),
				QRY: QRY,
				TCH: TCH
			}
		}, (response)=>{}
	);

	setTimeout(function() { SM_Check(); }, 1000 );

}
/* 끝 ------------------------------------------------------- */


/* 검사 종료 메시지 ---------------------------------------------- */
function SM_stop(){

	_DEBUG_Print("PS_STOP ==> " + TID);

	/* 메시지 보내기 : popup => background */
	chrome.runtime.sendMessage(
		{
			msg: 'PS_STOP',
			data: {
				tid: String(TID)
			}
		}, (response)=>{}
	);
}
/* 끝 ------------------------------------------------------- */


/* 검사 실행확인 메시지 ------------------------------------------- */
function SM_Check(){

//	_DEBUG_Print("SM_Check() ==> " + TID);

	/* 메시지 보내기 : popup => background */

	chrome.runtime.sendMessage(
		{
			msg: 'PS_CHECK',
			data: {
				tid: TID
			}
		}, (response)=>{}
	);

}
/* 끝 ------------------------------------------------------- */


/* 검사 설정 확인 ----------------------------------------------- */
function SM_connect(){

	var w_code = document.getElementById("code").value;
	if (w_code==""){
		alert('Please enter your CODE.');
		return;
	}

	var w_id = document.getElementById("id").value;
	if (w_id==""){
		alert('Please enter your ID.');
		return;
	}

	var chk_url="http://y.irank.kr/appl/json_chkid.php" +
				"?md=c" +
				"&pn=" + btoa(w_id) +
				"&gm=" + btoa(w_code);

	_DEBUG_Print("SM_connect() : " + chk_url);

	$.ajax({
		url: chk_url,
		dataType:'text',
		type:'get',
		async:'false',
		success : function (data){

			RET=JSON.parse(data).RET;
			MSG=JSON.parse(data).MSG;
			AC=JSON.parse(data).AC;
			ED=JSON.parse(data).ED;

			_DEBUG_Print("AC : " + AC);
			_DEBUG_Print("RET : " + RET);

			if ("1"==AC){

				if ("1"==RET){
					chrome.storage.local.set({'YT_WC': w_code});
					chrome.storage.local.set({'YT_ID': w_id});
					chrome.storage.local.set({'YT_ED': ED});

					chrome.storage.local.get('YT_WC', function(result){
						document.getElementById("code").value = result.YT_WC;
					});

					chrome.storage.local.get('YT_ID', function(result){
						document.getElementById("id").value = result.YT_ID;
					});

					var strArr = ED.split('-');
					var edate = new Date(strArr[0], strArr[1]-1, strArr[2]);
					var cdate = new Date();

					var interval = (edate.getTime() - cdate.getTime())/1000;
					dd = parseInt(interval/(24*60*60));

					if (0<dd){ /* 실행 모드 : 서버(1) */
						WCM=1;

						enabled_start();
						disabled_target();
						disabled_query();

						$( "#share" ).checkboxradio( "enable" );

				_DEBUG_Print("disabled : " + false);

						document.getElementById("connect").value="Disconnect...";
					}else{ /* 실행 모드 : 패널(0) */
						WCM=0;

						disabled_start();
						enabled_target();
						enabled_query();

						if ("-1"==RET){
							alert("The period of use has expired!\nPlease use after extension!");
						}
					}
				}else if ("-2"==RET){
					document.getElementById("code").value="";
					document.getElementById("id").value="";

					alert("The requested device is already in use.\nPlease use another device!");
				}else{
					document.getElementById("code").value="";
					document.getElementById("id").value="";

					alert("The period of use has expired!\nPlease use after extension!");
				}
			}else{ /* 실행 모드 : 패널(0) */
				WCM=0;

				disabled_start();
				enabled_target();
				enabled_query();

				chrome.storage.local.set({'YT_SS': 0});

				$( "#share" ).checkboxradio( "disable" );

			_DEBUG_Print("disabled : " + true);
				document.getElementById("code").value="";
				document.getElementById("id").value="";


				if ("0"==AC){
					alert("Access denied!\nPlease try again after access permission!");
				}else{
					if ("-1"==RET){
						alert("The period of use has expired!\nPlease use after extension!");
						alert("Please use the available CODE and ID!");
					}
				}
			}
//			setTimeout(function() { go_youtube(); }, 3000 );

		},
		error : function(request, status, error) {

		}
	});
}
/* 끝 ------------------------------------------------------- */


/* 검사 설정 확인 ----------------------------------------------- */
function SM_disconnect(){

	var w_code = document.getElementById("code").value;
	if (w_code==""){
		return;
	}

	var w_id = document.getElementById("id").value;
	if (w_id==""){
		return;
	}

	var chk_url="http://y.irank.kr/appl/json_chkid.php" +
				"?md=d" +
				"&pn=" + btoa(w_id) +
				"&gm=" + btoa(w_code);

	_DEBUG_Print("SM_disconnect() : " + chk_url);

	$.ajax({
		url: chk_url,
		dataType:'text',
		type:'get',
		async:'false',
		success : function (data){

			AC=JSON.parse(data).AC;
			ED=JSON.parse(data).ED;

			_DEBUG_Print("AC : " + AC);

			document.getElementById("connect").value="Connect...";
			document.getElementById("code").value="";
			document.getElementById("id").value="";

			chrome.storage.local.remove('YT_WC',function() {
				// Your code
				// This is an asyn function
			});
			chrome.storage.local.remove('YT_ID',function() {
				// Your code
				// This is an asyn function
			});
			chrome.storage.local.remove('YT_ED',function() {
				// Your code
				// This is an asyn function
			});

			chrome.storage.local.set({'YT_SS': 0});

			$('#share').checkboxradio();
			$('#share').prop('checked',false).checkboxradio('refresh')

			$( "#share" ).checkboxradio( "disable" );

			_DEBUG_Print("connect() disabled : " + true);


		},
		error : function(request, status, error) {

		}
	});
}
/* 끝 ------------------------------------------------------- */


/* 검사 설정 타이머 ---------------------------------------------- */
function connect(){

	var c_mode = document.getElementById("connect").value;
	if ("Disconnect..."==c_mode){

		setTimeout(function() { SM_disconnect(); }, 10 );
	}else{
		var w_code = document.getElementById("code").value;
		if (w_code==""){
			alert('Please enter your CODE.');
			return;
		}

		var w_id = document.getElementById("id").value;
		if (w_id==""){
			alert('Please enter your ID.');
			return;
		}

		setTimeout(function() { SM_connect(); }, 10 );
	}
}
/* 끝 ------------------------------------------------------- */


/* 초를 시:분:초로 변환 -------------------------------------------- */
function time_str(seconds) {
	//3항 연산자를 이용하여 10보다 작을 경우 0을 붙이도록 처리 하였다.
	var hour = parseInt(seconds/3600) < 10 ? '0'+ parseInt(seconds/3600) : parseInt(seconds/3600);
	var min = parseInt((seconds%3600)/60) < 10 ? '0'+ parseInt((seconds%3600)/60) : parseInt((seconds%3600)/60);
	var sec = seconds%60 < 10 ? '0'+seconds%60 : seconds%60;

	//연산한 값 리턴
	var ret = hour+":"+min+":" + sec;

	return ret;
}
/* 끝 ------------------------------------------------------- */


/* 초를 시:분:초로 변환 -------------------------------------------- */
function time2str(seconds) {

	//연산한 값 리턴
	var ret = "";
	if (seconds>1000000000000){
		let num = seconds/1000000000.0;
		ret = num.toFixed(1) + "G";
	}else if (seconds>1000000){
		let num = seconds/1000000.0;
		ret = num.toFixed(1) + "M";
	}else if (seconds>1000){
		let num = seconds/1000.0;
		ret = num.toFixed(1) + "K";
	}else{
		ret = seconds.toFixed();
	}

	return ret;
}
/* 끝 ------------------------------------------------------- */


/* 상태정보 갱신 ------------------------------------------------ */
function updatestatus(){

	if(WCM){
		if (MCL=="1"){
			document.getElementById("t").innerHTML=MCL+" channels.";
		}else{
			document.getElementById("t").innerHTML=MCL+" channel.";
		}
	}else{
		document.getElementById("t").innerHTML=TCH;
	}
	document.getElementById("q").innerHTML=QRY;
	document.getElementById("p").innerHTML=PVL;
	document.getElementById("s").innerHTML=time_str(Number(TRT));

	if ('1'==STA){
		document.getElementById("ytstatus").innerHTML="Connecting.";
	}else if ('2'==STA){
		document.getElementById("ytstatus").innerHTML="Connecting.";
	}else if ('3'==STA){
		document.getElementById("ytstatus").innerHTML="milarian kutu.";
	}else if ('4'==STA){
		document.getElementById("ytstatus").innerHTML="milarian kutu.";
	}else if ('5'==STA){
		document.getElementById("ytstatus").innerHTML="milarian kutu.";
	}else if ('6'==STA){
		document.getElementById("ytstatus").innerHTML="antosan";
	}else if ('7'==STA){
		document.getElementById("ytstatus").innerHTML="Playing.["+time_str(Number(VPT))+"]";
	}else if ('8'==STA){
		document.getElementById("ytstatus").innerHTML="Ended watching.["+time_str(Number(VPT))+"]";
		enabled_start();
		document.getElementById("start").value = "START";
	}else{
		document.getElementById("ytstatus").innerHTML="antosan.";
	}


	if ('1'==LIN){
		document.getElementById("ytlogin").innerHTML=": OK";
	}else{
		document.getElementById("ytlogin").innerHTML=": antosan";
	}

	if ('1'==SUB){
		document.getElementById("ytsubscribe").innerHTML=": OK";
	}else{
		document.getElementById("ytsubscribe").innerHTML=": antosan";
	}

	if ('1'==LIK){
		document.getElementById("ytlike").innerHTML=": OK";
	}else{
		document.getElementById("ytlike").innerHTML=": antosan";
	}

	document.getElementById("yturl").innerHTML=URL;

	if ('1'==WCR) {
		if ('8'==STA){
			document.getElementById("start").value = "START";
		}else{
			document.getElementById("start").value = "STOP";
		}

		setTimeout(function() { SM_Check(); }, 1000 );
	}else{
		document.getElementById("start").value = "START";
	}

	if(WCM){
		chrome.storage.local.get('GB_MYS', function(result){
			if (result.GB_MYS===undefined){
				$("#msr").html('-');
			}else{
				$("#msr").html(time2str(Number(result.GB_MYS)));
			}
		});

		chrome.storage.local.get('GB_MYL', function(result){
			if (result.GB_MYL===undefined){
				$("#mlr").html('-');
			}else{
				$("#mlr").html(time2str(Number(result.GB_MYL)));
			}
		});

		chrome.storage.local.get('GB_MYC', function(result){
			if (result.GB_MYC===undefined){
				$("#mvr").html('-');
			}else{
				$("#mvr").html(time2str(Number(result.GB_MYC)));
			}
		});

		chrome.storage.local.get('GB_MYW', function(result){
			if (result.GB_MYW===undefined){
				$("#mtr").html('-');
			}else{
				$("#mtr").html(time2str(Number(result.GB_MYW)));
			}
		});
	}else{
		chrome.storage.local.get('LV_MYS', function(result){
			if (result.LV_MYS===undefined){
				$("#msr").html('-');
			}else{
				$("#msr").html(time2str(Number(result.LV_MYS)));
			}
		});

		chrome.storage.local.get('LV_MYL', function(result){
			if (result.LV_MYL===undefined){
				$("#mlr").html('-');
			}else{
				$("#mlr").html(time2str(Number(result.LV_MYL)));
			}
		});

		chrome.storage.local.get('LV_MYC', function(result){
			if (result.LV_MYC===undefined){
				$("#mvr").html('-');
			}else{
				$("#mvr").html(time2str(Number(result.LV_MYC)));
			}
		});

		chrome.storage.local.get('LV_MYW', function(result){
			if (result.LV_MYW===undefined){
				$("#mtr").html('-');
			}else{
				$("#mtr").html(time2str(Number(result.LV_MYW)));
			}
		});
	}

	chrome.storage.local.get('GB_SHS', function(result){
		if (result.GB_SHS===undefined){
			$("#ssr").html('-');
		}else{
			$("#ssr").html(time2str(Number(result.GB_SHS)));
		}
	});

	chrome.storage.local.get('GB_SHL', function(result){
		if (result.GB_SHL===undefined){
			$("#slr").html('-');
		}else{
			$("#slr").html(time2str(Number(result.GB_SHL)));
		}
	});

	chrome.storage.local.get('GB_SHC', function(result){
		if (result.GB_SHC===undefined){
			$("#svr").html('-');
		}else{
			$("#svr").html(time2str(Number(result.GB_SHC)));
		}
	});

	chrome.storage.local.get('GB_SHW', function(result){
		if (result.GB_SHW===undefined){
			$("#str").html('-');
		}else{
			$("#str").html(time2str(Number(result.GB_SHW)));
		}
	});

}
/* 끝 ------------------------------------------------------- */


/* 상태정보 갱신 ------------------------------------------------ */
function LoadStorage(){

	/* YT_SS */
	chrome.storage.local.get('YT_SS', function(result){
		if (result.YT_SS===undefined){
			$("#share").attr('checked', true);
		}else{
			if (result.YT_SS===0){
				$('#share').checkboxradio();
				$('#share').prop('checked',false).checkboxradio('refresh')
			}else{
				$('#share').checkboxradio();
				$('#share').prop('checked',true).checkboxradio('refresh')
			}
		}
	});

	/* YT_WL */
	chrome.storage.local.get('YT_WL', function(result){
		if (result.YT_WL===undefined){
			$("#watchlimit").attr('checked', false);
		}else{
			if (result.YT_WL===0){
				$('#watchlimit').checkboxradio();
				$('#watchlimit').prop('checked',false).checkboxradio('refresh')
			}else{
				$('#watchlimit').checkboxradio();
				$('#watchlimit').prop('checked',true).checkboxradio('refresh')
			}
		}
	});

	/* YT_TL */
	chrome.storage.local.get('YT_TL', function(result){
		if (result.YT_TL===undefined){
//			$('#timelimit').selectmenu("value", "Unlimited");
		}else{
			if (-1==result.YT_TL){
//				$('#timelimit').selectmenu("value", "제한없음");
			}else{
				$('#timelimit').val(result.YT_TL);
			}

			if (!bLoad){
				$('#timelimit').selectmenu("refresh");
			}
		}
	});

	/* YT_RS */
	chrome.storage.local.get('YT_RS', function(result){
		if (result.YT_RS===undefined){
//			$('#resettime').selectmenu("value", "24시간");
		}else{
			if (-1==result.YT_RS){
//				$('#resettime').selectmenu("value", "24시간");
			}else{
				$('#resettime').val(result.YT_RS);
			}

			if (!bLoad){
				$('#resettime').selectmenu("refresh");
			}
		}
	});

	/* YT_SW */
	chrome.storage.local.get('YT_SW', function(result){
		if (result.YT_SW===undefined){
			document.getElementById("q1").value="";
		}else{
			document.getElementById("q1").value=result.YT_SW;
		}
	});

	/* YT_CN */
	chrome.storage.local.get('YT_CN', function(result){
		if (result.YT_CN===undefined){
			document.getElementById("t1").value="";
		}else{
			document.getElementById("t1").value=result.YT_CN;
		}
	});
}
/* 끝 ------------------------------------------------------- */


//////////////////////////////////////////////////////////////////////////////////////////
/* background script로부터 메시지 받기 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){

		switch( request.msg ){
			case 'BS_START_ACK':

				_DEBUG_Print(request.msg + " : " + request.data.tid);

				setTimeout(function() { SM_Check(); }, 1000 );

				break;

			case 'PS_CHECK_ACK':

				WCR=request.data.WCR;
				TRT=request.data.TRT;
				PVL=request.data.PVL;
				QRY=request.data.QRY;
				MCL=request.data.MCL;
				STA=request.data.STA;
				VPT=request.data.VPT;
				LIN=request.data.LIN;
				SUB=request.data.SUB;
				LIK=request.data.LIK;
				CPP=request.data.CPP;
				TCH=request.data.TCH;

				if (""==request.data.URL){
					URL="http://";
				}else{
					URL=request.data.URL;
				}

				chrome.storage.local.get('GB_query', function(result) {
					if (result.GB_query===undefined){
						QRY='';
					}else{
						QRY=result.GB_query;
					}
					_DEBUG_Print("GB_query: " + result.GB_query);
				}); /* GB_query */

				chrome.storage.local.get('GB_FL', function(result1){
					_DEBUG_Print("GB_FL: " + result1.GB_FL);
					URL=result1.GB_FL;
				}); /* GB_FL */

/*
				_DEBUG_Print(request.msg + " WCR : " + request.data.WCR);
				_DEBUG_Print(request.msg + " MCL : " + request.data.MCL);
				_DEBUG_Print(request.msg + " TID : " + request.data.TID);
				_DEBUG_Print(request.msg + " QRY : " + request.data.QRY);
				_DEBUG_Print(request.msg + " STA : " + request.data.STA);
				_DEBUG_Print(request.msg + " URL : " + request.data.URL);
				_DEBUG_Print(request.msg + " VPT : " + request.data.VPT);
				_DEBUG_Print(request.msg + " LIN : " + request.data.LIN);
				_DEBUG_Print(request.msg + " SUB : " + request.data.SUB);
				_DEBUG_Print(request.msg + " LIK : " + request.data.LIK);
*/	//			_DEBUG_Print(request.msg + " CPP : " + request.data.CPP);


				setTimeout(function() { updatestatus(); }, 10 );

				break;
		}

		sendResponse("success");

		return true;
});
/*  */
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
/* UI START */

function disabled_start(){
	var btn_start = document.querySelector('#start');
	if (btn_start){
		btn_start.disabled = true;
	}
}


function disabled_connect(){
	var btn_connect = document.querySelector('#connect');
	if (btn_connect){
		btn_connect.disabled = true;
	}
}


function disabled_target(){
	$("#t").attr("readonly",true);
}


function disabled_query(){
	$("#r").attr("readonly",true);
}


function enabled_start(){
	var btn_start = document.querySelector('#start');
	if (btn_start){
		btn_start.disabled = false;
	}
}


function enabled_connect(){
	var btn_connect = document.querySelector('#connect');
	if (btn_connect){
		btn_connect.disabled = false;
	}
}


function enabled_target(){
	$("#t").removeAttr("readonly");
	document.getElementById("t").innerHTML=" ";
}


function enabled_query(){
	$("#q").removeAttr("readonly");
}


function check_start(){

	disabled_start();

	/* YT_SW */
	chrome.storage.local.get('YT_SW', function(result){
		if (result.YT_SW===undefined){
		}else{
			var q1=result.YT_SW;

			/* YT_CN */
			chrome.storage.local.get('YT_CN', function(result1){
				if (result1.YT_CN===undefined){
				}else{
					var t1=result1.YT_CN;

					if ((0 < q1.length) && (0 < t1.length)){
						enabled_start()
					}
				}
			});	/* YT_CN */
		}
	});	/* YT_SW */

}

/* UI END */
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
/*  Event */

/* start Click Event */
document.addEventListener('DOMContentLoaded',function(){
	var btnstart = document.querySelector('#start');
	btnstart.addEventListener("click",start);
});


/* connect Click Event */
document.addEventListener('DOMContentLoaded',function(){
	var btnconnect = document.querySelector('#connect');
	btnconnect.addEventListener("click",connect);
});


/* input_t change Event */
document.addEventListener('DOMContentLoaded',function(){
	var input_t = document.querySelector('#t');
	input_t.addEventListener("keyup",ch_target);
});


/* input_q change Event */
document.addEventListener('DOMContentLoaded',function(){
	var input_q = document.querySelector('#q');
	input_q.addEventListener("keyup",ch_query);
});


/* onLoaded Event */
document.addEventListener('DOMContentLoaded', function () {
	_DEBUG_Print("onLoaded() : DOMContentLoaded");

	chrome.storage.local.get('GB_TID', function(result){
		TID = result.GB_TID;

		if (result.GB_TID===undefined){
			//
		}else{
			//
		}

	}); /* GB_TID */

	chrome.tabs.query({}, function(tabs){
        tabs.forEach(tb => {
			_DEBUG_Print("tabs : " + tb.id);
        });
    });

	chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){
		//code: ex) tabs[0].id
//		TID=tabs[0].id;

		_DEBUG_Print("DOMContentLoaded() ==> " + TID);
	});

	disabled_start();

	chrome.storage.local.get('YT_WC', function(result){
		if (result.YT_WC===undefined){
			document.getElementById("code").value="";
		}else{
			document.getElementById("code").value=result.YT_WC;
		}
	});

	chrome.storage.local.get('YT_ID', function(result){
		if (result.YT_ID===undefined){
			document.getElementById("id").value="";
		}else{
			document.getElementById("id").value=result.YT_ID;
		}
	});

	 /* YT_ED */
	chrome.storage.local.get('YT_ED', function(result){
		if (result.YT_ED===undefined){
			enabled_target();
			enabled_query();

			WCM=0;
			chrome.storage.local.set({'GB_WCM': WCM});

			check_start();

			$("#share").attr("disabled", true); //설정

			_DEBUG_Print("YT_ED() ==> " + "undefined");
		}else{
			disabled_target();
			disabled_query();

			_DEBUG_Print("YT_ED() ===> " + result.YT_ED);

			var strArr= result.YT_ED.split('-');
			var edate = new Date(strArr[0], strArr[1]-1, strArr[2]);
			var cdate = new Date();

			var interval = (edate.getTime() - cdate.getTime())/1000;
			dd = parseInt(interval/(24*60*60));

			if (0<dd){ /* 실행 모드 : 서버(1) */
				WCM=1;
				chrome.storage.local.set({'GB_WCM': WCM});

				enabled_start();

				$("#share").attr("disabled", true); //해제

				document.getElementById("connect").value="Disconnect...";
			}else{ /* 실행 모드 : 패널(0) */
				WCM=0;
				chrome.storage.local.set({'GB_WCM': WCM});

				check_start();

				$("#share").attr("disabled", true); //설정

				document.getElementById("connect").value="Connect...";
			}
		}
	}); /* YT_ED */

	bLoad=true;
	LoadStorage();

	ViewStorage();

	 /* GB_WCR */
	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		_DEBUG_Print("GB_WCR(DOMContentLoaded): " + result.GB_WCR);

		setTimeout(function() { SM_Check(); }, 0 );
	}); /* GB_WCR */

});

/*  Event */
//////////////////////////////////////////////////////////////////////////////////////////


/* YYYY-MM-DD HH:mm:ss 출력 ----------------------------------- */
function dateFormat(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;
        hour = hour >= 10 ? hour : '0' + hour;
        minute = minute >= 10 ? minute : '0' + minute;
        second = second >= 10 ? second : '0' + second;

        return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}
/* END ------------------------------------------------------- */


/* console.log 출력 -------------------------------------------- */
function _DEBUG_Print(info){

	chrome.storage.local.get('GB_bcs', function(result1){
		if (result1.GB_bcs){
			var CT=new Date();

			console.log(dateFormat(CT) + " | " + info);
		}
	}); /* GB_bcs */

}
/* END ------------------------------------------------------- */


/* 로컬변수 정보 보기 ------------------------------------------------- */
function ViewStorage(){

	chrome.storage.local.get('GB_CNTPP', function(result) {
		_DEBUG_Print("GB_CNTPP: " + result.GB_CNTPP);
	}); /* GB_CNTPP */

	chrome.storage.local.get('GB_cstatus', function(result) {
		_DEBUG_Print("GB_cstatus: " + result.GB_cstatus);
	}); /* GB_cstatus */

	chrome.storage.local.get('GB_cur_pos', function(result) {
		_DEBUG_Print("GB_cur_pos: " + result.GB_cur_pos);
	}); /* GB_cur_pos */

	chrome.storage.local.get('GB_DT', function(result) {
		_DEBUG_Print("GB_DT: " + result.GB_DT);
	}); /* GB_DT */

	chrome.storage.local.get('GB_FL', function(result) {
		_DEBUG_Print("GB_FL: " + result.GB_FL);
	}); /* GB_FL */

	chrome.storage.local.get('GB_key_in', function(result) {
		_DEBUG_Print("GB_key_in: " + result.GB_key_in);
	}); /* GB_key_in */

	chrome.storage.local.get('GB_Like', function(result) {
		_DEBUG_Print("GB_Like: " + result.GB_Like);
	}); /* GB_Like */

	chrome.storage.local.get('GB_LogCnt', function(result) {
		_DEBUG_Print("GB_LogCnt: " + result.GB_LogCnt);
	}); /* GB_LogCnt */

	chrome.storage.local.get('GB_LogIn', function(result) {
		_DEBUG_Print("GB_LogIn: " + result.GB_LogIn);
	}); /* GB_LogIn */

	chrome.storage.local.get('GB_mcode', function(result) {
		_DEBUG_Print("GB_mcode: " + result.GB_mcode);
	}); /* GB_mcode */

	chrome.storage.local.get('GB_mtype', function(result) {
		_DEBUG_Print("GB_mtype: " + result.GB_mtype);
	}); /* GB_mtype */

	chrome.storage.local.get('GB_PlayEnd', function(result) {
		_DEBUG_Print("GB_PlayEnd: " + result.GB_PlayEnd);
	}); /* GB_PlayEnd */

	chrome.storage.local.get('GB_PlayTime', function(result) {
		_DEBUG_Print("GB_PlayTime: " + result.GB_PlayTime);
	}); /* GB_PlayTime */

	chrome.storage.local.get('GB_pstatus', function(result) {
		_DEBUG_Print("GB_pstatus: " + result.GB_pstatus);
	}); /* GB_pstatus */

	chrome.storage.local.get('GB_query', function(result) {
		_DEBUG_Print("GB_query: " + result.GB_query);
	}); /* GB_query */

	chrome.storage.local.get('GB_RT', function(result) {
		_DEBUG_Print("GB_RT: " + result.GB_RT);
	}); /* GB_RT */

	chrome.storage.local.get('GB_scrpage', function(result) {
		_DEBUG_Print("GB_scrpage: " + result.GB_scrpage);
	}); /* GB_scrpage */

	chrome.storage.local.get('GB_ST', function(result) {
		_DEBUG_Print("GB_ST: " + result.GB_ST);
	}); /* GB_ST */

	chrome.storage.local.get('GB_status', function(result) {
		_DEBUG_Print("GB_status: " + result.GB_status);
	}); /* GB_status */

	chrome.storage.local.get('GB_Subscribe', function(result) {
		_DEBUG_Print("GB_Subscribe: " + result.GB_Subscribe);
	}); /* GB_Subscribe */

	chrome.storage.local.get('GB_targetTop', function(result) {
		_DEBUG_Print("GB_targetTop: " + result.GB_targetTop);
	}); /* GB_targetTop */

	chrome.storage.local.get('GB_TID', function(result) {
		_DEBUG_Print("GB_TID: " + result.GB_TID);
	}); /* GB_TID */

	chrome.storage.local.get('GB_VL', function(result) {
		_DEBUG_Print("GB_VL: " + result.GB_VL);
	}); /* GB_VL */

	chrome.storage.local.get('GB_WCM', function(result) {
		_DEBUG_Print("GB_WCM: " + result.GB_WCM);
	}); /* GB_WCM */

	chrome.storage.local.get('GB_wcode', function(result) {
		_DEBUG_Print("GB_wcode: " + result.GB_wcode);
	}); /* GB_wcode */

	chrome.storage.local.get('GB_WCR', function(result) {
		_DEBUG_Print("GB_WCR: " + result.GB_WCR);
	}); /* GB_WCR */

	chrome.storage.local.get('GB_YTPR', function(result) {
		_DEBUG_Print("GB_YTPR: " + result.GB_YTPR);
	}); /* GB_YTPR */

	chrome.storage.local.get('GB_MC', function(result) {
		_DEBUG_Print("GB_MC: " + result.GB_MC);
	}); /* GB_MC */

	chrome.storage.local.get('GB_PV', function(result) {
		_DEBUG_Print("GB_PV: " + result.GB_PV);
	}); /* GB_PV */

	chrome.storage.local.get('GB_TL', function(result) {
		_DEBUG_Print("GB_TL: " + result.GB_TL);
	}); /* GB_TL */

	chrome.storage.local.get('GB_search_query', function(result) {
		_DEBUG_Print("GB_search_query: " + result.GB_search_query);
	}); /* GB_search_query */

	/* ARM --------------------------------------------------- */
	chrome.storage.local.get('ARM_GWV', function(result) {
		_DEBUG_Print("ARM_GWV: " + result.ARM_GWV);
		if (result.ARM_GWV===undefined){
		}else{
		}
	}); /* ARM_GWV */

	chrome.storage.local.get('ARM_SRT', function(result) {
		_DEBUG_Print("ARM_SRT: " + result.ARM_SRT);
		if (result.ARM_SRT===undefined){
		}else{
		}
	}); /* ARM_SRT */

	chrome.storage.local.get('ARM_MON', function(result) {
		_DEBUG_Print("ARM_MON: " + result.ARM_MON);
	}); /* ARM_MON */

	chrome.storage.local.get('ARM_GYT', function(result) {
		_DEBUG_Print("ARM_GYT: " + result.ARM_GYT);
		if (result.ARM_GYT===undefined){
		}else{
		}
	}); /* ARM_GYT */

	chrome.storage.local.get('ARM_GET', function(result) {
		_DEBUG_Print("ARM_GET: " + result.ARM_GET);
		if (result.ARM_GET===undefined){
		}else{
		}
	}); /* ARM_GET */

	chrome.storage.local.get('ARM_QRY', function(result) {
		_DEBUG_Print("ARM_QRY: " + result.ARM_QRY);
		if (result.ARM_QRY===undefined){
		}else{
		}
	}); /* ARM_QRY */

	chrome.storage.local.get('ARM_SCR', function(result) {
		_DEBUG_Print("ARM_SCR: " + result.ARM_SCR);
		if (result.ARM_SCR===undefined){
		}else{
		}
	}); /* ARM_SCR */

	chrome.storage.local.get('ARM_NXT', function(result) {
		_DEBUG_Print("ARM_NXT: " + result.ARM_NXT);
		if (result.ARM_NXT===undefined){
		}else{
		}
	}); /* ARM_NXT */

	chrome.storage.local.get('ARM_CLK', function(result) {
		_DEBUG_Print("ARM_CLK: " + result.ARM_CLK);
		if (result.ARM_CLK===undefined){
		}else{
		}
	}); /* ARM_CLK */

	chrome.storage.local.get('ARM_CLN', function(result) {
		_DEBUG_Print("ARM_CLN: " + result.ARM_CLN);
		if (result.ARM_CLN===undefined){
		}else{
		}
	}); /* ARM_CLN */

	chrome.storage.local.get('ARM_CSS', function(result) {
		_DEBUG_Print("ARM_CSS: " + result.ARM_CSS);
		if (result.ARM_CSS===undefined){
		}else{
		}
	}); /* ARM_CSS */

	chrome.storage.local.get('ARM_SSS', function(result) {
		_DEBUG_Print("ARM_SSS: " + result.ARM_SSS);
		if (result.ARM_SSS===undefined){
		}else{
		}
	}); /* ARM_SSS */

	chrome.storage.local.get('ARM_CLI', function(result) {
		_DEBUG_Print("ARM_CLI: " + result.ARM_CLI);
		if (result.ARM_CLI===undefined){
		}else{
		}
	}); /* ARM_CLI */

	chrome.storage.local.get('ARM_SLI', function(result) {
		_DEBUG_Print("ARM_SLI: " + result.ARM_SLI);
		if (result.ARM_SLI===undefined){
		}else{
		}
	}); /* ARM_SLI */

	chrome.storage.local.get('ARM_CMV', function(result) {
		_DEBUG_Print("ARM_CMV: " + result.ARM_SLI);
		if (result.ARM_CMV===undefined){
		}else{
		}
	}); /* ARM_CMV */

	chrome.storage.local.get('ARM_GFV', function(result) {
		_DEBUG_Print("ARM_GFV: " + result.ARM_GFV);
		if (result.ARM_GFV===undefined){
		}else{
		}
	}); /* ARM_GFV */

	chrome.storage.local.get('ARM_GSQ', function(result) {
		_DEBUG_Print("ARM_GSQ: " + result.ARM_GSQ);
		if (result.ARM_GSQ===undefined){
		}else{
		}
	}); /* ARM_GSQ */

	chrome.storage.local.get('ARM_RFH', function(result) {
		_DEBUG_Print("ARM_RFH: " + result.ARM_RFH);
		if (result.ARM_RFH===undefined){
		}else{
		}
	}); /* ARM_RFH */

	chrome.storage.local.get('ARM_VLO', function(result) {
		_DEBUG_Print("ARM_VLO: " + result.ARM_VLO);
		if (result.ARM_VLO===undefined){
		}else{
		}
	}); /* ARM_VLO */

}
/* END ------------------------------------------------------- */


var port = chrome.runtime.connect();
_DEBUG_Print("port : "+port);

var language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;

_DEBUG_Print("language : "+language);

$('input:checkbox[name=share]').each(function(index, element){
	$(this).next('label').addClass("ui-state-active");
	$(this).next('label').attr('aria-pressed', true);
	$(this).attr('checked', true);
});

$( function() {

	var dialog, form,

	// From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
	timelimit = $( "#timelimit" ),
	resettime = $( "#resettime" ),
	q1 = $( "#q1" ),
	t1 = $( "#t1" ),
	allFields = $( [] ).add( timelimit ).add( resettime ).add( q1 ).add( t1 ),
	tips = $( ".validateTips" );

	function updateTips( t ) {
		tips
		.text( t )
		.addClass( "ui-state-highlight" );
		setTimeout(function() {
			tips.removeClass( "ui-state-highlight", 1500 );
		}, 500 );
	}

	function checkLength( o, n, min, max ) {
		if ( o.val().length > max || o.val().length < min ) {
			o.addClass( "ui-state-error" );
			updateTips( "Length of " + n + " must be between " +
			min + " and " + max + "." );
			return false;
		} else {
			return true;
		}
	}

	function checkRegexp( o, regexp, n ) {
		if ( !( regexp.test( o.val() ) ) ) {
			o.addClass( "ui-state-error" );
			updateTips( n );
			return false;
		} else {
			return true;
		}
	}

	function apply() {
		var valid = true;
		allFields.removeClass( "ui-state-error" );

//		valid = valid && checkLength( q1, "q1", 1, 64 );
//		valid = valid && checkLength( t1, "t1", 25, 64 );

		if ( valid ) {
			/* YT_SS */
			var share=0;
			if( $("#share").is(":checked") == true ){
				share=1;
			}
			chrome.storage.local.set({'YT_SS': share});

			/* YT_WL */
			var watchlimit=0;
			if( $("#watchlimit").is(":checked") == true ){
				watchlimit=1;
			}
			chrome.storage.local.set({'YT_WL': watchlimit});

			/* YT_TL */
			var yt_tl = timelimit.val();
			if ("Unlimited"==yt_tl){
				chrome.storage.local.set({'YT_TL': "-1"});
			}else{
				chrome.storage.local.set({'YT_TL': yt_tl});
			}

			/* YT_RS */
			var yt_rs = resettime.val();
			if ("Unlimited"==yt_rs){
				chrome.storage.local.set({'YT_RS': "-1"});
			}else{
				chrome.storage.local.set({'YT_RS': yt_rs});
			}

			/* YT_SW */
			var yt_q1 = q1.val();
			chrome.storage.local.set({'YT_SW': yt_q1});

			/* YT_CN */
			var yt_t1 = t1.val();
			chrome.storage.local.set({'YT_CN': yt_t1});

			dialog.dialog( "close" );
		}
		return valid;
	}

	dialog = $( "#dialog-form" ).dialog({
		autoOpen: false,
		width: 370,
		height: 305,
		modal: true,
		resizable: false,
		buttons: {
			"Apply": apply,
			Cancel: function() {

				dialog.dialog( "close" );
			}
		},
		close: function() {

//			LoadStorage();

			//form[ 0 ].reset();
			//allFields.removeClass( "ui-state-error" );
		}
	});

	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
		apply();
	});

	$( "#setting" ).button().on( "click", function() {
		dialog.dialog( "open" );

		$( "#timelimit" ).selectmenu({ width: 100 });
		$( "#resettime" ).selectmenu({ width: 100 });

		$( "#share" ).checkboxradio();
		$( "#watchlimit" ).checkboxradio();

		bLoad=false;
		LoadStorage();
	});

});
