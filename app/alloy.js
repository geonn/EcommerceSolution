// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var _ = require('underscore')._;
var API = require('api');
var PUSH = require('push'); 
var Common = require('common'); 
var DBVersionControl = require('DBVersionControl');

DBVersionControl.checkAndUpdate();

function parent(key, e){
	// if key.value undefined mean it look for key only
	console.log(typeof key.value);
	console.log(key.value);
	if(typeof key.value != "undefined"){
		
		if(eval("e."+key.name+"") != key.value){
			if(eval("e.parent."+key.name+"") != key.value){
				if(eval("e.parent.parent."+key.name+"") != key.value){
	    			console.log("box not found");
	    		}else{
	    			return e.parent.parent;
	    		}
	    	}else{
	    		return e.parent;
	    	}
	    }else{
	    		return e;
	    }
	}else{
		if(eval("typeof e."+key.name) == "undefined"){
			if(eval("typeof e.parent."+key.name+"") == "undefined"){
				if(eval("typeof e.parent.parent."+key.name+"") == "undefined"){
	    			console.log("box not found");
	    		}else{
	    			return eval("e.parent.parent."+key.name);
	    		}
	    	}else{
	    		return eval("e.parent."+key.name);
	    	}
	    }else{
	    		return eval("e."+key.name);
	    }
	}
}

function children(key, e){
	if(eval("e."+key.name+"") != key.value){
		for (var i=0; i < e.children.length; i++) {
			if(eval("e.children[i]."+key.name+"") == key.value){
		  		return e.children[i];
		 	}
			for (var a=0; a < e.children[i].children.length; a++) {
			  if(eval("e.children[i].children[a]."+key.name+"") == key.value){
			  	return e.children[i].children[a];
			  }
			  for (var c=0; c < e.children[i].children[a].children.length; c++) {
				  if(eval("e.children[i].children[a].children[c]."+key.name+"") == key.value){
				  	return e.children[i].children[a].children[c];
				  }
				};
			};
		};
    }else{
		return e;
    }
}

function setCurLoc(e){
	console.log('c');
	longitude = e.coords.longitude;
    latitude = e.coords.latitude;
    console.log(longitude+", "+latitude);
    Ti.App.Properties.setString('longitude', longitude);
    Ti.App.Properties.setString('latitude', latitude);
}

function checkGeoLocation(){
	if (Titanium.Geolocation.locationServicesEnabled) {
	    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_HIGH;
	    //Ti.Geolocation.addEventListener('location', setCurLoc);
	    try
		{
	    	Titanium.Geolocation.getCurrentPosition(setCurLoc);
	    }
	    catch(e){
	    	console.log(e);
	    }
	} else {
		Common.createAlert("Error", "Please enable location services");
	}
}

Titanium.App.addEventListener('resumed', function(e) {
	checkGeoLocation();
});