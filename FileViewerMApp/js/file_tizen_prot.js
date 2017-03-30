var FileTizen = (function() {
	
	function FileTizen(dir, callbackContent, callbackView){
		
		this.baseDir;
		this.initBaseDir(dir, callbackContent, callbackView);
	}
	
	FileTizen.prototype = {
		
		initBaseDir : function(dir, callbackContent, callbackView) {
					
			var self = this;
					
			tizen.filesystem.resolve("documents/" + dir, onsuccessResolve, onerrorResolve);
			
			function onsuccessResolve(dirObject) {
				
				self.baseDir = dirObject;
				
				//console.log(self.baseDir);
				
				if (callbackContent != null) {
					
					callbackContent(self.baseDir);
				}
				
				if (callbackView != null) {
					
					console.log("FileTizen: initBaseDir");
					
					self.getAllFileList(callbackView);
				
				}
				
			}
			
			function onerrorResolve(e) {
				
				if (e.code === 8) {
					
					tizen.filesystem.resolve("documents", function(dirObj) {
					
						dirNewObject = dirObj.createDirectory(dir);
					
						self.baseDir = dirNewObject;
					}, onerr);
					
					
					function onerr(e){
						console.log(e);
					}
				}
				
				console.log(e);
				
			}
			
			
		},
		
		getStorageList : function() {
			
			tizen.filesystem.listStorages(onsuccess);
			
			function onsuccess(storageList) {
				
				var i=0, lenList = storageList.length;
				
				for(i; i < lenList; i++) {
					console.log(storageList[i].label);
				}
			}
		},
		
		//Создание нового файла
		createFile : function(fileName) {
			
			var fileObj = null;
			
			if (this.baseDir != null) {
				
				try {
					
					fileObj = this.baseDir.createFile(fileName);
					
					console.log("File was successfully created");
		
				}
				catch(e) {
					
					console.log(e.message);
					
					if (e.code === 0) {
						
						//Файл уже существует
						
					}
					
				}
				finally {
					
					return fileObj;
					
				}
				
			}

		},
		getAllFileList : function(callback) {
			
			//console.log(this.baseDir);
			
			if (this.baseDir != null) {
				
				this.baseDir.listFiles(onsuccessListFiles);
					
				function onsuccessListFiles(files) {
					
					console.log("FileTizen: getFileList");
					
					callback(files);
					/*
					var i=0, lenList = files.length;
							
					for(i; i < lenList; i++) {
						console.log(files[i].name);
					}
					*/
						
				}
			}
				
		},
		getFileList : function(fileContents, callbackView) {
			
			//console.log(this.baseDir);
			console.log("FileTizen: getFileList");
			
			//console.log(this);
			
			if (this.baseDir != null) {
				
				var i=0, 
					lenList = fileContents.length,
					curFile,
					countFile = 0,
					arrFiles = [];
				
				console.log("FileTizen: getFileList");
				
				for (i; i < lenList; i++) {
					
					console.log(fileContents[i].id);
					
					curFile = this.baseDir.resolve(fileContents[i].name);
					
					if (curFile != null) {
						
						arrFiles[countFile] = curFile;
						countFile++;
					}
				}
				
				console.log(arrFiles);
				
				callbackView(arrFiles);
				
			}
				
		},
		//Удаление файла
		removeFile : function(fileName, callbackContent, callbackView) {
			
			//console.log(this.baseDir);
			
			if (this.baseDir != null) {
				
				var curDir = this.baseDir;
				
				var fullPath = curDir.fullPath + "/" + fileName;
				
				console.log("Want to remove " + fileName);
				
				curDir.deleteFile(fullPath, onsuccessDelete);
				
				function onsuccessDelete() {
					
					console.log("File " + fileName + " was deleted");
					
					callbackContent(curDir);
					callbackView(fileName);
				}
			}

		},
		//Удаление всех файлов
		removeAllFile : function() {
			
		},
		
		writeFile : function(fileName, text, callback) {
			
			if (this.baseDir != null) {
			
				var curFile = this.baseDir.resolve(fileName);
				
				if (curFile != null) {
					
					curFile.openStream("rw", onsuccessOpenStream, null, "UTF-8");
					
					function onsuccessOpenStream(fs) {
						
						fs.write(text);
						fs.close();
						
						console.log("Text was successfully written");
						
						callback(curFile);
						
					}
					
				}
			}
			
		},
		
		updateFile : function(fileName, text, callback) {
			if (this.baseDir != null) {
				
				var curBaseDir = this.baseDir;
				
				var curFile = curBaseDir.resolve(fileName);
				
				if (curFile != null) {
					
					curFile.openStream("rw", onsuccessOpenStream, null, "UTF-8");
					
					var self = this;
					
					function onsuccessOpenStream(fs) {
						
						fs.write(text);
						fs.close();
						
						console.log("Text was successfully written");
						
						curFile = curBaseDir.resolve(fileName);
						
						callback(curFile);
						
					}
					
				}
			}
		},
		
		readFile : function(fileName, callback) {
			
			if (this.baseDir != null) {
				
				var curFile = this.baseDir.resolve(fileName);
				
				if (curFile != null) {
					
					/*curFile.readAsText(onsuccessRead);
					
					function onsuccessRead(text) {
						console.log(text);
					}*/
					
					curFile.openStream("r", onsuccessOpenStream, null, "UTF-8");
					
					function onsuccessOpenStream(fs) {
						
						//fs.position = 0;
						var text = fs.read(curFile.fileSize-1);
						fs.close();
					
						callback(text);
						
						console.log(text);
					}
					
				}
			}
			
		},
		
		createAndWriteFile : function(fileName, fileContent, callbackView, callbackContent) {
			
			var fileObj = this.createFile(fileName);
			
			callbackContent(fileObj);
			
			if (fileObj != null) {
				
				fileObj.openStream("rw", onsuccessOpenStream, null, "UTF-8");
				
				function onsuccessOpenStream(fs) {
					
					fs.write(fileContent+"\n");
					fs.close();
					
					console.log("Text was successfully written");
					
					callbackView(fileObj);
					
				}
				
			}

		}
		
		
			
	}
	
	return FileTizen;
})();