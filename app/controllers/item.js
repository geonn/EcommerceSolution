var args = arguments[0] || {};

function addToCart(){
	
	var dialog = Ti.UI.createAlertDialog({
    title: 'Added To Cart',
    buttonNames: ['OK'],
  	});
  	dialog.show();
};

function navToCart(){
	Alloy.Globals.Navigator.open("cart");
}


/*var img = Ti.UI.createImageView({
	image: "/images/category/baby.png" + "/images/category/book.png" + "/images/category/gym.png",
	width: Ti.UI.FILL,
	height: 150,
	top:"10"
});

var photosView = Ti.UI.createScrollableView({
    showPagingControl:true,
    //views:[img]
});

photosView.add(img);
$.win.add(photosView);*/
