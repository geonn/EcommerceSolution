var args = arguments[0] || {};
var loading = Alloy.createController("loading");

function navToDemo(){
	Alloy.Globals.Navigator.open("demo");
}

function navToStrShop(){
	Alloy.Globals.Navigator.open("category");
};

function navToOrder(){
	Alloy.Globals.Navigator.open("order_history");
};

function navToProfile(){
	Alloy.Globals.Navigator.open("profile");
};

function doLogout(){
	var user = require("user");
	user.logout(function(){
		Alloy.Globals.Navigator.navGroup.close();
		var win = Alloy.createController("auth/login").getView();
    	win.open();
	});
}

function refresh(){
	
}

function init(){
	$.win.add(loading.getView());
}

init();

Ti.App.addEventListener('home:refresh',refresh);

$.win.addEventListener("close", function(){
	Ti.App.removeEventListener('home:refresh',refresh);
	$.destroy();
});
