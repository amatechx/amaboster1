
//chrome.storage.local.set({'GB_bcs': true});	/* GB_bcs */
chrome.storage.local.set({'GB_bcs': false});	/* GB_bcs */

var WCR=true;	/* 실행 중 */
/*chrome.storage.local.set({'GB_WCR': false});*/
//chrome.storage.local.remove('GB_WCR',function() { });

var YTPR=0;		/* 활성화된 팝업 ID */
//chrome.storage.local.set({'GB_YTPR': 0});

var YTID=0;		/* 실행 탭 ID */
//chrome.storage.local.set({'GB_YTID': -1});

var TID=0;		/* 실행 탭 ID */
//chrome.storage.local.remove('GB_TID',function() { });

var CNTPP=0;	/* 팝업 띄워진 횟수 */
//chrome.storage.local.set({'GB_CNTPP': 0});

var WCM=0;		/* 실행 모드, 0:패널, 1:서버 */

var status=-1;	/* 실행 상태 */
//chrome.storage.local.set({'GB_status': -1});

var pstatus=-1;	/* 이전 실행 상태 */
//chrome.storage.local.set({'GB_pstatus': -1});

var cstatus=-1;	/* 실행 상태 HOP */
//chrome.storage.local.set({'GB_cstatus': -1});

var MC=new Array();	/* 시청할 채녈 목록 My Channel */
var PV=new Array();	/* 시청한 영상 목록 Palyed Video */

var wcode='';	/* 작업 코드 */
var mcode='';	/* 미션 코드 */
var query='';	/* 검색어 */
var mtype='';	/* 미션 종류 */
var VL='';		/* 유튜브 링크 */
var PlayTime=0;	/* 플레이 실행 시간 */
var PlayLimit=0;/* 플레이 타임아웃 */
var search_query='';	/* 검색후 검색어 */

var LogIn=0;	/* 유튜브 로그인 여부 */
//chrome.storage.local.set({'GB_LogIn': 0});

var Subscribe=0;	/* 영상 구독 여부 */
var Like=0;		/* 영상 좋아요 여부 */

var LogCnt=0;	/* 영상 로그 전송 수 : 1분마다 */
//chrome.storage.local.set({'GB_LogCnt': 0});

var PlayEnd=0;	/* 영상 플레이 종료 여부 */
var RT='';		/* 가동 시작 시간 :밀리세컨드 */
var DT='';		/* 일일 가동 시작 시간 :밀리세컨드 */
var ST='';		/* 미션 실행 시작 시간 :밀리세컨드 */
var TVT='';		/* 영상클릭 시작 시간 :밀리세컨드 */

var w_code="";	/* YT_WC */
var w_id="";	/* YT_ID */

/* 검색어 입력 --------------- */
var cur_pos=0;	/* 검색어 입력시 검색어 위치 */
//chrome.storage.local.set({'GB_cur_pos': 0});

var key_in=0;	/* 검색어 입력시 초기화 여부 */
//chrome.storage.local.set({'GB_key_in': 0});
/* 검색어 입력 --------------- */

var YT_TL=-1;
var YT_WL=-1;
var YT_RS=-1;

/* 영상 찾기 --------------- */
var myVideo=new Array();
var FV=''; /* FV */

var FL=''; /* FL */
//chrome.storage.local.set({'GB_FL': ''});

var scrpage=0;
//chrome.storage.local.set({'GB_scrpage': 0});

var targetTop=0;
//chrome.storage.local.set({'GB_targetTop': 0});

var vele=null;
var WH=0; //window.outerHeight;
var CT=0; //window.scrollY;
var TT=0; //window.scrollY+window.outerHeight;
/* 영상 찾기 --------------- */

try {
	importScripts('/scripts/jquery-3.6.0.min.js');
} catch (e) {
	//console.error(e);
}

/* --------------------------------------------------------- */
/* 탭 변경 이벤트 ----------------------------------------------- */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete') {
		_DEBUG_Print("complete : " + tabId);

		if (tab.url.indexOf("youtube.com") != -1) {

//			if (!WCR) { return;	}
			chrome.storage.local.get('GB_WCR', function(result){
				if (!result.GB_WCR){ return; }

				chrome.storage.local.get('GB_status', function(result){

					status = Number(result.GB_status);

					_DEBUG_Print("status : " + status);

					if (1 == status){

						status=2;
						chrome.storage.local.set({'GB_status': 2});

						VL=tab.url;
//						chrome.storage.local.set({'GB_VL': VL});

						_DEBUG_Print("ARM_GSQ : " + Date.now());
						chrome.storage.local.set({'ARM_GSQ': Date.now()});

						chrome.alarms.create('alarm_go_setquery', {when: Date.now() + 3*1000});

					}else if (3 == status){

						status=4;
						chrome.storage.local.set({'GB_status': 4});

						VL=tab.url;
//						chrome.storage.local.set({'GB_VL': VL});

						_DEBUG_Print("ARM_GFV : " + Date.now());
						chrome.storage.local.set({'ARM_GFV': Date.now()});
						chrome.storage.local.remove('ARM_GWV',function() { });

						chrome.alarms.create('alarm_go_findvideo', {when: Date.now() + 3*1000});

					}else if (5 == status){

						// 클릭했는데, 영상주소가 아니면 처음부터 다시함...
						status=6;
						chrome.storage.local.set({'GB_status': 6});

						VL=tab.url;
						chrome.storage.local.set({'GB_VL': VL});

						chrome.storage.local.get('GB_FL', function(data1){
							GB_FL = data1.GB_FL;

							chrome.storage.local.get('ARM_GWV', function(result){
								_DEBUG_Print("ARM_GWV : " + result.ARM_GWV);
								if (result.ARM_GWV===undefined){
									ST=new Date();
									var STV = ST.getTime();
									chrome.storage.local.set({'GB_ST': STV});

									_DEBUG_Print("ARM_GWV(addListener) : " + Date.now());

									chrome.storage.local.set({'ARM_GWV': Date.now()});
									chrome.alarms.create('alarm_go_watchvideo', {when: Date.now() + 3*1000});
								}else{
								}
							});
						});

					}else if (6 == status){

						// 시청 시간 업데이트
						VL=tab.url;
						chrome.storage.local.set({'GB_VL': VL});

					}
				}); /* GB_status */
			}); /* GB_WCR */
		}
	}
});
/* 끝 ------------------------------------------------------- */


/* 탭 삭제 이벤트 ----------------------------------------------- */
chrome.tabs.onRemoved.addListener(function(tabId, info) {

//	if (!WCR) { return;	}
	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		chrome.storage.local.get('GB_TID', function(result){
			TID = result.GB_TID;

			if (tabId==TID){

				_DEBUG_Print('Tab Removed : ' + String(TID));

				WCR=false;
				chrome.storage.local.set({'GB_WCR': false});

//				delete RT;

				TID=-1;
				chrome.storage.local.remove('GB_TID',function() { });

				init();
			}
		}); /* GB_TID */
	}); /* GB_WCR */

});
/* 끝 ------------------------------------------------------- */


/* 확장 설치 이벤트 ---------------------------------------------- */
chrome.runtime.onInstalled.addListener(() => {

	_DEBUG_Print("onInstalled : OK!");

	chrome.storage.local.set({'LV_MYC': 0});
	chrome.storage.local.set({'LV_MYS': 0});
	chrome.storage.local.set({'LV_MYL': 0});
	chrome.storage.local.set({'LV_MYW': 0});

	RemoveStorage();

});
/* 끝 ------------------------------------------------------- */


/* 알람 호출 이벤트 --------------------------------------------- */
chrome.alarms.onAlarm.addListener(function(alarm) {

	switch( alarm.name ){

		case 'alarm_go_watchvideo':
			go_watchvideo();
			break;

		case 'alarm_go_ip':
			/* go_ip(); */
			break;

		case 'alarm_start':
			start();
			break;

		case 'alarm_mon':
			mon();
			break;

		case 'alarm_go_youtube':
			go_youtube();
			break;

		case 'alarm_go_youtube_view':
			go_youtube_view();
			break;

		case 'alarm_get_data':
			get_data();
			break;

		case 'alarm_get_panneldata':
			get_panneldata();
			break;

		case 'alarm_run_setquery':
			run_setquery();
			break;

		case 'alarm_run_page_scroll':
			run_page_scroll();
			break;

		case 'alarm_run_clk_link':
			run_clk_link();
			break;

		case 'alarm_run_next_page':
			run_next_page();
			break;

		case 'alarm_go_check_login':
			go_check_login();
			break;

		case 'alarm_go_check_subscribe':
			go_check_subscribe();
			break;

		case 'alarm_go_set_subscribe':
			go_set_subscribe();
			break;

		case 'alarm_go_check_like':
			go_check_like();
			break;

		case 'alarm_go_set_like':
			go_set_like();
			break;

		case 'alarm_check_video':
			check_video();
			break;

		case 'alarm_go_findvideo':
			go_findvideo();
			break;

		case 'alarm_go_setquery':
			go_setquery();
			break;

		case 'alarm_run_find_href':
			run_find_href();
			break;

		case 'alarm_view_logo':
			view_logo();
			break;

		case 'alarm_send_log':
			send_log();	// write log
			break;

	}

});
/* 끝 ------------------------------------------------------- */


/* 탭 활성 이벤트 수신 처리 ---------------------------------------- */
chrome.tabs.onActivated.addListener(function(activeInfo) {

	var tab = chrome.tabs.get(activeInfo.tabId, function(tab) {

		chrome.storage.local.get('GB_TID', function(result){
			if (result.GB_TID===undefined){
				chrome.action.enable();
				_DEBUG_Print("GB_TID===undefined : " + activeInfo.tabId);
			}else{
				TID = result.GB_TID;
				_DEBUG_Print("TID : " + TID);

				var find_tab = false;
				chrome.tabs.query({}, function(tabs){
					tabs.forEach(tb => {
						_DEBUG_Print("tabs : " + tb.id);

						if (TID == tb.id){
							find_tab = true;
							return false;
						}
					});

					if (find_tab){
						if (tab.url.indexOf("youtube.com") != -1) {
							if (-1==TID){
								if (activeInfo.tabId){
									chrome.action.enable();

									_DEBUG_Print("enable 1 : " + activeInfo.tabId);
								}
							}else{
								if(TID==activeInfo.tabId){
									if (activeInfo.tabId){
										chrome.action.enable();

										_DEBUG_Print("enable 2 : " + activeInfo.tabId);
									}
								}else{
									if (activeInfo.tabId){
										chrome.action.disable();

										_DEBUG_Print("disable 2 : " + activeInfo.tabId);
									}
								}
							}
						}else{
							if (-1==TID){
								chrome.action.disable();

								_DEBUG_Print("enable 3 : " + activeInfo.tabId);
							}else{
								if(TID==activeInfo.tabId){
									chrome.action.enable();

									_DEBUG_Print("enable 4 : " + activeInfo.tabId);
								}else{
									chrome.action.disable();

									_DEBUG_Print("disable 4 : " + activeInfo.tabId);
								}
							}
						}
					}else{
						_DEBUG_Print("find_tab : " + find_tab);

						chrome.storage.local.remove('GB_TID',function() { });
						chrome.action.enable();
					}
				});
			}
		}); /* GB_TID */
    });
});
/* 끝 ------------------------------------------------------- */


/* 메시지 이벤트 수신 처리 ----------------------------------------- */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

	switch( message.msg ){

		case 'PS_CHECK':

			TID=Number(message.data.tid);	/* 실행 탭 ID */
			chrome.storage.local.set({'GB_TID': Number(message.data.tid)});

//			_DEBUG_Print("PS_CHECK ==> " + TID);

			runcheck_ack();

			break;

		case 'PS_START':

			TID=Number(message.data.tid);	/* 실행 탭 ID */
			chrome.storage.local.set({'GB_TID': Number(message.data.tid)});

			WCM=Number(message.data.WCM);	/* 실행 모드, 0:패널, 1:서버 */
			chrome.storage.local.set({'GB_WCM': Number(message.data.WCM)});

			_DEBUG_Print("PS_START ==> " + TID);

			/* ------------------------------------------ */
			chrome.alarms.clearAll();	/* 모든 알람 제거 */

			/* chrome.alarms.create('alarm_go_ip', {when: Date.now() + 10*1000}); */
			/* ------------------------------------------ */

			if (message){
				_DEBUG_Print('message : ' + message.msg);
			}

			WCR=true;
			chrome.storage.local.set({'GB_WCR': true});

			RT=new Date();
			var VRT = RT.getTime();
			chrome.storage.local.set({'GB_RT': VRT});

			DT=RT;
			var VDT = DT.getTime();
			chrome.storage.local.set({'GB_DT': VDT});

			if(0==WCM){
				query=message.data.QRY;

				MC=[];
				MC.push(message.data.TCH);
				chrome.storage.local.set({'GB_MC': MC});
			}else{
				chrome.storage.local.get('YT_WC', function(result){
					if (result.YT_WC===undefined){
						_DEBUG_Print("result.YT_WC : undefined");
					}else{
						_DEBUG_Print("result.YT_WC : " + result.YT_WC);

						w_code=result.YT_WC;
					}
				}); /* YT_WC */

				chrome.storage.local.get('YT_ID', function(result){
					if (result.YT_ID===undefined){
						_DEBUG_Print("result.YT_ID : undefined");
					}else{
						_DEBUG_Print("result.YT_ID : " + result.YT_ID);

						w_id=result.YT_ID;
					}
				}); /* YT_ID */
			}
			PV=[];
			chrome.storage.local.set({'GB_PV': PV});

			_DEBUG_Print("ARM_SRT : " + Date.now());
			chrome.storage.local.set({'ARM_SRT': Date.now()});
			chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});

			_DEBUG_Print("ARM_MON : " + Date.now());
			chrome.storage.local.set({'ARM_MON': Date.now()});
			chrome.alarms.create('alarm_mon', {when: Date.now() + 1*1000});

//			_DEBUG_Print("ARM_VLO : " + Date.now());
			chrome.storage.local.set({'ARM_VLO': Date.now()});
			chrome.alarms.create('alarm_view_logo', {when: Date.now() + 1*1000});

			break;

		case 'PS_STOP':

			if (message){
				_DEBUG_Print('message : ' + message.msg);
			}

			chrome.alarms.clearAll();	/* 모든 알람 제거 */

			chrome.storage.local.remove('GB_WCM',function() { });

			WCR=false;
			chrome.storage.local.set({'GB_WCR': false});

			chrome.storage.local.remove('GB_RT',function() { });

			TID=-1;
			chrome.storage.local.remove('GB_TID',function() { });

			RemoveStorage();

			init();

			if (-1==TID){
				/*	chrome.browserAction.enable(tab.id); */
			}else{
				chrome.browserAction.enable(TID);
			}

			break;
	}

	sendResponse("success");

	return true;
});
/* 메시지 수신 및 처리 끝 ----------------------------------------- */


/* IP 확인 이벤트 ---------------------------------------------- */
async function go_ip(){

	fetch('http://y.irank.kr/appl/ip.php')
	.then(
		function(response) {
			if (response.status !== 200) {
				_DEBUG_Print('Looks like there was a problem. Status Code: ' + response.status);

				chrome.alarms.create('alarm_go_ip', {when: Date.now() + 10*1000});

				return;
			}

			// Examine the text in the response
			response.text().then(function(data) {
				_DEBUG_Print(data);

				return data;
//				chrome.alarms.create('alarm_go_ip', {when: Date.now() + 10*1000});
			});
		}
	)
	.catch(function(err) {
		_DEBUG_Print('Fetch Error :-S', err);

		chrome.alarms.create('alarm_go_ip', {when: Date.now() + 10*1000});
	});

}
/* 메시지 수신 및 처리 끝 ----------------------------------------- */


/* IP 확인 이벤트 ---------------------------------------------- */
async function view_logo(){

	chrome.storage.local.remove('ARM_VLO',function() { });
//	_DEBUG_Print("ARM_VLO : -");

//	_DEBUG_Print("view_logo(): " + Date.now());

	fetch('/images/logo.png')
	.then(
		function(response) {
			if (response.status !== 200) {
				_DEBUG_Print('Looks like there was a problem. Status Code: ' + response.status);

				_DEBUG_Print("ARM_VLO : " + Date.now());
				chrome.storage.local.set({'ARM_VLO': Date.now()});

				chrome.alarms.create('alarm_view_logo', {when: Date.now() + 10*1000});

				return;
			}

			// Examine the text in the response
			response.text().then(function(data) {
//				_DEBUG_Print(data);
			});
		}
	)
	.catch(function(err) {
		_DEBUG_Print('Fetch Error : ' + err);

		_DEBUG_Print("ARM_VLO : " + Date.now());
		chrome.storage.local.set({'ARM_VLO': Date.now()});

		chrome.alarms.create('alarm_view_logo', {when: Date.now() + 10*1000});
	});

//	_DEBUG_Print("view_logo(): " + Date.now());


	_DEBUG_Print("ARM_VLO : " + Date.now());
	chrome.storage.local.set({'ARM_VLO': Date.now()});

	chrome.alarms.create('alarm_view_logo', {when: Date.now() + 10*1000});

}
/* 메시지 수신 및 처리 끝 ----------------------------------------- */


/* 확장 설치 이벤트 ---------------------------------------------- */
function runcheck_ack(){

//	check_runtab();

	var SWCR='0';
	if (WCR){ SWCR = '1'; }

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		WCR  = result.GB_WCR;
		SWCR = '1';
	_DEBUG_Print("WCR() ==> " + WCR);

		chrome.storage.local.get('GB_RT', function(result){
			RT = result.GB_RT;

			var RCT=new Date();
			var interval = 0;
			interval = parseInt((RCT.getTime() - RT)/1000);

			var TCH="";
			chrome.storage.local.get('GB_MC', function(data){
				if (data.GB_MC===undefined){
				}else{
					MC = data.GB_MC;

					if (0<MC.length){
						TCH=MC[0];
					}

					chrome.storage.local.get('GB_TID', function(result){
						TID = result.GB_TID;

						chrome.storage.local.get('GB_CNTPP', function(result){
							CNTPP = result.GB_CNTPP;

							chrome.storage.local.get('GB_status', function(result){
								if (result.GB_status===undefined){
									status = '';
								}else{
									status = result.GB_status;
								}

								chrome.storage.local.get('GB_LogIn', function(result){
									LogIn=result.GB_LogIn;

	_DEBUG_Print("GB_status(runcheck_ack) ==> " + status);
									chrome.runtime.sendMessage({
										msg: "PS_CHECK_ACK",
										data: {
											WCR: SWCR,
											TRT: String(interval),
											TID: TID,
											PVL: String(PV.length),
											QRY: query,
											MCL: String(MC.length),
											STA: status,
											URL: VL,
											VPT: String(PlayTime),
											LIN: String(LogIn),
											SUB: String(Subscribe),
											LIK: String(Like),
											CPP: String(CNTPP),
											TCH: TCH
										}
									}, (response)=>{});
								}); /* GB_LogIn */
							}); /* GB_status */
						}); /* GB_CNTPP */
					}); /* GB_TID */
				}
			}); /* GB_MC */
		}); /* GB_RT */
	}); /* GB_WCR */

}
/* 끝 ------------------------------------------------------- */


/* 확장 설치 이벤트 ---------------------------------------------- */
function runcheck(){

	var SWCR='0';
	if (WCR){ SWCR = '1'; }

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		WCR  = result.GB_WCR;
		SWCR = '1';
	_DEBUG_Print("WCR() ==> " + WCR);

		chrome.storage.local.get('GB_RT', function(result){
			RT = result.GB_RT;

			var RCT=new Date();
			var interval = 0;
			interval = parseInt((RCT.getTime() - RT)/1000);

			var TCH="";
			chrome.storage.local.get('GB_MC', function(data){
				if (data.GB_MC===undefined){
				}else{
					MC = data.GB_MC;

					if (0<MC.length){
						TCH=MC[0];
					}

					chrome.storage.local.get('GB_TID', function(result){
						TID = result.GB_TID;

						chrome.storage.local.get('GB_CNTPP', function(result){
							CNTPP = result.GB_CNTPP;

							chrome.storage.local.get('GB_status', function(result){
								status = result.GB_status;
	_DEBUG_Print("GB_status(runcheck) ==> " + status);

								chrome.storage.local.get('GB_LogIn', function(result){
									LogIn=result.GB_LogIn;

									chrome.runtime.sendMessage({
										msg: "PS_CHECK_ACK",
										data: {
											WCR: SWCR,
											TRT: String(interval),
											TID: TID,
											PVL: String(PV.length),
											QRY: query,
											MCL: String(MC.length),
											STA: String(status),
											URL: VL,
											VPT: String(PlayTime),
											LIN: String(LogIn),
											SUB: String(Subscribe),
											LIK: String(Like),
											CPP: String(CNTPP),
											TCH: TCH
										}
									}, (response)=>{});
								}); /* GB_LogIn */
							}); /* GB_status */
						}); /* GB_CNTPP */
					}); /* GB_TID */
				}
			}); /* GB_MC */
		}); /* GB_RT */
	}); /* GB_WCR */

}
/* 끝 ------------------------------------------------------- */


/* 유튜브 실행탭 검사 시작 --------------------------------------------- */
function check_runtab(){

	chrome.storage.local.get('GB_TID', function(result){
		if (result.GB_TID){ TID = Number(result.GB_TID); }

		_DEBUG_Print('check_runtab => ' + TID);
	});	/* GB_TID */

}
/* 끝 ------------------------------------------------------- */


/* 탭 유튜브로 시작 --------------------------------------------- */
function go_youtube(e){

	chrome.storage.local.remove('ARM_GYT',function() { });
	_DEBUG_Print("ARM_GYT : -");

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		status=1;
		chrome.storage.local.set({'GB_status': 1});

		chrome.storage.local.get('GB_TID', function(result){
			TID = Number(result.GB_TID);

			_DEBUG_Print("go_youtube() : " + status);

			chrome.tabs.update(TID, {url: 'https://www.youtube.com'});
		}); /* GB_TID */
	}); /* GB_WCR */

}
/* 끝 ------------------------------------------------------- */


/* 유튜브 링크로 시작 --------------------------------------------- */
function go_youtube_view(e){

	chrome.storage.local.remove('ARM_GYT',function() { });
	_DEBUG_Print("ARM_GYT : -");

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		status=5;
		chrome.storage.local.set({'GB_status': 5});

		chrome.storage.local.get('GB_FL', function(result){
			FL = result.GB_FL;
			_DEBUG_Print("go_youtube_view() : " + FL);

			chrome.storage.local.get('GB_TID', function(result){
				TID = Number(result.GB_TID);

				chrome.tabs.update(TID, {url: FL});
			}); /* GB_TID */
		}); /* GB_FL */
	}); /* GB_WCR */

}
/* 끝 ------------------------------------------------------- */


/* 지연시간계산 시작 --------------------------------------------- */
function wait(){
	var randomNum=Math.random()*500;
	var randomNumFloor=Math.floor(randomNum+500);
	return randomNumFloor;
}

function scr_wait(){
	var randomNum=Math.random()*80;
	var randomNumFloor=Math.floor(randomNum+100);
	return randomNumFloor;
}
/* 끝 ------------------------------------------------------- */


/* ######################################################### */
/* 검색어 리셋 시작 ---------------------------------------------- */
function reset_query(){
	var inp=document.getElementsByName('search_query');
	inp[0].value='';
	var ev=new Event('input');
	inp[0].dispatchEvent(ev);

	return "1";
}
/* 끝 ------------------------------------------------------- */

/* 검색어 입력 시작 ---------------------------------------------- */
function set_query(query, cur_pos){
	var q=query.substr(cur_pos,1);
	var inp=document.getElementsByName('search_query');
	inp[0].value=inp[0].value+q;
	var ev=new Event('input');
	inp[0].dispatchEvent(ev);

	return "1";
}
/* 끝 ------------------------------------------------------- */


/* 폼 전송 시작 ------------------------------------------------ */
function query_submit(){
	document.forms['search-form'].submit();

	return "OK!";
}
/* 끝 ------------------------------------------------------- */


/* 검색어 입력 확인 시작 ------------------------------------------ */
function run_setquery() {

	chrome.storage.local.get('GB_TID', function(result){
		TID = result.GB_TID;

		chrome.storage.local.get('GB_query', function(result11){
			if (result11.GB_query===undefined){
				query = '';
			}else{
				query=result11.GB_query;
			}

			chrome.storage.local.get('GB_cur_pos', function(result111){
				cur_pos=result111.GB_cur_pos;

				if (cur_pos<query.length){
					chrome.scripting.executeScript(
					{
						target: {tabId: TID},
						func: set_query,
						args: [query, cur_pos],
					},
					(injectionResults) => {
						cur_pos++;
						chrome.storage.local.set({'GB_cur_pos': cur_pos});

						chrome.alarms.create('alarm_run_setquery', {when: Date.now() + wait()});
					});

				} else {
					chrome.scripting.executeScript(
					{
						target: {tabId: TID},
						func: query_submit,
						args: [query],
					},
					(injectionResults) => {

						for (const submitResult of injectionResults){
							_DEBUG_Print('query_submit: ' + submitResult.result);
							scrpage=0;
							chrome.storage.local.set({'GB_scrpage': scrpage});
						}

					});
				}
			}); /* GB_cur_pos */
		}); /* GB_query */
	}); /* GB_TID */

}
/* 끝 ------------------------------------------------------- */


/* 검색어 입력 시작 ---------------------------------------------- */
function go_setquery(e){

	chrome.storage.local.remove('ARM_GSQ',function() { });
	_DEBUG_Print("ARM_GSQ : -");

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		status=3;
		chrome.storage.local.set({'GB_status': 3});

		chrome.storage.local.get('GB_TID', function(result){
			TID = Number(result.GB_TID);

			_DEBUG_Print("go_setquery() : " + query);

			cur_pos=0;
			key_in=0;

			chrome.storage.local.set({'GB_cur_pos': 0});
			chrome.storage.local.set({'GB_key_in': 0});

			chrome.scripting.executeScript(
			{
				target: {tabId: TID},
				func: reset_query,
				args: [query],
			},
			(injectionResults) => {
				key_in=1;
				chrome.storage.local.set({'GB_key_in': 1});

				chrome.alarms.create('alarm_run_setquery', {when: Date.now() + wait()});
			});
		}); /* GB_TID */
	}); /* GB_WCR */

}
/* 끝 ------------------------------------------------------- */
/* ######################################################### */


/* ######################################################### */

/* 시청할 링크 찾기 시작 ------------------------------------------ */
function find_href(link){
	var vele;
	var ycn=document.getElementsByTagName('A');
	for(var i=0; i<ycn.length; i++){
		var cycn=ycn.item(i);
		var str=cycn.getAttribute('href');
		if (link===str) {
			vele=cycn;
			break;
		}
	}

	var ret=-1;
	if(vele){
		var curTop=-1;
		var tmp=vele;
		if(tmp.offsetParent){
			do{
				curTop+=tmp.offsetTop;
			}while(tmp=tmp.offsetParent);
		}

		ret=curTop;	/* get_top(vele); */
		/* page_scroll(); */
	}

	return ret;
}
/* 끝 ------------------------------------------------------- */


/* 검색어 입력 확인 시작 ------------------------------------------ */
function run_find_href() {

	chrome.storage.local.remove('ARM_RFH',function() { });
	_DEBUG_Print("ARM_RFH : -");

	chrome.storage.local.get('GB_TID', function(result){
		TID = result.GB_TID;

		chrome.storage.local.get('GB_FL', function(result11){
			FL=result11.GB_FL;

			chrome.scripting.executeScript(
			{
				target: {tabId: TID},
				func: find_href,
				args: [FL],
			},
			(injectionResults) => {

				for (const findResult of injectionResults){

					_DEBUG_Print('find_href: ' + findResult.result);

					if (-1 < findResult.result){
						targetTop = findResult.result;
						chrome.storage.local.set({'GB_targetTop': targetTop});

						chrome.alarms.create('alarm_run_page_scroll', {when: Date.now() + wait()});
					}
				}

			});
		}); /* GB_FL */
	}); /* GB_TID */

}
/* 끝 ------------------------------------------------------- */


/* 다음 스크롤페이지 시작 ------------------------------------------ */
function page_scroll(targetTop){
	var min=Math.ceil(10);
	var max=Math.floor(50);
	var getRandomInt=Math.floor(Math.random()*(max-min))+min;

	if (typeof window !== "undefined") {
		var CT=window.scrollY;
		if (CT < targetTop) {
			window.scrollTo(0,window.scrollY + getRandomInt);
			return window.scrollY + getRandomInt;
		} else {
			return CT;
		}
	}else{
		return targetTop;
	}
}
/* 끝 ------------------------------------------------------- */


/* 검색어 입력 확인 시작 ------------------------------------------ */
function run_page_scroll() {

	chrome.storage.local.get('GB_TID', function(result){
		TID = result.GB_TID;

		chrome.storage.local.get('GB_targetTop', function(result1){
			targetTop=result1.GB_targetTop;

			chrome.scripting.executeScript(
			{
				target: {tabId: TID},
				func: page_scroll,
				args: [targetTop],
			},
			(injectionResults) => {

				for (const scrollResult of injectionResults){

//					_DEBUG_Print('targetTop: ' + targetTop);
					_DEBUG_Print('run_page_scroll: ' + scrollResult.result.toFixed());

					if (scrollResult.result<(targetTop-150)){
						chrome.alarms.create('alarm_run_page_scroll', {when: Date.now() + scr_wait()});
					}else{
						status=5;
						chrome.storage.local.set({'GB_status': 5});

						_DEBUG_Print("ARM_CLK : " + Date.now());
						chrome.storage.local.set({'ARM_CLK': Date.now()});
						chrome.alarms.create('alarm_run_clk_link', {when: Date.now() + scr_wait()});
					}
				}
			});
		}); /* GB_targetTop */
	}); /* GB_TID */

}
/* 끝 ------------------------------------------------------- */


/* 링크 클릭 시작 ----------------------------------------------- */
function clk_link(link){
	var ele=null;
	var ycn=document.getElementsByTagName('A');
	for(var i=0; i<ycn.length; i++){
		var cycn=ycn.item(i);
		var str=cycn.getAttribute('href');
		if (link===str) {
			ele=cycn;
			break;
		}
	}

	if (ele){
		var event1=document.createEvent('MouseEvents');
		event1.initEvent('mousedown',true,true);
		ele.dispatchEvent(event1);

		var event2=document.createEvent('MouseEvents');
		event2.initEvent('click',true,true);
		ele.dispatchEvent(event2);

		return "1";
	}else{
		return "0";
	}

}
/* 끝 ------------------------------------------------------- */


/* 링크 클릭 시작 ----------------------------------------------- */
function run_clk_link() {

	chrome.storage.local.remove('ARM_CLK',function() { });
	_DEBUG_Print("ARM_CLK : -");

	chrome.storage.local.get('GB_TID', function(result){
		TID = result.GB_TID;

		chrome.storage.local.get('GB_FL', function(result11){
			FL=result11.GB_FL;

			chrome.scripting.executeScript(
			{
				target: {tabId: TID},
				func: clk_link,
				args: [FL],
			},
			(injectionResults) => {

				var ct=new Date();
				TVT=ct.getTime();
				chrome.storage.local.set({'GB_TVT': TVT});

				PlayTime=0;
				chrome.storage.local.set({'GB_PlayTime': PlayTime});

				for (const clkResult of injectionResults){
					_DEBUG_Print('run_clk_link: ' + clkResult.result + ' : ' + FL);

					if ("0" ==clkResult.result){
						// 링크가 클릭되지 않을 경우....
						_DEBUG_Print('run_clk_link Failed! : ' + FL);
					}
				}

			});
		}); /* GB_FL */
	}); /* GB_TID */

}
/* 끝 ------------------------------------------------------- */


/* 다음 스크롤페이지 시작 ------------------------------------------ */
function get_app_pos(){
	var ytd=document.getElementsByTagName('ytd-app');
	var vele=ytd.item(0);
	var targetTop=vele.scrollHeight;

	return targetTop;
}
/* 끝 ------------------------------------------------------- */


/* 스크롤 위치 ------------------------------------------------ */
function get_cur_pos(){
	if (typeof window !== "undefined") {
		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

		var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
		return y.toFixed() +'|'+ window.scrollY.toFixed();
//		return window.scrollY;
	}else{
		return "-1";
	}
}
/* 끝 ------------------------------------------------------- */


/* search_query --------------------------------------------- */
function get_search_query(){
	var inp=document.getElementsByName('search_query');
	if (0<inp.length){
		return inp[0].value;
	}else{
		return "";
	}
}
/* 끝 ------------------------------------------------------- */


/* 다음 스크롤페이지 시작 ------------------------------------------ */
function move_next(targetTop, cur_pos){
	var min=Math.ceil(20);
	var max=Math.floor(70);
	var getRandomInt=Math.floor(Math.random()*(max-min))+min;

	if (typeof window !== "undefined") {

		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

		var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
		var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

		if (cur_pos < targetTop){
//			window.scrollTo(0,window.scrollY + getRandomInt);
//			return window.scrollY + getRandomInt;
			window.scrollTo(0, (y+getRandomInt));
			return (y+getRandomInt);
		}else{
//			return window.scrollY;
			return y;
		}
	}else{
		return "-1";
	}
}
/* 끝 ------------------------------------------------------- */


/* 다음 스크롤페이지 시작 ------------------------------------------ */
function run_next_page() {

	chrome.storage.local.get('GB_TID', function(result){
		TID = result.GB_TID;

		chrome.storage.local.get('GB_cur_pos', function(result1){
			cur_pos=result1.GB_cur_pos;

			chrome.storage.local.get('GB_targetTop', function(result11){
				targetTop=result11.GB_targetTop;
				_DEBUG_Print('run_next_page: ' + cur_pos.toFixed() + '/'+ targetTop);


				chrome.scripting.executeScript(
				{
					target: {tabId: TID},
					func: get_cur_pos,
				}, (injectionResults) => {

					for (const posResult of injectionResults){
						_DEBUG_Print("get_cur_pos : " + posResult.result);
					}
				}); /* get_cur_pos */


				chrome.scripting.executeScript(
				{
					target: {tabId: TID},
					func: get_search_query,
				}, (injectionResults) => {

					for (const queryResult of injectionResults){

						search_query = queryResult.result;
						search_query = search_query.trim();
						chrome.storage.local.set({'GB_search_query': search_query});

						_DEBUG_Print("search_query : " + search_query);

						if (0 < search_query.length){
							chrome.scripting.executeScript(
							{
								target: {tabId: TID},
								func: move_next,
								args: [targetTop, cur_pos],
							},
							(injectionResults) => {

								for (const moveResult of injectionResults){

									cur_pos = Number(moveResult.result);
									chrome.storage.local.set({'GB_cur_pos': cur_pos});

									if (Number(moveResult.result) < targetTop){
/*										_DEBUG_Print('move_next_1: ' + moveResult.result); */

										chrome.alarms.create('alarm_run_next_page', {when: Date.now() + scr_wait()});
									}else if ("-1" == moveResult.result){
										_DEBUG_Print('move_next_-1: ' + moveResult.result);

										chrome.alarms.create('alarm_run_next_page', {when: Date.now() + scr_wait()});
									}else{
										_DEBUG_Print('move_next_0: ' + moveResult.result);

										_DEBUG_Print("ARM_GFV : " + Date.now());
										chrome.storage.local.set({'ARM_GFV': Date.now()});

										chrome.alarms.create('alarm_go_findvideo', {when: Date.now() + scr_wait()});
									}
								}
							});  /* move_next */
						}else{	//  종료하고

							_DEBUG_Print("ARM_SRT : " + Date.now());
							chrome.storage.local.set({'ARM_SRT': Date.now()});
							chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});
						}
					}
				}); /* get_search_query */

			}); /* GB_targetTop */
		}); /* GB_cur_pos */
	}); /* GB_TID */

}
/* 끝 ------------------------------------------------------- */


/* 시청할 영상 찾기 시작 ------------------------------------------ */
function find_video(MC, PV, WL){

	var V=new Array();	/* 시청한 영상 목록 Played Video */

	var ytd=document.getElementsByTagName('ytd-video-renderer');
	for(var i=0; i<ytd.length; i++){
		var vele=ytd.item(i);
		var cn='';
		var more=vele.getElementsByTagName('ytd-channel-name');
		if (0<more.length){
			var rvele=more.item(0);
			var ycn=rvele.getElementsByTagName('A');
			for(var k=0; k<ycn.length; k++){
				var cycn=ycn.item(k);
				cn=cycn.getAttribute('href').trim();
			}
		}

		var isMyChannel=false;
		for(var j=0; j<MC.length; j++){
			if (MC[j].includes(cn)){
				isMyChannel=true;
			}
		}

		if (isMyChannel){
			var vl='';
			var more=vele.getElementsByTagName('ytd-thumbnail');
			if (0<more.length){
				var rvele=more.item(0);
				var ycn=rvele.getElementsByTagName('A');
				for(var k=0; k<ycn.length; k++){
					var cycn=ycn.item(k);
					vl=cycn.getAttribute('href').trim();
				}
			}

			var isWatchVideo=false;
			for(var l=0; l<PV.length; l++){
				if(PV[l].includes(vl)){
					isWatchVideo=true;
				}
			}

			if (vl.substr(0,9)=="/watch?v="){
				if (0==WL){
					V.push(vl);
				}else{
					if (!isWatchVideo){
						V.push(vl);
					}
				}
			}
		} /* isMyChannel */
	} /* for  */

	return V;
}


/* 시청할 영상 찾기 시작 ------------------------------------------ */
function go_findvideo(e){

	chrome.storage.local.remove('ARM_GFV',function() { });
	_DEBUG_Print("ARM_GFV : -");

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		status=5;
		chrome.storage.local.set({'GB_status': 5});

		var TID=-1;		/* 실행 탭 ID */
		chrome.storage.local.get('GB_TID', function(result){
			TID = result.GB_TID;

			chrome.storage.local.get('GB_MC', function(data){
				MC = data.GB_MC;

				chrome.storage.local.get('GB_PV', function(data1){
					PV = data1.GB_PV;

					_DEBUG_Print("go_findvideo() : " + status);
					_DEBUG_Print("YT_WL : " + YT_WL);
					_DEBUG_Print('MC: (' + MC.length + ') '+ MC);
					_DEBUG_Print('PV: (' + PV.length + ') '+ PV);

					chrome.storage.local.get('YT_WL', function(result2){
						YT_WL=result2.YT_WL;

						myVideo=[];
						chrome.scripting.executeScript(
						{
							target: {tabId: TID},
							func: find_video,
							args: [MC, PV, YT_WL],
						},
						(injectionResults) => {

							for (const findResult of injectionResults){

								_DEBUG_Print('find_video arrays: ' + findResult.result);

								if (findResult.result){
									for (var k=0;k<findResult.result.length;k++){
										var v=findResult.result[k];
										myVideo.push(v);
									}
								}

							}

							_DEBUG_Print('find_video: ' + myVideo.length);

							if (0<myVideo.length){
								var min=Math.ceil(0);
								var max=Math.floor(myVideo.length-1);
								var randomNum=Math.floor(Math.random()*(max-min))+min;

								FL=myVideo[randomNum];
								chrome.storage.local.set({'GB_FL': FL});

								_DEBUG_Print('FL: ' + FL + ' [' + randomNum + ']');

								/* PV.push(FL) */
								chrome.storage.local.get('GB_PV', function(data){
									PV = data.GB_PV;

									chrome.storage.local.get('GB_FL', function(data1){
										FL = data1.GB_FL;

										PV.push(FL);
										chrome.storage.local.set({'GB_PV': PV});
									});
								});

								//find_href(VL);
								_DEBUG_Print("ARM_RFH : " + Date.now());
								chrome.storage.local.set({'ARM_RFH': Date.now()});

								chrome.alarms.create('alarm_run_find_href', {when: Date.now() + 10});
							}else{

								chrome.scripting.executeScript(
								{
									target: {tabId: TID},
									func: get_app_pos,
								}, (injectionResults) => {

									for (const app_posResult of injectionResults){
										_DEBUG_Print('app_posResult: ' + app_posResult.result);

										targetTop = Number(app_posResult.result);
										chrome.storage.local.set({'GB_targetTop': targetTop});
									}

									chrome.storage.local.get('GB_scrpage', function(result11){
										scrpage=result11.GB_scrpage;
										_DEBUG_Print('scrpage: ' + scrpage);

										if(scrpage<100){
											scrpage++;
											chrome.storage.local.set({'GB_scrpage': scrpage});

											chrome.alarms.create('alarm_run_next_page', {when: Date.now()+10});
										}else{ 
											_DEBUG_Print('이미 100페이지를 넘었습니다!');

											_DEBUG_Print("ARM_SRT : " + Date.now());
											chrome.storage.local.set({'ARM_SRT': Date.now()});
											chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});
										}
									}); /* GB_scrpage */
								});
							}
						});
					}); /* YT_WL */
				}); /* YT_PV */
			}); /* YT_MC */
		}); /* GB_TID */
	}); /* GB_WCR */

}
/* 끝 ------------------------------------------------------- */
/* ######################################################### */


/* ######################################################### */
/* 영상 시청 시작 ----------------------------------------------- */
function check_endscreen(){
	var ytes=document.getElementsByClassName('ytp-progress-bar');
	if (0<ytes.length){
		var cycn=ytes.item(0);
		var vmax=cycn.getAttribute('aria-valuemax').trim();
		var vnow=cycn.getAttribute('aria-valuenow').trim();
		if(0<vmax.length){
			if(vmax==vnow){
				return 'END';
			}else{
				return 'PLAY';
			}
		}else{
			return 'PLAY';
		}
	}else{
		return 'PLAY';
	}
}
/* 끝 ------------------------------------------------------- */


/* 영상 시청 시작 ----------------------------------------------- */
function go_watchvideo(e){

	_DEBUG_Print("go_watchvideo : e");
	chrome.storage.local.remove('ARM_GWV',function() { });

	chrome.storage.local.get('GB_status', function(result10){
		if (result10.GB_status===undefined){
			status = '';
		}else{
			_DEBUG_Print("go_watchvideo : GB_status - " + result10.GB_status);

			if ((5<Number(result10.GB_status)) && (Number(result10.GB_status)<8)){

				chrome.storage.local.get('GB_WCR', function(result){
					if (!result.GB_WCR){ return; }

					chrome.storage.local.get('GB_TID', function(result0){
						TID = result0.GB_TID;

						chrome.storage.local.get('GB_TL', function(result1){
							YT_TL = result1.GB_TL;
//							_DEBUG_Print('YT_TL : ' + YT_TL);

							status=7;
							chrome.storage.local.set({'GB_status': 7});

							chrome.storage.local.get('GB_PlayTime', function(result11){

								chrome.storage.local.get('GB_TVT', function(result110){
									TVT=Number(result110.GB_TVT);

									var CT=new Date();
									var CTV=CT.getTime();

									PlayTime=Number.parseInt((CTV-TVT)/1000);
									_DEBUG_Print('PlayTime: ' + CTV + ' ' + TVT + ' ' + PlayTime);

//									PlayTime = Number(result11.GB_PlayTime);
//									PlayTime++;
									chrome.storage.local.set({'GB_PlayTime': PlayTime});

//									_DEBUG_Print('GB_PlayTime: ' + PlayTime);

									if (1==PlayTime){/*
										chrome.storage.local.get('GB_PV', function(data){
											PV = data.GB_PV;

											chrome.storage.local.get('GB_FL', function(data1){
												FL = data1.GB_FL;

												PV.push(FL);
												chrome.storage.local.set({'GB_PV': PV});
											});
										});*/
									}

									chrome.storage.local.get('GB_WCM', function(result111){
										WCM = Number(result111.GB_WCM);

										_DEBUG_Print('check_endscreen(): ');

										chrome.scripting.executeScript(
										{
											target: {tabId: TID},
											func: check_endscreen,
										},
										(injectionResults) => {

											for (const watchResult of injectionResults){

												if (watchResult.result){
													_DEBUG_Print('watchvideo: ' + watchResult.result + ' ' + PlayTime + ' ' + YT_TL);
												}

												if ('PLAY'==watchResult.result){
													if (PlayTime == 1){
														_DEBUG_Print("ARM_CMV : " + Date.now());
														chrome.storage.local.set({'ARM_CMV': Date.now()});

														chrome.alarms.create('alarm_check_video', {when: Date.now() + 1*1000});
													}

													if (-1 == YT_TL){
														_DEBUG_Print("ARM_GWV(-1) : " + Date.now());
														chrome.storage.local.set({'ARM_GWV': Date.now()});
														chrome.alarms.create('alarm_go_watchvideo', {when: Date.now() + 1*1000});
													}else if (PlayTime < YT_TL){
														_DEBUG_Print("ARM_GWV(<) : " + Date.now());
														chrome.storage.local.set({'ARM_GWV': Date.now()});
														chrome.alarms.create('alarm_go_watchvideo', {when: Date.now() + 1*1000});
													}else{
														PlayEnd=1;
														chrome.storage.local.set({'GB_PlayEnd': PlayEnd});

														status=8;
														chrome.storage.local.set({'GB_status': status});

														if(1==WCM){
															_DEBUG_Print('send_log(P): ');

															send_log();	// write log
														}else{
															send_log_local();

															init();

															_DEBUG_Print("ARM_SRT : " + Date.now());
															chrome.storage.local.set({'ARM_SRT': Date.now()});
															chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});
														}
													}
												}else{
													chrome.storage.local.get('GB_status', function(result1111){
														status = Number(result1111.GB_status);

														if (7 == status){
															PlayEnd=1;
															chrome.storage.local.set({'GB_PlayEnd': PlayEnd});

															status=8;
															chrome.storage.local.set({'GB_status': status});

															if(1==WCM){
																_DEBUG_Print('send_log(E): ');

																send_log();	// write log
															}else{
																send_log_local();

																init();

																_DEBUG_Print("ARM_SRT : " + Date.now());
																chrome.storage.local.set({'ARM_SRT': Date.now()});
																chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});
															}
														}
													}); /* GB_status */
												}
											}
										});

										var sl=PlayTime % 60;
										if (0==sl){
											if(1==WCM){
												_DEBUG_Print('send_log(60): ');

												send_log();
											}else{

											}
										}
									}); /* GB_WCM */
								}); /* GB_TVT */
							}); /* GB_PlayTime */
						}); /* YT_TL */
					}); /* GB_TID */
				}); /* GB_WCR */
			}else{
				_DEBUG_Print("GB_status : " + result10.GB_status);
			}
		}
	}); /* GB_status */

}
/* 끝 ------------------------------------------------------- */
/* ######################################################### */


/* ######################################################### */
/* 좋아요 클릭 시작 ---------------------------------------------- */
function go_set_like(e){

	chrome.storage.local.remove('ARM_SLI',function() { });
	_DEBUG_Print("ARM_SLI : -");

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		chrome.storage.local.get('GB_TID', function(result1){
			TID = result1.GB_TID;

			chrome.storage.local.get('GB_LogIn', function(result11){
				LogIn=result11.GB_LogIn;

				chrome.storage.local.get('GB_Like', function(result111){
					Like=result111.GB_Like;

					if(1==LogIn && 0==Like){

						chrome.scripting.executeScript(
						{
							target: {tabId: TID},
							func: set_like,
						},
						(injectionResults) => {

							for (const likeResult of injectionResults){

								if (likeResult.result){
									_DEBUG_Print('go_set_like: ' + likeResult.result);
								}

								if ('T'==likeResult.result){
									Like=1;
									chrome.storage.local.set({'GB_Like': Like});
								}

								_DEBUG_Print("ARM_CLI : " + Date.now());
								chrome.storage.local.set({'ARM_CLI': Date.now()});

								chrome.alarms.create('alarm_go_check_like', {when: Date.now() + 3*1000});

							}
						});
					}			
				}); /* GB_Like */
			}); /* GB_LogIn */
		}); /* GB_TID */
	}); /* GB_WCR */
}
/* 끝 ------------------------------------------------------- */


/* 좋아요 클릭 시작 ---------------------------------------------- */
function set_like(e){

	var r='F';
	var mc=document.getElementById('menu-container');
	if (mc){
		var ytbr=mc.getElementsByTagName('ytd-toggle-button-renderer');
		if (0<ytbr.length){
			var event1=document.createEvent('MouseEvents');
			event1.initEvent('mousedown',true,true);
			ytbr[0].dispatchEvent(event1);

			var event2=document.createEvent('MouseEvents');
			event2.initEvent('click',true,true);
			ytbr[0].dispatchEvent(event2);
			r='T';
		}
	}
	return r;
}
/* 끝 ------------------------------------------------------- */


/* 좋아요 검사 시작 ---------------------------------------------- */
function go_check_like(e){

	chrome.storage.local.remove('ARM_CLI',function() { });
	_DEBUG_Print("ARM_CLI : -");

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		chrome.storage.local.get('GB_TID', function(result){
			TID = result.GB_TID;

			chrome.storage.local.get('GB_LogIn', function(result){
				LogIn=result.GB_LogIn;

				status=7;
				chrome.storage.local.set({'GB_status': 7});

				chrome.scripting.executeScript(
				{
					target: {tabId: TID},
					func: check_like,
				},
				(injectionResults) => {

					for (const likeResult of injectionResults){

						if (likeResult.result){
							_DEBUG_Print('go_check_like: ' + likeResult.result);
						}

						if ('F'==likeResult.result){
							if(1==LogIn){
								_DEBUG_Print("ARM_SLI : " + Date.now());
								chrome.storage.local.set({'ARM_SLI': Date.now()});

								chrome.alarms.create('alarm_go_set_like', {when: Date.now() + 10});
							}
						}

					}
				});
			}); /* GB_LogIn */
		}); /* GB_TID */
	}); /* GB_WCR */

}
/* 끝 ------------------------------------------------------- */


/* 좋아요 검사 시작 ---------------------------------------------- */
function check_like(e){

	var r='F';
	var mc=document.getElementById('menu-container');
	if (mc){
		var ytbr=mc.getElementsByTagName('button');
		if (0<ytbr.length){
			var vele=ytbr.item(0);
			var str=vele.getAttribute('aria-pressed');
			if(str.includes('false')){
				r='F';
			}else{
				r='T';
			}
		}
	}
	return r;
}
/* 끝 ------------------------------------------------------- */
/* ######################################################### */


/* ######################################################### */
/* 구독 클릭 시작 ---------------------------------------------- */
function set_subscribe(e){

	var r='F';
	var mc=document.getElementsByTagName('tp-yt-paper-button');
	if(mc){
		for(var i=0;i<mc.length;i++){
			var ele=mc.item(i);
			if(ele.getAttribute('noink') === null){
			}else{
				var event1=document.createEvent('MouseEvents');
				event1.initEvent('mousedown',true,true);
				ele.dispatchEvent(event1);

				var event2=document.createEvent('MouseEvents');
				event2.initEvent('click',true,true);
				ele.dispatchEvent(event2);
				r='T';
				break;
			}
		}
	}
	return r;
}
/* 끝 ------------------------------------------------------- */


/* 구독 클릭 시작 ---------------------------------------------- */
function go_set_subscribe(e){

	chrome.storage.local.remove('ARM_SSS',function() { });
	_DEBUG_Print("ARM_SSS : -");

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		chrome.storage.local.get('GB_TID', function(result){
			TID = result.GB_TID;

			chrome.storage.local.get('GB_LogIn', function(result){
				LogIn=result.GB_LogIn;

				chrome.storage.local.get('GB_Subscribe', function(result){
					Subscribe=result.GB_Subscribe;

					if(1==LogIn && 0==Subscribe){

						chrome.scripting.executeScript(
						{
							target: {tabId: TID},
							func: set_subscribe,
						},
						(injectionResults) => {

							for (const set_subscribeResult of injectionResults){

								if (set_subscribeResult.result){
									_DEBUG_Print('go_set_subscribe: ' + set_subscribeResult.result);
								}

								if ("T" == set_subscribeResult.result){
									Subscribe=1;
									chrome.storage.local.set({'GB_Subscribe': Subscribe});
								}

								_DEBUG_Print("ARM_CLI : " + Date.now());
								chrome.storage.local.set({'ARM_CLI': Date.now()});

								chrome.alarms.create('alarm_go_check_like', {when: Date.now() + 1*1000});
							}
						});
					}
				}); /* GB_Subscribe */
			}); /* GB_LogIn */
		}); /* GB_TID */
	}); /* GB_WCR */
}
/* 끝 ------------------------------------------------------- */


/* 구독 검사 시작 ----------------------------------------------- */
function check_subscribe(e){

	var r='F';
	var mc=document.getElementsByTagName('tp-yt-paper-button');
	if(mc){
		for(var i=0;i<mc.length;i++){
			var sbn=mc.item(i);
			if(sbn.getAttribute('subscribed') === null){
			}else{
				r='T'; break;
			}
		}
	}
	return r;
}
/* 끝 ------------------------------------------------------- */


/* 구독 검사 시작 ----------------------------------------------- */
function go_check_subscribe(e){

	chrome.storage.local.remove('ARM_CSS',function() { });
	_DEBUG_Print("ARM_CSS : -");

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		chrome.storage.local.get('GB_TID', function(result){
			TID = result.GB_TID;

			chrome.storage.local.get('GB_LogIn', function(result){
				LogIn=result.GB_LogIn;

				status=7;
				chrome.storage.local.set({'GB_status': 7});

				chrome.scripting.executeScript(
				{
					target: {tabId: TID},
					func: check_subscribe,
				},
				(injectionResults) => {

					for (const subscribeResult of injectionResults){

						/* 구독 검사결과 시작 ---------------------------------- */
						if (subscribeResult.result){
							_DEBUG_Print('go_check_subscribe: ' + subscribeResult.result);
						}

						if ('F'==subscribeResult.result){
							if(1==LogIn){
								_DEBUG_Print("ARM_SSS : " + Date.now());
								chrome.storage.local.set({'ARM_SSS': Date.now()});
								chrome.alarms.create('alarm_go_set_subscribe', {when: Date.now() + 3*1000});
							}
						}

						_DEBUG_Print("ARM_CLI : " + Date.now());
						chrome.storage.local.set({'ARM_CLI': Date.now()});

						chrome.alarms.create('alarm_go_check_like', {when: Date.now() + 1*1000});
						/* 끝 -------------------------------------------- */

					}
				});
			}); /* GB_LogIn */			
		}); /* GB_TID */
	}); /* GB_WCR */

}
/* 끝 ------------------------------------------------------- */
/* ######################################################### */


/* ######################################################### */
/* 로그인 검사 시작 ---------------------------------------------- */
function check_login(){

	var ytlog=document.getElementsByTagName('ytd-notification-topbar-button-renderer');
	if (0==ytlog.length){
		return 'F';
	}else{
		return 'T';
	}
}
/* 끝 ------------------------------------------------------- */


/* 로그인 검사 시작 ---------------------------------------------- */
function go_check_login(){

	chrome.storage.local.remove('ARM_CLN',function() { });
	_DEBUG_Print("ARM_CLN : -");

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		chrome.storage.local.get('GB_TID', function(result){
			TID = result.GB_TID;

			status=7;
			chrome.storage.local.set({'GB_status': 7});

			chrome.scripting.executeScript(
			{
				target: {tabId: TID},
				func: check_login,
			},
			(injectionResults) => {

				for (const loginResult of injectionResults){

					/* 로그인 검사 결과 시작 ------------------------------ */
					if (loginResult.result){
						_DEBUG_Print('go_check_login: ' + loginResult.result);
					}

					if ('T'==loginResult.result){ LogIn=1; }
					else{ LogIn=0; }

					chrome.storage.local.set({'GB_LogIn': LogIn});

					Subscribe=0;
					chrome.storage.local.set({'GB_Subscribe': Subscribe});

					Like=0;
					chrome.storage.local.set({'GB_Like': Like});

					_DEBUG_Print("ARM_CSS : " + Date.now());
					chrome.storage.local.set({'ARM_CSS': Date.now()});
					chrome.alarms.create('alarm_go_check_subscribe', {when: Date.now() + 1*1000});
					/* 끝 ------------------------------------------- */

				}
			});
		}); /* GB_TID */
	}); /* GB_WCR */

}
/* 끝 ------------------------------------------------------- */
/* ######################################################### */


/* ######################################################### */
/* 플레이 버튼 클릭 시작 ------------------------------------------ */
function play_button(){

	var ret=-1;
	var ytpb=document.getElementsByClassName('ytp-large-play-button');
	if (0<ytpb.length) {

		var ele=ytpb.item(0);
		var str=ele.getAttribute('display');
		if(str){
			if(str=="none"){
			}else{
				var event1=document.createEvent('MouseEvents');
				event1.initEvent('mousedown',true,true);
				ele.dispatchEvent(event1);

				var event2=document.createEvent('MouseEvents');
				event2.initEvent('click',true,true);
				ele.dispatchEvent(event2);
			}
		}
		return 0;
	}
	return ret;
}
/* 끝 ------------------------------------------------------- */


/* 플레이 버튼 클릭 시작 ------------------------------------------ */
function go_play_button(e){

	chrome.storage.local.remove('ARM_CMV',function() { });
	_DEBUG_Print("ARM_CMV : -");

	chrome.storage.local.get('GB_WCR', function(result){
		if (!result.GB_WCR){ return; }

		chrome.storage.local.get('GB_TID', function(result){
			TID = result.GB_TID;

			chrome.scripting.executeScript(
			{
				target: {tabId: TID},
				func: play_button,
			},
			(injectionResults) => {

				for (const playResult of injectionResults){

					_DEBUG_Print('go_play_button: ' + playResult.result);

				}
			});

//			_DEBUG_Print('go_play_button: ');

			_DEBUG_Print("ARM_CLN : " + Date.now());
			chrome.storage.local.set({'ARM_CLN': Date.now()});
			chrome.alarms.create('alarm_go_check_login', {when: Date.now() + 3*1000});			
		}); /* GB_TID */
	}); /* GB_WCR */

}
/* 끝 ------------------------------------------------------- */
/* ######################################################### */


/* check_video ------------------------------------------ */
function check_video(e){

	go_play_button();

}
/* 끝 ------------------------------------------------------- */


/* Popup과 Connect ------------------------------------------ */
chrome.runtime.onConnect.addListener(function (externalPort) {
	externalPort.onDisconnect.addListener(function () {
		_DEBUG_Print("onDisconnect");

		// Do stuff that should happen when popup window closes here
		YTPR=0;
		chrome.storage.local.set({'GB_YTPR': 0});
	});

	chrome.storage.local.get('GB_CNTPP', function(result){
		CNTPP = Number(result.GB_CNTPP) + 1;
		chrome.storage.local.set({'GB_CNTPP': CNTPP});
	});

	_DEBUG_Print("onConnect : " + CNTPP);

	YTPR=1;
	chrome.storage.local.set({'GB_YTPR': 1});
});
/* 끝 ------------------------------------------------------- */


/* 미션시작 초기화 ----------------------------------------------- */
function init(){

	var WCM=0;		/* 실행 모드, 0:테스트, 1:미션 */
	chrome.storage.local.get('GB_WCM', function(result){
		WCM = result.GB_WCM;

		status=-1;
		chrome.storage.local.set({'GB_status': -1});

		VL='';
		chrome.storage.local.set({'GB_FL': ''});

		LogIn=0;		/* LogIn check */
		chrome.storage.local.set({'GB_LogIn': LogIn});

		Subscribe=0;	/* Subscribe check */
		Like=0;			/* Like check */

		PlayTime=0;
		chrome.storage.local.set({'GB_PlayTime': PlayTime});

		if(1==WCM){
			query='';
			MC=[];
			chrome.storage.local.set({'GB_MC': MC});
		}else{
			query='';
			MC=[];
			chrome.storage.local.set({'GB_MC': MC});
		}
	}); /* GB_WCM */

}
/* 끝 ------------------------------------------------------- */


/* 미션 시작 -------------------------------------------------- */
function start(){
	chrome.storage.local.remove('ARM_SRT',function() { });
	_DEBUG_Print("ARM_SRT : -");

	chrome.storage.local.set({'GB_CNTPP': 0});

	init();

	var WCM=0;		/* 실행 모드, 0:패널, 1:서버 */
	chrome.storage.local.get('GB_WCM', function(result){
		WCM = result.GB_WCM;

		if(1==WCM){
			chrome.alarms.create('alarm_get_data', {when: Date.now() + 1000});
		}else{
			status=1;
			chrome.storage.local.set({'GB_status': -1});

			_DEBUG_Print("ARM_GYT : " + Date.now());
			chrome.storage.local.set({'ARM_GYT': Date.now()});

			chrome.alarms.create('alarm_get_panneldata', {when: Date.now() + 1000});
//			chrome.alarms.create('alarm_go_youtube', {when: Date.now() + 3*1000});
		}
	}); /* GB_WCM */

}
/* 끝 ------------------------------------------------------- */


/* 알람 종료 -------------------------------------------------- */
function alarm_clear_go_watchvideo(){
	_DEBUG_Print("alarm_clear_go_watchvideo() : ");
}
/* 끝 ------------------------------------------------------- */



/* 미션 시작 -------------------------------------------------- */
function mon(){
	chrome.storage.local.remove('ARM_MON',function() { });
	_DEBUG_Print("ARM_MON : -");

	chrome.storage.local.get('GB_ST', function(result){
		var STV=result.GB_ST;

		var CT=new Date();
		var CTV=CT.getTime();

		interval=(CTV-STV)/1000;

		_DEBUG_Print("interval-i : " + String(interval));

		chrome.storage.local.get('GB_WCR', function(result){
			if (!result.GB_WCR){ return; }

			WCR = result.GB_WCR;

			chrome.storage.local.get('GB_status', function(result){
				status = result.GB_status;

				chrome.storage.local.get('GB_pstatus', function(result){
					pstatus = result.GB_pstatus;

					chrome.storage.local.get('GB_cstatus', function(result){
						cstatus = result.GB_cstatus;

						if(WCR){
							if (status!=pstatus){
								cstatus=0;
								chrome.storage.local.set({'GB_cstatus': status});

								pstatus=status;
								chrome.storage.local.set({'GB_pstatus': pstatus});
							}

							cstatus++;
							chrome.storage.local.set({'GB_cstatus': cstatus});

							if (status<=6){

								if(60<cstatus){
									var ct=new Date();

									_DEBUG_Print("cstatus : " + status + " | " + cstatus + " | " + ct);

									// 영상 시청이 아닌 상태가 1분 이상 지속시 초기화 및 재시작
									chrome.alarms.clear('alarm_go_watchvideo', alarm_clear_go_watchvideo);


									cstatus=0;
									chrome.storage.local.set({'GB_cstatus': cstatus});

									status=-1;
									chrome.storage.local.set({'GB_status': status});

									pstatus=status;
									chrome.storage.local.set({'GB_pstatus': pstatus});

									_DEBUG_Print("ARM_SRT : " + Date.now());
									chrome.storage.local.set({'ARM_SRT': Date.now()});
									chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});
								}
							}else{
								if((VL=="https://www.youtube.com")||(VL=="https://www.youtube.com/")){
									var ct=new Date();

									_DEBUG_Print("cstatus : " + status + " | " + cstatus + " | " + VL);

									// 시청할 영상을 클릭했는데, 영상이 플레이 안되면 초기화 및 재시작
									chrome.alarms.clear('alarm_go_watchvideo', alarm_clear_go_watchvideo);


									cstatus=0;
									chrome.storage.local.set({'GB_cstatus': cstatus});

									status=-1;
									chrome.storage.local.set({'GB_status': status});

									pstatus=status;
									chrome.storage.local.set({'GB_pstatus': pstatus});

									_DEBUG_Print("ARM_SRT : " + Date.now());
									chrome.storage.local.set({'ARM_SRT': Date.now()});
									chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});
								}else{
									// 시청할 영상을 클릭했는데, 영상이 플레이 안되면 초기화 및 재시작
									chrome.storage.local.get('GB_TL', function(result1){
										YT_TL = result1.GB_TL;

										chrome.storage.local.get('GB_PlayTime', function(result11){
											PlayTime = Number(result11.GB_PlayTime);

											var cs = (Number(cstatus) * 10);// + 600;
											_DEBUG_Print("cstatus2 : " + status + " | " + cstatus + " | " + PlayTime + " | " + YT_TL+ " | " + cs);

											if (-1 == YT_TL){
											}else if (PlayTime < YT_TL){
											}else{
												if (YT_TL < cs){
													chrome.alarms.clear('alarm_go_watchvideo', alarm_clear_go_watchvideo);

													PlayEnd=1;
													chrome.storage.local.set({'GB_PlayEnd': PlayEnd});

													status=8;
													chrome.storage.local.set({'GB_status': status});

													_DEBUG_Print("cstatus2 : " + YT_TL + " | " + cs);

													if(1==WCM){
														_DEBUG_Print('send_log(M): ');

														send_log();	// write log

														cstatus=0;
														chrome.storage.local.set({'GB_cstatus': cstatus});

														status=-1;
														chrome.storage.local.set({'GB_status': status});

														pstatus=status;
														chrome.storage.local.set({'GB_pstatus': pstatus});

														_DEBUG_Print("ARM_SRT : " + Date.now());
														chrome.storage.local.set({'ARM_SRT': Date.now()});
														chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});
													}else{
														send_log_local();

														init();

														_DEBUG_Print("ARM_SRT : " + Date.now());
														chrome.storage.local.set({'ARM_SRT': Date.now()});
														chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});
													}
												}
											}
										}); /* GB_PlayTime */
									}); /* YT_TL */
								}
							}
						}else{
							_DEBUG_Print("cstatus : " + status + " | " + cstatus + " | " + ct + " | WCR : " + WCR);
						}
					});	/* GB_cstatus */
				});	/* GB_pstatus */
			});	/* GB_status */

			_DEBUG_Print("ARM_MON : " + Date.now());
			chrome.storage.local.set({'ARM_MON': Date.now()});
			chrome.alarms.create('alarm_mon', {when: Date.now() + 10*1000});
		});	/* GB_WCR */
	});	/* GB_ST */

}
/* 끝 ------------------------------------------------------- */


/* 미션 가져오기 ------------------------------------------------ */
function get_panneldata(){
	var ct=new Date();

	VL='';
	status=0;
	LogCnt=0;
	PlayEnd=0;
	mcode='';

	chrome.storage.local.set({'GB_VL': ''});
	chrome.storage.local.set({'GB_status': 0});
	chrome.storage.local.set({'GB_LogCnt': 0});
	chrome.storage.local.set({'GB_PlayEnd': 0});
	chrome.storage.local.set({'GB_mcode': ''});

	/* YT_SS */
	var w_ss=0;	// 패널모드는 구독 공유 안됨....

	/* YT_WL */
	chrome.storage.local.get('YT_WL', function(result13){
		YT_WL = result13.YT_WL;

		_DEBUG_Print('YT_WL : ' + YT_WL);
	});

	/* YT_TL */
	chrome.storage.local.get('YT_TL', function(result14){
		if (result14.YT_TL===undefined){
		}else{
			if ("-1"==result14.YT_TL){
				YT_TL = -1;
			}else{
				var min=Math.ceil(-300);
				var max=Math.floor(0);
				var getRandomInt=Math.floor(Math.random()*(max-min))+min;

				_DEBUG_Print('getRandomInt : ' + getRandomInt);

				var timelimit = result14.YT_TL;
				YT_TL = timelimit.replace(/Minutes/g, '') * 60;

				YT_TL = YT_TL + getRandomInt;
			}

			chrome.storage.local.set({'GB_TL': YT_TL});

			_DEBUG_Print('YT_TL : ' + YT_TL);
		}
	});

	/* YT_RS */
	chrome.storage.local.get('YT_RS', function(result15){
		if (result15.YT_RS===undefined){
		}else{
			if (-1==result15.YT_RS){
				YT_RS = result15.YT_RS;
			}else{
				YT_RS = result15.YT_RS; // 시간
				YT_RS = YT_RS.replace(/Hours/g, '');
			}

			_DEBUG_Print('YT_RS : ' + YT_RS);
		}
	});

	/* YT_SW */
	chrome.storage.local.get('YT_SW', function(result){
		if (result.YT_SW===undefined){
		}else{
			query=result.YT_SW;
			chrome.storage.local.set({'GB_query': query});

			_DEBUG_Print('JSON_MISSION : ' + query);
		}
	});

	/* YT_CN */
	chrome.storage.local.get('YT_CN', function(result){
		if (result.YT_CN===undefined){
		}else{
			MC.push(result.YT_CN);
			chrome.storage.local.set({'GB_MC': MC});
		}
	});

	chrome.storage.local.set({'GB_MYC': "0"});
	chrome.storage.local.set({'GB_MYS': "0"});
	chrome.storage.local.set({'GB_MYL': "0"});
	chrome.storage.local.set({'GB_MYW': "0"});

	chrome.storage.local.set({'GB_SHC': "0"});
	chrome.storage.local.set({'GB_SHS': "0"});
	chrome.storage.local.set({'GB_SHL': "0"});
	chrome.storage.local.set({'GB_SHW': "0"});

	status=1;
	chrome.storage.local.set({'GB_status': 1});

	_DEBUG_Print("ARM_GYT : " + Date.now());
	chrome.storage.local.set({'ARM_GYT': Date.now()});

	chrome.alarms.create('alarm_go_youtube', {when: Date.now() + 3*1000});
}
/* 끝 ------------------------------------------------------- */


/* 미션 가져오기 ------------------------------------------------ */
function get_data(){
	var ct=new Date();

	VL='';
	status=0;
	LogCnt=0;
	PlayEnd=0;
	mcode='';

	chrome.storage.local.set({'GB_VL': ''});
	chrome.storage.local.set({'GB_status': 0});
	chrome.storage.local.set({'GB_LogCnt': 0});
	chrome.storage.local.set({'GB_PlayEnd': 0});
	chrome.storage.local.set({'GB_mcode': ''});

	/* YT_WC */
	chrome.storage.local.get('YT_WC', function(result){
		w_code=result.YT_WC;

		/* YT_ID */
		chrome.storage.local.get('YT_ID', function(result1){
			if (result1.YT_ID===undefined){
			}else{
				w_id=result1.YT_ID;

				/* YT_SS */
				chrome.storage.local.get('YT_SS', function(result11){
					if (result11.YT_SS===undefined){
					}else{
						var w_ss=0;

						if (result11.YT_SS===0){
							w_ss="0";
						}else{
							w_ss="1";
						}

						var get_url="http://y.irank.kr/appl/json_mission.php" +
									"?pn=" + btoa(w_id) +
									"&gm=" + btoa(w_code) +
									"&ss=" + btoa(w_ss);

						_DEBUG_Print('get_data() : ' + get_url);

						fetch(get_url)
						.then(
							function(response) {

								if (response.status !== 200) {
									_DEBUG_Print('Looks like there was a problem. Status Code: ' + response.status);

									chrome.alarms.create('alarm_get_data', {when: Date.now() + 5*1000});
									return;
								}

								// Examine the text in the response
								response.text().then(function(data) {
									_DEBUG_Print('JSON_MISSION : ' + data);

									/* YT_WL */
									chrome.storage.local.get('YT_WL', function(result13){
										YT_WL = result13.YT_WL;

										_DEBUG_Print('YT_WL : ' + YT_WL);
									});

									/* YT_TL */
									chrome.storage.local.get('YT_TL', function(result14){
										if (result14.YT_TL===undefined){
										}else{
											if ("-1"==result14.YT_TL){
												YT_TL = -1;
											}else{
												var min=Math.ceil(-300);
												var max=Math.floor(0);
												var getRandomInt=Math.floor(Math.random()*(max-min))+min;

												_DEBUG_Print('getRandomInt : ' + getRandomInt);

												var timelimit = result14.YT_TL;
												YT_TL = timelimit.replace(/Minutes/g, '') * 60;

												YT_TL = YT_TL + getRandomInt;
											}
											chrome.storage.local.set({'GB_TL': YT_TL});

											_DEBUG_Print('YT_TL : ' + YT_TL);
										}
									});

									/* YT_RS */
									chrome.storage.local.get('YT_RS', function(result15){
										if (result15.YT_RS===undefined){
										}else{
											if (-1==result15.YT_RS){
												YT_RS = result15.YT_RS;
											}else{
												YT_RS = result15.YT_RS; // 시간
												YT_RS = YT_RS.replace(/Hours/g, '');
											}

											_DEBUG_Print('YT_RS : ' + YT_RS);
										}
									});

									/* JSON */
									query=JSON.parse(data).KW;
									mcode=JSON.parse(data).LC;
									mtype=JSON.parse(data).SE;
									wcode=JSON.parse(data).ID;
									category=JSON.parse(data).CA;

									if (JSON.parse(data).YC){
										for (var i = 0; i < JSON.parse(data).YC.length; i++){ 	
											MC.push(JSON.parse(data).YC[i]);
										}
										chrome.storage.local.set({'GB_MC': MC});
									}

									chrome.storage.local.set({'GB_query': query});
									chrome.storage.local.set({'GB_mcode': mcode});
									chrome.storage.local.set({'GB_mtype': mtype});
									chrome.storage.local.set({'GB_wcode': wcode});

									chrome.storage.local.set({'GB_MYC': JSON.parse(data).MYC});
									chrome.storage.local.set({'GB_MYS': JSON.parse(data).MYS});
									chrome.storage.local.set({'GB_MYL': JSON.parse(data).MYL});
									chrome.storage.local.set({'GB_MYW': JSON.parse(data).MYW});

									chrome.storage.local.set({'GB_SHC': JSON.parse(data).SHC});
									chrome.storage.local.set({'GB_SHS': JSON.parse(data).SHS});
									chrome.storage.local.set({'GB_SHL': JSON.parse(data).SHL});
									chrome.storage.local.set({'GB_SHW': JSON.parse(data).SHW});

									chrome.storage.local.set({'GB_SS': JSON.parse(data).SS});

									// 카테고리 11/12 
									if ("11"==category){		// 카테고리 11(Y 검색)이면
										status=1;
										chrome.storage.local.set({'GB_status': 1});

										_DEBUG_Print("ARM_GYT : " + Date.now());
										chrome.storage.local.set({'ARM_GYT': Date.now()});

										chrome.alarms.create('alarm_go_youtube', {when: Date.now() + 3*1000});
									}else if ("12"==category){	// 카테고리 12(Y 시청)이면
										status=5;
										chrome.storage.local.set({'GB_status': 5});

										chrome.storage.local.set({'GB_FL': JSON.parse(data).TU});
										_DEBUG_Print("CAT 12 : " + JSON.parse(data).TU);

										_DEBUG_Print("ARM_GYT : " + Date.now());
										chrome.storage.local.set({'ARM_GYT': Date.now()});

										chrome.alarms.create('alarm_go_youtube_view', {when: Date.now() + 3*1000});
									}
								});
							}
						)
						.catch(function(err) {
							_DEBUG_Print('Fetch Error :-S', err);

							chrome.alarms.create('alarm_get_data', {when: Date.now() + 5*1000});
						});
					}
				});	/* YT_SS */
			}
		});	/* YT_ID */
	});	/* YT_WC */

}
/* 끝 ------------------------------------------------------- */


/* 로그 전송 -------------------------------------------------- */
function send_log(){
	var CT=new Date();
	var CTV=CT.getTime();

	var uvl="";
//	chrome.storage.local.get('GB_VL', function(result){
	chrome.storage.local.get('GB_FL', function(result){
		VL=result.GB_FL;
		uvl=btoa(VL);

		chrome.storage.local.get('GB_LogCnt', function(result){
			LogCnt=Number(result.GB_LogCnt);
			LogCnt++;
			chrome.storage.local.set({'GB_LogCnt': LogCnt});

			var interval=0;
			chrome.storage.local.get('GB_ST', function(result){
				var STV=result.GB_ST;
				interval=CTV-STV;

				_DEBUG_Print("interval-i : " + String(interval/1000));

				var dinterval=0;
				chrome.storage.local.get('GB_DT', function(result){
					var DTV=result.GB_DT;
					dinterval=CTV-DTV;

					chrome.storage.local.get('YT_RS', function(result15){
						if (result15.YT_RS===undefined){
						}else{
							if (-1==result15.YT_RS){
								YT_RS = result15.YT_RS;
							}else{
								YT_RS = result15.YT_RS; // 시간
								YT_RS = YT_RS.replace(/Hours/g, '');
							}

							_DEBUG_Print('YT_RS : ' + YT_RS);

							_DEBUG_Print("YT_RS : " + String(YT_RS*60*60) + " <> " + String(dinterval/1000));

							if (Number(YT_RS*60*60) < Number(dinterval/1000)){
								DT=CT;
								var VDT = CT.getTime();
								chrome.storage.local.set({'GB_DT': VDT});

								PV=[];
								chrome.storage.local.set({'GB_PV': PV});

								_DEBUG_Print("dinterval init : " + String(dinterval/1000));
							}
						}

						chrome.storage.local.get('YT_ID', function(result){
							w_id=result.YT_ID;

							chrome.storage.local.get('YT_WC', function(result){
								w_code=result.YT_WC;

								chrome.storage.local.get('GB_wcode', function(result){
									wcode=result.GB_wcode;

									chrome.storage.local.get('GB_mcode', function(result){
										mcode=result.GB_mcode;

										chrome.storage.local.get('GB_query', function(result){
											query=result.GB_query;

											chrome.storage.local.get('GB_LogIn', function(result){
												LogIn=result.GB_LogIn;

												chrome.storage.local.get('GB_Subscribe', function(result){
													Subscribe=result.GB_Subscribe;
													_DEBUG_Print('Subscribe: ' + Subscribe);

													chrome.storage.local.get('GB_Like', function(result){
														Like=result.GB_Like;
														_DEBUG_Print('Like: ' + Like);

														chrome.storage.local.get('GB_PlayEnd', function(result){
															PlayEnd=result.GB_PlayEnd;

															chrome.storage.local.get('GB_SS', function(result){
																var w_ss=result.GB_SS;

																/* ------------------------------------------------ */
																var CT0=new Date();
																go_ip();	/* go_ip */
																var CT1=new Date();

																var sp=-1;
																sp=CT1.getTime()-CT0.getTime();
																_DEBUG_Print('go_ip(): ' + sp);

																chrome.scripting.executeScript(
																{
																	target: {tabId: TID},
																	func: go_ip,
																},
																(injectionResults) => {

																	var set_url="http://y.irank.kr/appl/setmissionlog.php" +
																				"?pn=" + btoa(w_id) +
																				"&gm=" + btoa(w_code) +
																				"&tp=" + "0" +
																				"&id=" + chrome.runtime.id +
																				"&wc=" + wcode +
																				"&mc=" + mcode +
																				"&qr=" + query +
																				"&yl=" + uvl +
																				"&pt=" + String(interval/1000) +
																				"&lg=" + String(LogIn) +
																				"&sc=" + String(Subscribe) +
																				"&lk=" + String(Like) +
																				"&lc=" + String(LogCnt) +
																				"&ss=" + String(w_ss);

																	if (1==PlayEnd){
																		_DEBUG_Print("Online() : dinterval-" + String(dinterval/1000) + " | set_url() : " + set_url);
																	}else{
																		_DEBUG_Print("Online() : dinterval-" + String(dinterval/1000));
																	}

																	fetch(set_url)
																	.then(
																		function(response) {
																			if (response.status !== 200) {
																				_DEBUG_Print('Looks like there was a problem. Status Code: ' + response.status);

																				init();

																				_DEBUG_Print("ARM_SRT : " + Date.now());
																				chrome.storage.local.set({'ARM_SRT': Date.now()});
																				chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});

																				return;
																			}

																			// Examine the text in the response
																			response.text().then(function(data) {
																				_DEBUG_Print('send_log : ' + set_url);

																				if (1==PlayEnd){
																					init();

																					_DEBUG_Print("ARM_SRT : " + Date.now());
																					chrome.storage.local.set({'ARM_SRT': Date.now()});
																					chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});
																				}
																			});
																		}
																	)
																	.catch(function(err) {
																		_DEBUG_Print('Fetch Error :-S', err);

																		init();

																		_DEBUG_Print("ARM_SRT : " + Date.now());
																		chrome.storage.local.set({'ARM_SRT': Date.now()});
																		chrome.alarms.create('alarm_start', {when: Date.now() + 1*1000});
																	});
																});
																/* ------------------------------------------------ */
															}); /* GB_SS */
														}); /* GB_PlayEnde */
													}); /* GB_Like */
												}); /* GB_Subscribe */
											}); /* GB_LogIn */
										}); /* GB_query */
									}); /* GB_mcode */
								}); /* GB_wcode */
							}); /* YT_WC */
						}); /* YT_ID */
					}); /* YT_RS */
				}); /* GB_DT */
			}); /* GB_ST */
		}); /* GB_LogCnt */
	}); /* GB_VL */

}
/* END ------------------------------------------------------- */


/* 로그 전송 -------------------------------------------------- */
function send_log_local(){
	var CT=new Date();
	var CTV=CT.getTime();

	var uvl="";
//	chrome.storage.local.get('GB_VL', function(result){
	chrome.storage.local.get('GB_FL', function(result){
		VL=result.GB_FL;
		uvl=btoa(VL);

		chrome.storage.local.get('GB_LogCnt', function(result){
			LogCnt=Number(result.GB_LogCnt);
			LogCnt++;
			chrome.storage.local.set({'GB_LogCnt': LogCnt});

			var interval=0;
			chrome.storage.local.get('GB_ST', function(result){
				var STV=result.GB_ST;
				interval=CTV-STV;

				_DEBUG_Print("interval-i : " + String(interval/1000));

				var dinterval=0;
				chrome.storage.local.get('GB_DT', function(result){
					var DTV=result.GB_DT;
					dinterval=CTV-DTV;

					chrome.storage.local.get('YT_RS', function(result15){
						if (result15.YT_RS===undefined){
						}else{
							if (-1==result15.YT_RS){
								YT_RS = result15.YT_RS;
							}else{
								YT_RS = result15.YT_RS; // 시간
								YT_RS = YT_RS.replace(/Hours/g, '');
							}

							_DEBUG_Print('YT_RS : ' + YT_RS);

							_DEBUG_Print("YT_RS : " + String(YT_RS*60*60) + " <> " + String(dinterval/1000));

							if (Number(YT_RS*60*60) < Number(dinterval/1000)){
								DT=CT;
								var VDT = CT.getTime();
								chrome.storage.local.set({'GB_DT': VDT});

								PV=[];
								chrome.storage.local.set({'GB_PV': PV});

								_DEBUG_Print("dinterval init : " + String(dinterval/1000));
							}
						}

						chrome.storage.local.get('YT_ID', function(result){
							w_id=result.YT_ID;

							chrome.storage.local.get('YT_WC', function(result){
								w_code=result.YT_WC;

								chrome.storage.local.get('GB_wcode', function(result){
									wcode=result.GB_wcode;

									chrome.storage.local.get('GB_mcode', function(result){
										mcode=result.GB_mcode;

										chrome.storage.local.get('GB_query', function(result){
											query=result.GB_query;

											chrome.storage.local.get('GB_LogIn', function(result){
												LogIn=result.GB_LogIn;

												chrome.storage.local.get('GB_Subscribe', function(result){
													Subscribe=result.GB_Subscribe;
													_DEBUG_Print('Subscribe: ' + Subscribe);

													chrome.storage.local.get('GB_Like', function(result){
														Like=result.GB_Like;
														_DEBUG_Print('Like: ' + Like);

														chrome.storage.local.get('GB_PlayEnd', function(result){
															PlayEnd=result.GB_PlayEnd;

															chrome.storage.local.get('GB_SS', function(result){
																var w_ss=result.GB_SS;

																/* ------------------------------------------------ */
																var CT0=new Date();
																go_ip();	/* go_ip */
																var CT1=new Date();

																var sp=-1;
																sp=CT1.getTime()-CT0.getTime();
																_DEBUG_Print('go_ip(): ' + sp);

																chrome.storage.local.get('LV_MYS', function(result){
																	if (result.LV_MYS===undefined){
																	}else{
																		if(1 == Subscribe) {
																			chrome.storage.local.set({'LV_MYC': Number(result.LV_MYC)+1});
																		}
																	}
																});

																chrome.storage.local.get('LV_MYL', function(result){
																	if (result.LV_MYL===undefined){
																	}else{
																		if(1 == Like) {
																			chrome.storage.local.set({'LV_MYS': Number(result.LV_MYS)+1});
																		}
																	}
																});

																chrome.storage.local.get('LV_MYC', function(result){
																	if (result.LV_MYC===undefined){
																	}else{
																		chrome.storage.local.set({'LV_MYC': Number(result.LV_MYC)+1});
																	}
																});

																chrome.storage.local.get('LV_MYW', function(result){
																	if (result.LV_MYW===undefined){
																	}else{
																		chrome.storage.local.set({'LV_MYW': Number(result.LV_MYW)+Number(interval/1000)});
																	}
																});

																/* ------------------------------------------------ */
															}); /* GB_SS */
														}); /* GB_PlayEnde */
													}); /* GB_Like */
												}); /* GB_Subscribe */
											}); /* GB_LogIn */
										}); /* GB_query */
									}); /* GB_mcode */
								}); /* GB_wcode */
							}); /* YT_WC */
						}); /* YT_ID */
					}); /* YT_RS */
				}); /* GB_DT */
			}); /* GB_ST */
		}); /* GB_LogCnt */
	}); /* GB_VL */

}
/* END ------------------------------------------------------- */


/* 상태정보 갱신 ------------------------------------------------ */
function LoadStorage(){


}
/* END ------------------------------------------------------- */


/* 로컬변수 삭제 ------------------------------------------------- */
function RemoveStorage(){

	WCR=false;

	chrome.storage.local.remove('GB_CNTPP',function() { });
	chrome.storage.local.remove('GB_cstatus',function() { });
	chrome.storage.local.remove('GB_cur_pos',function() { });
	chrome.storage.local.remove('GB_DT',function() { });
	chrome.storage.local.remove('GB_FL',function() { });
	chrome.storage.local.remove('GB_key_in',function() { });
	chrome.storage.local.remove('GB_Like',function() { });
	chrome.storage.local.remove('GB_LogCnt',function() { });
	chrome.storage.local.remove('GB_LogIn',function() { });
	chrome.storage.local.remove('GB_mcode',function() { });
	chrome.storage.local.remove('GB_mtype',function() { });
	chrome.storage.local.remove('GB_PlayEnd',function() { });
	chrome.storage.local.remove('GB_PlayTime',function() { });
	chrome.storage.local.remove('GB_pstatus',function() { });
	chrome.storage.local.remove('GB_query',function() { });
	chrome.storage.local.remove('GB_RT',function() { });
	chrome.storage.local.remove('GB_scrpage',function() { });
	chrome.storage.local.remove('GB_ST',function() { });
	chrome.storage.local.remove('GB_TVT',function() { });
	chrome.storage.local.remove('GB_status',function() { });
	chrome.storage.local.remove('GB_Subscribe',function() { });
	chrome.storage.local.remove('GB_targetTop',function() { });
	chrome.storage.local.remove('GB_TID',function() { });
	chrome.storage.local.remove('GB_VL',function() { });
	chrome.storage.local.remove('GB_WCM',function() { });
	chrome.storage.local.remove('GB_wcode',function() { });
	chrome.storage.local.remove('GB_WCR',function() { });
	chrome.storage.local.remove('GB_YTPR',function() { });
	chrome.storage.local.remove('GB_MC',function() { });
	chrome.storage.local.remove('GB_PV',function() { });
	chrome.storage.local.remove('GB_TL',function() { });
	chrome.storage.local.remove('GB_search_query',function() { });

	chrome.storage.local.remove('GB_MYC',function() { });
	chrome.storage.local.remove('GB_MYS',function() { });
	chrome.storage.local.remove('GB_MYL',function() { });
	chrome.storage.local.remove('GB_MYW',function() { });
	chrome.storage.local.remove('GB_SHC',function() { });
	chrome.storage.local.remove('GB_SHS',function() { });
	chrome.storage.local.remove('GB_SHL',function() { });
	chrome.storage.local.remove('GB_SHW',function() { });
	chrome.storage.local.remove('GB_SS',function() { });

	chrome.storage.local.remove('ARM_GWV',function() { });
	chrome.storage.local.remove('ARM_MON',function() { });
	chrome.storage.local.remove('ARM_VLO',function() { });

}
/* END ------------------------------------------------------- */


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
