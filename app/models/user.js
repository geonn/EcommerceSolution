exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER", 
		    "fullname": "TEXT", 
		    "username": "TEXT",
		    "mobile": "TEXT",
		    "email": "TEXT",
		    "img_path": "TEXT",
		    "point": "INTEGER", 
		},
		adapter: {
			type: "sql",
			collection_name: "user",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			 
			getUserById : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
						id: res.fieldByName('id'),
					    fullname: res.fieldByName('fullname'),
					    username: res.fieldByName('username'),
					    mobile: res.fieldByName('mobile'),
					    email: res.fieldByName('email'),
					    img_path: res.fieldByName('img_path'),
					    point: res.fieldByName('point'),
					};
				} 
		 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getPoint : function(){
				var collection = this;
				var u_id = Ti.App.Properties.getString('user_id') || 0;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id=?" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql, u_id);
                var point; 
               
                if (res.isValidRow()){
					point = res.fieldByName('point') || 0;
				} 
		 
				res.close();
                db.close();
                collection.trigger('sync');
                return point;
			},
            saveArray : function(entry){
				var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute("BEGIN");
 
	            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, fullname, username,email,mobile, img_path, point) VALUES (?,?,?,?,?,?,?)";
				db.execute(sql_query, entry.id, entry.fullname, entry.username,entry.email,entry.mobile,entry.img_path,entry.point);
				var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET fullname=?,username=?,email=?,mobile=?,img_path=?,point=? WHERE id=?";
				db.execute(sql_query,   entry.fullname,entry.username,entry.email,entry.mobile,entry.img_path, entry.point ,entry.id);
			 
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
			addColumn : function( newFieldName, colSpec) {
				var collection = this;
				var db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
				var fieldExists = false;
				resultSet = db.execute('PRAGMA TABLE_INFO(' + collection.config.adapter.collection_name + ')');
				while (resultSet.isValidRow()) {
					if(resultSet.field(1)==newFieldName) {
						fieldExists = true;
					}
					resultSet.next();
				}  
			 	if(!fieldExists) { 
					db.execute('ALTER TABLE ' + collection.config.adapter.collection_name + ' ADD COLUMN '+newFieldName + ' ' + colSpec);
				}
				db.close();
			}
		});

		return Collection;
	}
};