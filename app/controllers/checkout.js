var args = arguments[0] || {};

function navToAlert(){
	var dialog = Ti.UI.createAlertDialog({
    title: 'Payment Successful! Check at Order Section for more information!',
    buttonNames: ['OK'],
  	});
  	dialog.show();
}
