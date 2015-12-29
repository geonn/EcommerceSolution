var args = arguments[0] || {};
var loading = Alloy.createController("loading");

function do_signup(){
	var win = Alloy.createController("auth/signup").getView();
	if(Ti.Platform.osname == "android"){
	  	win.open(); //{fullscreen:false, navBarHidden: false}
	}else{
		Alloy.Globals.navWin.openWindow(win,{animated:true});  
	} 
}

function onload(responseText){
	var result = JSON.parse(responseText); 
	if(result.status == "error"){
		Common.createAlert("Error", result.data[0]);
		loading.finish();
		return false;
	}else{
		loading.finish();
		var userModel = Alloy.createCollection('user'); 
		var arr = result.data;
		userModel.saveArray(arr);
   		Ti.App.Properties.setString('user_id', arr.id);
   		Ti.App.Properties.setString('fullname', arr.fullname);
   		Ti.App.Properties.setString('email', arr.email);
   		Ti.App.Properties.setString('mobile', arr.mobile);
   		Ti.App.Properties.setString('img_path', arr.img_path);
   		Ti.App.Properties.setString('thumb_path', arr.thumb_path);
   		Ti.App.Properties.setString('point', arr.point);
   		
		$.win.close();
		Ti.App.fireEvent("home:refresh");
		Alloy.Globals.Navigator.navGroup.open({navBarHidden: true, fullscreen: false});
	}
}

function do_login(){
	
	var username     = $.username.value;
	var password	 = $.password.value;
	if(username ==""){
		Common.createAlert("Fail","Please fill in your username");
		return false;
	}
	if(password =="" ){
		Common.createAlert("Fail","Please fill in your password");
		return false;
	}
	var device_token = Ti.App.Properties.getString('deviceToken');
	console.log(device_token);
	var params = { 
	 	device_token: device_token,
		username: username,  
		password: password
	};
	//API.doLogin(params, $); 
	loading.start();
	API.callByPost({url: "doLoginUrl", params: params}, onload);
}

function init(){
	Alloy.Globals.navWin = $.navWin;
	$.win.add(loading.getView());
}

init();

