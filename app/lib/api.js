/*********************
*** SETTING / API ***
**********************/
var API_DOMAIN = "gohr.geonn.com.my";
// APP authenticate user and key
var USER  = 'gohr';
var KEY   = '80175304721014532l49f7207c8943981';

var doLoginUrl = "http://"+API_DOMAIN+"/api/doLogin?user="+USER+"&key="+KEY;
var updateTokenUrl     = "http://"+API_DOMAIN+"/pando/api/getDeviceInfo?user="+USER+"&key="+KEY;

//API when app loading phase
var getItemListUrl            = "http://"+API_DOMAIN+"/pando/api/getItemList?user="+USER+"&key="+KEY;
var getItemResponseByUidUrl = "http://"+API_DOMAIN+"/pando/api/getItemResponseByUid?user="+USER+"&key="+KEY;

//API that call in sequence 
var APILoadingList = [
	//{url: getItemListUrl, model: "items", checkId: "1"},
	//{url: getItemResponseByUidUrl, model: "item_response", checkId: "2"},
];

/*********************
**** API FUNCTION*****
**********************/

// call API by post method
exports.callByPost = function(e, onload, onerror){
	
	var deviceToken = Ti.App.Properties.getString('deviceToken');
	if(deviceToken != ""){  
		var url = eval(e.url);
		console.log(url);
		var _result = contactServerByPost(url, e.params || {});   
		_result.onload = function(e) { 
			console.log('success callByPost');
			console.log(this.responseText);
			onload && onload(this.responseText); 
		};
		
		_result.onerror = function(ex) { 
			console.log("onerror "+url);
			API.callByPost(e, onload, onerror);
		};
	}
};

// call API by post method
exports.callByPostImage = function(e, onload, onerror) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	var url = eval(e.url);
	var _result = contactServerByPostImage(url, e.params || {});
	_result.onload = function(e) { 
		console.log('success');
		onload && onload(this.responseText); 
	};
	
	_result.onerror = function(ex) { 
		console.log("onerror");
		API.callByPostImage(e, onload);
		//onerror && onerror();
	};
};

// update user device token
exports.updateNotificationToken = function(e){
	
	var deviceToken = Ti.App.Properties.getString('deviceToken');
	if(deviceToken != ""){ 
		var records = {};
		records['version'] =  Ti.Platform.version;
		records['os'] =  Ti.Platform.osname;
		records['model'] =  Ti.Platform.model;
		records['macaddress'] =  Ti.Platform.macaddress;  
		records['token'] =  deviceToken;    
		var url = updateTokenUrl ;
		var _result = contactServerByPost(url,records);   
		_result.onload = function(e) {  
		};
		
		_result.onerror = function(e) { 
		};
	}
};

// send notification as message to other user
exports.sendNotification = function(e){
	var records = {};
	var u_id = Ti.App.Properties.getString('user_id') || 0;
	records['message'] = e.message;
	records['to_id'] = e.to_id;  
	records['u_id'] = u_id; 
	var url = sendNotificationUrl+"?message="+e.message+"&to_id="+e.to_id+"&u_id="+u_id+"&target="+e.target;
	var _result = contactServerByGet(url);   
	_result.onload = function(e) {
		console.log(e);
	};
	
	_result.onerror = function(ex) { 
		console.log(ex);
	};
};

exports.loadAPIBySequence = function (ex, counter){ 
	counter = (typeof counter == "undefined")?0:counter;
	if(counter >= APILoadingList.length){
		Ti.App.fireEvent('app:next_loading');
		return false;
	}
	
	var api = APILoadingList[counter];
	var model = Alloy.createCollection(api['model']);
	var checker = Alloy.createCollection('updateChecker'); 
	
	var addon_url = "";
	if(api['model'] == "item_response" || api['model'] == "friends"){
		var u_id = Ti.App.Properties.getString('user_id') || 0;
		addon_url = "&u_id="+u_id;
		var isUpdate = checker.getCheckerById(api['checkId'], u_id);
		var last_updated = isUpdate.updated || "";
		if(!u_id){
			counter++;
			API.loadAPIBySequence(ex, counter);
			return;
		}
	}else{
		var isUpdate = checker.getCheckerById(api['checkId']);
		var last_updated = isUpdate.updated || "";
	}
	 var url = api['url']+"&last_updated="+last_updated+addon_url;
	 console.log(url);
	 var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	       console.log('apisequence');
	       console.log(this.responseText);
	       var res = JSON.parse(this.responseText);
	       if(res.status == "Success" || res.status == "success"){
			/**load new set of category from API**/
	       	var arr = res.data;
	        model.saveArray(arr);
	       }
			Ti.App.fireEvent('app:update_loading_text', {text: APILoadingList[counter]['model']+" loading..."});
			if(api['model'] == "item_response" || api['model'] == "friends"){
				var u_id = Ti.App.Properties.getString('user_id') || 0;
				checker.updateModule(APILoadingList[counter]['checkId'],APILoadingList[counter]['model'], Common.now(), u_id);
			}else{
				checker.updateModule(APILoadingList[counter]['checkId'],APILoadingList[counter]['model'], Common.now());
			}
			counter++;
			API.loadAPIBySequence(ex, counter);
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(err) {
	     	console.log("loadAPIBySequence error");
	     	console.log(err);
	     	API.loadAPIBySequence(ex, counter);
	     },
	     timeout : 7000  // in milliseconds
	 });
	 if(Ti.Platform.osname == "android"){
	 	client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
	 }
 
	 client.open("POST", url);
	 // Send the request.
	client.send();
};


/*********************
 * Private function***
 *********************/
function contactServerByGet(url) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	client.open("GET", url);
	client.send(); 
	return client;
};

function contactServerByPost(url,records) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	if(OS_ANDROID){
	 	client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
	 }
	client.open("POST", url);
	client.send(records);
	return client;
};

function contactServerByPostImage(url, records) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
	client.open("POST", url);
	client.send(records); 
	return client;
};

function onErrorCallback(e) { 
	// Handle your errors in here
	COMMON.createAlert("Error", e);
};
