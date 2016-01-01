var args = arguments[0] || {};
var product = [];

function insertData(){
	var inserteddata = rowviewdata();
	$.tableview.setData(inserteddata); 
}

function rowviewdata (){
	
var rowdata = [];

	for (i=0; i< 4; i++){
	
		var image = Ti.UI.createImageView({
	  		image:'/images/product/womencloth',
	  		width: 60,
	  		height: 60,
	  		left: 10
			});
		
		var row = Ti.UI.createTableViewRow({
			width: Ti.UI.FILL,
			height: 80,
			layout: "horizontal"
		});
		
		var view = Titanium.UI.createView({
		   width:100,
		   height: Ti.UI.SIZE,
		   left: 20,
		   right: 70,
		   layout: "vertical"
		});
		
		var labeldata = Ti.UI.createLabel({
			width: 100,
			height: 40,
			text: "Product XXX",
		});
		
		var labelprice = Ti.UI.createLabel({
			width: 100,
			height: 40,
			text: "RM 0000.00",
		});
		
		var labelqty = Ti.UI.createLabel({
			width: 30,
			height: Ti.UI.FILL,
			text: "3"
		});
		
		view.add(labeldata,labelprice);
		row.add(image,view,labelqty);
		rowdata.push(row);
}
		return rowdata;
}

function navToCheckOut(){
	Alloy.Globals.Navigator.open("checkout");
};

function init(){	
	insertData();
}

init();