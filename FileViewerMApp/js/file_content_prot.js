FileContent = (function() {
	
	function FileContent() {
			
	}
	
	var baseDirObj;
	
	FileContent.prototype = {
		
		init: function(dirObj){
		
			tizen.content.getDirectories(onsuccessGetDirs);
			
			function onsuccessGetDirs(dirs){
				
				var i=0, 
				lenList = dirs.length;
			
				for (i; i < lenList; i++) {
					
					//console.log(dirs[i].directoryURI + ":" + dirs[i].id);
					
					if (dirs[i].directoryURI === dirObj.toURI()) {
						
						baseDirObj = dirs[i];
					}
					
				}
			}
			
		},
			
		scanFile : function(fileObj) {
			
			tizen.content.scanFile(fileObj.toURI(), onsuccessScanFile);
			
			function onsuccessScanFile(data) {
				
				console.log(data);
			
			}
			
		},
		scanDirectory : function(dirObj) {
			
			tizen.content.scanDirectory(dirObj.toURI(), true, onsuccessScan);
			//tizen.content.scanDirectory("/opt/usr/media/Documents/", true, onsuccessScan);
			
			function onsuccessScan() {
				
				console.log("OK");
				
			}
			
		}
		,
		filter : function(callbackFile, callbackView) {
			
			//var sortMode = new tizen.SortMode("name", "ASC");
			
			var filter = new tizen.AttributeFilter("type", "EXACTLY", "IMAGE");
			
			tizen.content.find(onsuccessFind, onerrorFind, baseDirObj.id, filter, null);
			
			function onsuccessFind(fileContents)
			{
				console.log("FileContent: filter");
				//console.log(fileContents);
				
				callbackFile(fileContents, callbackView);
				
				//callback(contents, true);
					
			}
			
			function onerrorFind(e) {
				
				console.log(e);
				
			}
			
		}
	};
	
	return FileContent;
	
})();