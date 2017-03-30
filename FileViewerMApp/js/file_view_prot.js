var FileView = (function() {
	
	function FileView(){
		
	}
	
	FileView.prototype = {
			
		//Добавление нового файла
		add : function(fileObj, isContent) {
				
			console.log("FileView: add");
			
			var htmlCode = "";
			
				
			htmlCode = "<li class='ui-li-static ui-li-file-item' style='padding: 5px 10px 5px 10px; overflow: auto;' id='file-" + fileObj.name + "'>" + 
								"<div style='float:left; width: 80%;'>" + 
									"<p style='margin: 0px;'>" + fileObj.name + "</p>" +
									"<p style='font-size: 10px;'>Created: " + fileObj.created + "</p>" +
									"<p style='font-size: 10px;'>Modified: " + fileObj.modified + "</p>" +
								"</div>" +
								"<div style='float:right; width: 17%; text-align: right;'>" +
									"<a href='#' class='icon-del-black icon-active ui-li-del-file-item' id='del-" + fileObj.name + "'></a>" +
								"</div></li>";


			$("#file-viewer-file-list").append(htmlCode);
			
		},
		//Добавление нескольких файла
		addList : function(fileObjs) {
			
			console.log("FileView: addList");
			
			//console.log(fileObjs[0]);
			
			var i=0, 
				lenList = fileObjs.length,
				htmlCode = "";
				
			for(i; i < lenList; i++) {
				
				htmlCode += "<li class='ui-li-static ui-li-file-item' style='padding: 5px 10px 5px 10px; overflow: auto;' id='file-" + fileObjs[i].name + "'>" + 
								"<div style='float:left; width: 80%;'>" + 
									"<p style='margin: 0px;'>" + fileObjs[i].name + "</p>" +
									"<p style='font-size: 10px;'>Created: " + fileObjs[i].created + "</p>" +
									"<p style='font-size: 10px;'>Modified: " + fileObjs[i].modified + "</p>" +
								"</div>" +
								"<div style='float:right; width: 17%; text-align: right;'>" +
									"<a href='#' class='icon-del-black icon-active ui-li-del-file-item' id='del-" + fileObjs[i].name + "'></a>" +
								"</div></li>";
			}

			$("#file-viewer-file-list").append(htmlCode);
			
		},
		//Изменение файла
		update : function(fileObj) {
			
			var $fileItem = $(document.getElementById("file-"+fileObj.name))
			
			var arrP = $fileItem.find("p");
			
			$(arrP[2]).text(fileObj.modified);
			
		},
		//Удаление файла
		remove : function(fileName) {
			
			$(document.getElementById("file-"+fileName)).remove();
			
			console.log("#file-"+fileName);
			
			console.log("Item View "+ fileName +" was Removed");
			
		},
		//Удаление нескольких файлов
		removeList : function() {
			
			$("#file-viewer-file-list").html("");
			
		},
		//Удаление нескольких файлов
		removeAndAddList : function(fileObjs) {
			
			console.log("FileView: removeAndAddList");
			
			$("#file-viewer-file-list").html("");
			
			this.addList(fileObjs);
			
		}
	}
	
	return FileView;
})();