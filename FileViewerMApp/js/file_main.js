/*
 * Application: FileViewerMApp
 * Author: Sergei Papulin
 * 
 * API
 * https://developer.tizen.org/development/guides/web-application/data-storage-and-management/file-system
 * https://developer.tizen.org/ko/community/tip-tech/content-api-guide?langredirect=1
 * https://developer.tizen.org/development/api-references/web-application?redirect=/dev-guide/latest/org.tizen.web.apireference/html/device_api/mobile/tizen/filesystem.html
 * https://developer.tizen.org/development/articles/how-access-tizen-file-system
 * 
 */
(function() {
	
	var fileMain = {}, 
		fileView,
		fileContent,
		fileTizen,
		curFileName;
	
	fileMain.init = function() {
		
		console.log("Init Function");
		
		fileView = new FileView();
		fileContent = new FileContent();
		fileTizen = new FileTizen("fileViewer", fileContent.init, fileView.addList);
		
		//Page 1: Основная страница со списком файлов - file-viewer-main
		$("#file-viewer-main").on("pagebeforeshow", displayMainPage);
		$("#btn-show-file-viewer-create-page").click(showFileViewerCreatePage);
		$("#file-viewer-file-list").on("click", ".ui-li-file-item", showFileViewerModifyPage);
		$("#file-viewer-file-list").on("click", ".ui-li-del-file-item", removeFileMainPage);
		$("#btn-filter-file").click(function() {
			$("#btn-filter-file").css("backgroundColor", function(index, value) {
							
				if (value === "rgb(255, 255, 255)") {
					
					$(this).next().text("Filter - ON");
									
					//fileContent.filter(fileView.removeAndAddList.bind(fileView));
					
					fileContent.filter(fileTizen.getFileList.bind(fileTizen), fileView.removeAndAddList.bind(fileView));
					
					//console.log("ON");
					
					return "rgb(0, 0, 0)";
				
				}
				else {
					$(this).next().text("Filter - OFF");
					
					fileView.removeList();
					fileTizen.getAllFileList(fileView.addList);
					
					//console.log("OFF");
					
					return "rgb(255, 255, 255)";
				}

			});
		});
		
		//Page 2: Страница создания нового файла - file-viewer-create
		$("#file-viewer-create").on("pagebeforeshow", displayCreatePage);
		$("#btn-save-file").click(createNewFile);
		$("#btn-back-file-viewer-main").click(backToFileViewerMain);
		
		//Page 3: Страница модификации файла - file-viewer-modify 
		$("#file-viewer-modify").on("pagebeforeshow", displayModifyPage);
		$("#btn-del-file").click(deleteFileModifyPage);
		$("#btn-back-file-viewer-modify-main").click(backToFileViewerMainFromModify);
		$("#btn-modify-file").click(modifyFileModifyPage);
		
		
		//$("#btn-get-curr-dir").click(getCurrentDir);
		//$("#btn-create-file").click(createFile);
		//$("#btn-get-file-list").click(getFileList);
		//$("#btn-write-file").click(writeFile);
		//$("#btn-read-file").click(readFile);
		//$("#btn-delete-file").click(deleteFile);
		
	};
	
	function displayMainPage() {
		
		$("#file-viewer-create").hide();
		$("#file-viewer-modify").hide();
		$("#file-viewer-main").show();
		$("#ui-floatingaction").show();
	
	}
	function displayCreatePage() {
		
		$("#file-viewer-main").hide();
		$("#file-viewer-modify").hide();
		$("#ui-floatingaction").hide();
		$("#file-viewer-create").show();
		
	}
	function createNewFile() {
		
		var fileName = $("#file-name-create-file").val(),
			fileText = $("#file-content-create-file").val();
		
		if (fileName != null && fileText != null) {
			
			fileTizen.createAndWriteFile(fileName, fileText, fileView.add, fileContent.scanFile);
			
			tau.changePage("file-viewer-main", {transition: "pop", reverse: false});
			
			clearFileCreatePage();
			
		}
		else
		{
			console.log("Error in creating new file");
		}
		
	}
	
	function clearFileCreatePage() {
		
		$("#file-name-create-file").val("");
		$("#file-content-create-file").val("");
		
	}
	
	function clearFileModifyPage() {
		
		$("#file-name-modify-file").val("");
		$("#file-content-modify-file").val("");
		
	}
	
	function showFileList() {
		
		console.log("Main: showFileList");
		
		fileTizen.getFileList(fileView.addList);
		
	}

	
	function showFileViewerCreatePage() {
		 
		tau.changePage("file-viewer-create", {transition: "pop", reverse: false});
		
	}
	
	function showFileViewerModifyPage() {
		
		curFileName = this.id.split("-")[1];
		
		//console.log(this.id);
		
		$("#file-name-modify-file").val(curFileName);
		
		fileTizen.readFile(curFileName, setFileContentModifyPage);
		
		tau.changePage("file-viewer-modify", {transition: "pop", reverse: false});
	}
	
	function setFileContentModifyPage(fileContent) {
		
		$("#file-content-modify-file").val(fileContent);
		
	}
	
	function backToFileViewerMain() {
		
		clearFileCreatePage();
		
		tau.changePage("file-viewer-main", {transition: "pop", reverse: false});
		
	}
	
	function backToFileViewerMainFromModify() {
		
		clearFileModifyPage();
		
		tau.changePage("file-viewer-main", {transition: "pop", reverse: false});
		
		curFileName = null;
	}
	
	function modifyFileModifyPage() {
		
		if (curFileName != null) {
			
			var fileContent = $("#file-content-modify-file").val();
			
			fileTizen.updateFile(curFileName, fileContent, fileView.update);
			
			tau.changePage("file-viewer-main", {transition: "pop", reverse: false});
			
			curFileName = null;
			
			
		}
		
	}
	
	function deleteFileModifyPage() {
		
		if (curFileName != null) {
			
			fileTizen.removeFile(curFileName, fileContent.scanDirectory, fileView.remove);
			
			tau.changePage("file-viewer-main", {transition: "pop", reverse: false});
		
			curFileName = null;
		}
	}
	
	function removeFileMainPage(event) {
		
		event.stopPropagation();
		
		var fileName = this.id.split("-")[1];
		
		fileTizen.removeFile(fileName, fileContent.scanDirectory, fileView.remove);
		
	}
	
	/*
	function getCurrentDir() {
		
		fileTizen.getStorageList();
		
	}

	function createFile() {

		fileTizen.createFile("myFirstFile3.txt");
	}

	function getFileList() {
		
		//fileTizen.getFileList.apply(fileTizen);
		fileTizen.getFileList();
	}

	function writeFile() {
		
		fileTizen.writeFile("myFirstFile3.txt", "This my first line\nThis is the second\n");
	}

	function readFile() {
		
		fileTizen.readFile("myFirstFile3.txt");
	}

	function deleteFile() {
		
		fileTizen.removeFile("myFirstFile2.txt");
	}*/

	return fileMain;
	
})().init();
