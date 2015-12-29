var args = arguments[0] || {};
$.loadingBar.hide();
$.activityIndicator.hide();
/**
 * function to start the loading animation
 */
$.start = function() {
	$.loadingBar.show();
	$.activityIndicator.show();
};

/*
 * exposed function to finish the loading animation. Animates the rocket off the screen.
 */
$.finish = function(_callback) {
	$.loadingBar.hide();
	$.activityIndicator.hide();
	_callback && _callback();
};

