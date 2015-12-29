var args = arguments[0] || {};
var counter = 0;

var loadingList = [
	{type: "api"},
	//{type: "model", model: "items", func: "calculate_distance"}
];

/**
 * function to start the loading animation
 */
$.start = function() {
	console.log('start');
	next_loading();
	//$.overlay.opacity = 0;
	$.rocketSmoke.opacity = 0.1;
	$.rocketFlight.opacity = 0;
	$.rocketFlight.top = null;
	
	$.rocketFlight.stop();
	$.rocketSmoke.start();
	
	$.overlay.animate({
		opacity: 0.7,
		duration: 250
	});
	
	$.rocketSmoke.animate({
		opacity: 1,
		duration: 500
	});
};

/*
 * exposed function to finish the loading animation. Animates the rocket off the screen.
 */
$.finish = function(_callback) {
	
	console.log('b');
	$.rocketSmoke.stop();
	_callback && _callback();
	return;
	$.rocketFlight.start();
	
	$.rocketFlight.animate({
		opacity: 1,
		duration: 500
	});
	
	$.rocketSmoke.animate({
		opacity: 0,
		duration: 500,
		delay: 500
	}, function() {
		
		console.log('b');
		$.rocketFlight.animate({
			top: -130,
			duration: 750,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN
		});
		
		$.overlay.animate({
			opacity: 0,
			duration: 750
		}, function() {
			$.rocketFlight.stop();
			
			_callback && _callback();
		});
	});
};

function next_loading(){
	console.log(counter+'next'+loadingList.length);
	if(counter >= loadingList.length){
		console.log("app:loadingViewFinish");
		Ti.App.fireEvent('app:loadingViewFinish');
		return false;
	}
	var loader = loadingList[counter];
	counter++;
	var type = loader.type;
	if(type == "api"){
		API.loadAPIBySequence();
	}else if(type == "model"){
		console.log(counter+" "+type);
		var model = Alloy.createCollection(loader.model);
		eval("model."+loader.func+"()");
	}
}

//load API loadAPIBySequence

Ti.App.addEventListener('app:update_loading_text', update_loading_text);
Ti.App.addEventListener('app:next_loading', next_loading);

function update_loading_text(e){
	$.loading_text.text = e.text;
}


