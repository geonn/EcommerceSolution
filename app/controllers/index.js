var args = arguments[0] || {};

var loadingView = Alloy.createController("loader");
loadingView.getView().open();
loadingView.start();

function loadingViewFinish(){
	console.log("finish!");
	loadingView.finish(function(){
		console.log("loadingview_finish!");
		init();
		loadingView = null;
	});
}

function _callback(){
	$.index.win.open();
}

function init(){
	PUSH.setInApp();
	_callback(); 
	//user.checkAuth(_callback);
}

if (OS_IOS) {
	Titanium.UI.iPhone.setAppBadge("0");
}

Ti.App.addEventListener('app:loadingViewFinish', loadingViewFinish);