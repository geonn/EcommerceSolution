var fullname;
var mobile;
var username; 

exports.checkAuth = function(_callback) {
	var u_id = Ti.App.Properties.getString('user_id'); 
	if(u_id == "" || u_id == null){
		var win = Alloy.createController("auth/login").getView();
    	win.open();
	} else {
		Ti.App.fireEvent("home:refresh");
    	_callback && _callback();
    }
};

exports.updateProfile = function(params, _callback){
	
};

exports.logout = function(_callback) {
	Ti.App.Properties.setString('user_id', "");
	Ti.App.Properties.setString('fullname', "");
	console.log('start callback');
	_callback && _callback();
};