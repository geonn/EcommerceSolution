//Default maximum number of images to select is 4.
var maximumImageCount =4;
var val;

var win = Ti.UI.createWindow({
	backgroundColor:"white"
});

//Require module.
var module = require('ti.multiAccessLib');

var btn = Ti.UI.createButton({
	borderRadius:10,
	top:30,
	left:20,
	width:120,
	height:50,
	title:'MulTiImagePicker'
});

var btn2 = Ti.UI.createButton({
	borderRadius:10,
	top:30,
	left:180,
	width:100,
	height:50,
	title:'NormalPicker'
});
win.add(btn);
win.add(btn2);

btn.addEventListener('click', function(e){
	//set max number of images to be selected.
	module.setMaximumImageCount(maximumImageCount);
	
	//set Original image bool
	module.setOriginalImage(false);
	
	//launch multi select controller
	module.launchController();
});
btn2.addEventListener('click', function(e){
	
	//launch single select controller
	module.launchSpecialController();
});
var scrollView = Ti.UI.createScrollView({
	top:100,
	bottom:10,
	layout:'vertical',
	backgroundColor:'yellow'
});
win.add(scrollView);

//module callback for array of selected images
module.addEventListener('Choosen', function(e){
	scrollView.removeAllChildren();
	for(var i in e.arrayOfImage)
	{
		var imageView = Ti.UI.createImageView({
			backgroundColor:'red',
			top:20,
			height:180,
			width : 200,
			image:e.arrayOfImage[i]
		})
		scrollView.add(imageView);
	}
});

win.open();