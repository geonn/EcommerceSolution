/*********************
*** DB VERSION CONTROL ***
* 
* Current Version 1.0
* 
**********************/

// update user device token
exports.checkAndUpdate = function(e){
	var dbVersion = Ti.App.Properties.getString("dbVersion");
	if (dbVersion == '1.0') {
	  /*
	   version 1.1 upgrade
	   * 
	  var message_model = Alloy.createCollection('message'); 
	  message_model.addColumn("read", "INTEGER");
	  dbVersion = '1.1';*/
	}
	dbVersion = "1.1";
	
	Ti.App.Properties.setString("dbVersion", dbVersion);
};

