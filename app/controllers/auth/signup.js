var args = arguments[0] || {};
var photoLoad = 0;
var loading = Alloy.createController("loading");
$.signUpWin.add(loading.getView());
var image_preview;

function onload(responseText){
	var result = JSON.parse(responseText);
	if(result.status == "error"){
		loading.finish();
		Common.createAlert("Error", result.data);
		return false;
	}else{
		var userModel = Alloy.createCollection('user'); 
		var arr = result.data; 
		userModel.saveArray(arr);
   		loading.finish();
		Common.createAlert("Notification", "Pando account registration successful");
		Alloy.Globals.navWin.closeWindow($.signUpWin); 
	}
}

function doRegister(){
	var fullname     = $.fullname.value;
	var mobile       = $.mobile.value;
	var email  	  	 = $.email.value;
	var username     = $.username.value;
	var password	 = $.password.value;
	var confirm 	 = $.confirm.value;
	if(fullname ==""){
		Common.createAlert("Fail","Please fill in your full name");
		return false;
	}
	if(mobile ==""){
		Common.createAlert("Fail","Please fill in your contact number");
		return false;
	}
	if(email ==""){
		Common.createAlert("Fail","Please fill in your email address");
		return false;
	}
	if(username ==""){
		Common.createAlert("Fail","Please fill in your username");
		return false;
	}
	if(password =="" || confirm ==""){
		Common.createAlert("Fail","Please fill in your password");
		return false;
	}
	if(password != confirm){
		Common.createAlert("Fail","Both password must be same");
		return false;
	}
	if(password.length < 6){
		Common.createAlert("Fail","Password must at least 6 alphanumberic");
		return false;
	}
	
	var params = { 
		Filedata: $.item_image.toImage(),
		fullname: fullname,
		mobile: mobile,
		email: email,
		username: username,  
		password: password,
		photoLoad: photoLoad
	};
	loading.start();
	API.callByPostImage({url: "doSignUpUrl", params: params}, onload);
}

/**
 * private function for crop image use.
 */

function previewImage(event){
	var image = event.media;
    var win = $.UI.create("Window", {
    	barColor:"#75d0cb",
    	title: "Photo Preview",
    	classes: ['vert', 'wfill', 'hfill'],
    	navBarHidden:"false"
    });
    var pWidth = Titanium.Platform.displayCaps.platformWidth;
    var thumb_width = pWidth - 20;
    var thumb_height = thumb_width * 0.7;
    
    var scrollview_crop = $.UI.create("ScrollView",{
    	width: thumb_width,
    	height: thumb_height,
    	contentWidth: pWidth,
    	contentHeight: Ti.UI.SIZE,
    	backgroundColor: "#ffffff",
    	classes:['box'],
    	platform: "ios"
    });
    
    var button_save = $.UI.create("Button", {
    	classes: ['hszie', 'wsize'],
    	title: "Crop"
    });
    button_save.addEventListener('click', function(){
    	var croppedImage = scrollview_crop.toImage();
		$.item_image.image = croppedImage;
		$.item_image.width = Ti.UI.FILL;
		$.item_image.left = 10;
		$.item_image.right = 10;
		photoLoad = 1;
		win.close();
    });
    
    var imageView = Ti.UI.createImageView({
		width: Ti.UI.FILL,
		height: "auto",
		image:event.media
	});
			
    scrollview_crop.add(imageView);
   	win.add(scrollview_crop);
    win.add(button_save);
    Alloy.Globals.Navigator.openWindow(win);
   // Alloy.Globals.Navigator.navGroup.openWindow(win);
}

function imageCallback(e){
	var media = image_preview.getMedia();
	$.item_image.image = media;
	photoLoad = 1;
}

/**
 * load photo for item thumbnail.
 */
function loadPhoto(){
	var dialog = Titanium.UI.createOptionDialog({ 
	    title: 'Choose an image source...', 
	    options: ['Camera','Photo Gallery', 'Cancel'], 
	    cancel:2 //index of cancel button
	});
	  
	dialog.addEventListener('click', function(e) { 
	     
	    if(e.index == 0) { //if first option was selected
	        //then we are getting image from camera
	        Titanium.Media.showCamera({ 
	            success:function(event) { 
	            	image_preview = Alloy.createController("image_preview", {media: event.media});
	            	var win = image_preview.getView();
	            	Alloy.Globals.navWin.openWindow(win,{animated:true});
	                //previewImage(event);
	         	},
	            cancel:function(){
	                //do somehting if user cancels operation
	            },
	            error:function(error) {
	                //error happend, create alert
	                var a = Titanium.UI.createAlertDialog({title:'Camera'});
	                //set message
	                if (error.code == Titanium.Media.NO_CAMERA){
	                    a.setMessage('Device does not have camera');
	                }else{
	                    a.setMessage('Unexpected error: ' + error.code);
	                }
	 
	                // show alert
	                a.show();
	            },
	            allowImageEditing:true,
	            mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	            saveToPhotoGallery:true
        	});
        }else if(e.index == 1){
        	Titanium.Media.openPhotoGallery({
	            success:function(event){
	            	image_preview = Alloy.createController("image_preview", {media: event.media});
	            	var win = image_preview.getView();
	            	Alloy.Globals.navWin.openWindow(win,{animated:true});
	            	//previewImage(event);
	          	},
	          	cancel:function() {
	               
	            },
	            mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	        });
	    }
	});
	dialog.show();
}

function closeWindow(){
	$.signUpWin.close();
}

Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);

$.signUpWin.addEventListener("close", function(){
	Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);
	$.destroy();
	console.log("window close");
});
