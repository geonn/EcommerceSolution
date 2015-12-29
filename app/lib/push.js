var Cloud = require('ti.cloud');  
var redirect = true;
var app_status;
if(Ti.Platform.osname == "android"){ 
	var CloudPush = require('ti.cloudpush'); 
	CloudPush.addEventListener('callback', function (evt) { 
		var payload = JSON.parse(evt.payload); 

		Ti.App.Payload = payload;
		// if trayClickLaunchedApp or trayClickFocusedApp set redirect as true
		console.log("callback push");
		if(redirect){
			if(app_status == "not_running"){
				
			}else{
				redirect = false;
				getNotificationNumber(payload);
			}
			receivePush(payload);
		}else{
			receivePush(payload);
		}
	});
	
	CloudPush.addEventListener('trayClickLaunchedApp', function (evt) {
		var payload = JSON.parse(evt.payload); 
		redirect = true;
		receivePush(payload);
		console.log('Tray Click Launched App (app was not running)');
		
		app_status = "not_running"; 
	    //getNotificationNumber(Ti.App.Payload); 
	});
	CloudPush.addEventListener('trayClickFocusedApp', function (evt) {
		redirect = false;
		var payload = JSON.parse(evt.payload); 
		console.log('Tray Click Focused App (app was already running)');
		receivePush(payload);
		app_status = "running";  
	});
}

function getNotificationNumber(payload){ 
	console.log(payload);
}
	
// Process incoming push notifications
function receivePush(e) { 
	console.log(e);
	console.log('receive push');
	if(OS_IOS){ 
		if(e.data.target == "friends"){
			var params = {u_id:e.data.f_id , to_id: e.data.u_id, message: e.data.alert, item_id: e.data.item_id, type: "text"};
			var messager = Alloy.createCollection('message');
		 	console.log(redirect+" want to see true or false");
			messager.saveRecord(params);
			if(redirect){
				Alloy.Globals.Navigator.open("friends");
				Alloy.Globals.Navigator.open("friends_items", {f_id: e.data.f_id});
				Alloy.Globals.Navigator.open("conversation", {f_id: e.data.f_id, id: e.data.item_id});
			}else{
				Ti.App.fireEvent("friends:refresh");
				Ti.App.fireEvent("conversation:refresh");
			}
		}else if(e.data.target == "pairing_success"){
			if(redirect){
				Alloy.Globals.Navigator.open("friends");
				Alloy.Globals.Navigator.open("friends_items", {f_id: e.data.f_id});
				Alloy.Globals.Navigator.open("conversation", {f_id: e.data.f_id, id: e.data.item_id});
			}else{
				Common.createAlert("Notification", "Item pairing is successful.");
				Ti.App.fireEvent("friends:refresh");
				Ti.App.fireEvent("conversation:refresh");
			}
		}
	}else{ 
		if(e.target == "friends"){
			console.log('yes');
			var params = {u_id:e.f_id, to_id:  e.u_id, message: e.android.alert, item_id: e.item_id, type: "text"};
			var messager = Alloy.createCollection('message');
		 
			messager.saveRecord(params);
			Ti.App.fireEvent("friends:refresh");
			Ti.App.fireEvent("conversation:refresh");
		}
	}
	
	//Action after receiving push message
	 
	return false;
}

function deviceTokenSuccess(ex) {
    deviceToken = ex.deviceToken;
    Cloud.Users.login({
	    login: 'pando',
	    password: '123456'
	}, function (e) {
		if (e.success) {
			  
			Cloud.PushNotifications.subscribe({
			    channel: 'general',
			    type:Ti.Platform.name == 'android' ? 'android' : 'ios', 
			    device_token: deviceToken
			}, function (e) { 
				console.log(e);
			    if (e.success  ) { 
			    	/** User device token**/
			    	console.log(deviceToken+"push");
	         		Ti.App.Properties.setString('deviceToken', deviceToken); 
					API.updateNotificationToken();
			    } else {
			    	registerPush();
			    }
			});
	    } else {
	    	 
	    }
	});
}
function deviceTokenError(e) {
    alert('Failed to register for push notifications! ' + e.error);
}

function registerPush(){
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
 
	 // Wait for user settings to be registered before registering for push notifications
	    Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
	 
	 // Remove event listener once registered for push notifications
	        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
	 
	        Ti.Network.registerForPushNotifications({
	            success: deviceTokenSuccess,
	            error: deviceTokenError,
	            callback: receivePush
	        });
	    });
	 
	 // Register notification types to use
	    Ti.App.iOS.registerUserNotificationSettings({
		    types: [
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
	        ]
	    });
	}else if(Ti.Platform.osname == "android"){
		CloudPush.retrieveDeviceToken({
		    success: deviceTokenSuccess,
		    error: deviceTokenError
		});
	}else{
		Titanium.Network.registerForPushNotifications({
		    types: [
		        Titanium.Network.NOTIFICATION_TYPE_BADGE,
		        Titanium.Network.NOTIFICATION_TYPE_ALERT,
		        Titanium.Network.NOTIFICATION_TYPE_SOUND
		    ],
			success:deviceTokenSuccess,
			error:deviceTokenError,
			callback:receivePush
		});
	}
	
}

Ti.App.addEventListener("pause", function(e){
	console.log('sleep');
	redirect = true;
});

Ti.App.addEventListener("resumed", function(e){
	console.log('resume');
	redirect = false;
});

exports.setInApp = function(){
	console.log('In App');
	redirect = false;
};

exports.registerPush = function(){
	if (OS_IOS) {
		Titanium.UI.iPhone.setAppBadge("0");
	}
	registerPush();
};