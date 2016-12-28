
var FileUploader = (function($) {

		var imgUrl = null;
		var filesInfo = null;
		var canvasElem = null;

		return {
			imgUrl: imgUrl,
			filesInfo: filesInfo,
			template: template,
			uploader: uploader,
			reset: reset,
			drawImageToCanvas: drawImageToCanvas,
			canvasElem: canvasElem,
		}

		function init() {}

		function reset() {

			if (FileUploader.imgUrl !== null) {
				URL.revokeObjectURL(FileUploader.imgUrl);
				FileUploader.imgUrl = null;
			}
			
			$('.file-to-upload').empty();
			console.log('empty');
		}

		function uploader (fileInput, canvasId) 
		{

			var jqUploadProgbar = $('.jq-upload-progbar');
		    var imgToUpload = $('.file-to-upload');

		    var uploadButton = $('<a/>')
			    .addClass('btn-upload btn btn-primary')
		        .prop('disabled', true)
		        .text('Processing...')
		        .on('click', function () {
		            
		            var $this = $(this);
		            var data = $this.data();
		            	
		            jqUploadProgbar.show();

		        	$this
			            .off('click')
			            .text('Abort')
			            .on('click', function () {
			            	data.abort();
			                $this.remove();
			                jqUploadProgbar.hide();
			            });

		            data.submit().always(function () {
		                $this.remove();
		            });

		        });

				/*.on('fileuploadadd', function (e, data) {
	    			
	    			//FileUploader.reset();

	    			//var file = data.files[0];

			        imgToUpload.html('<span>' + file.name + '</span><br/>')
				        .append(uploadButton.clone(true).data(data));

			    })*/

		    var fileUploader = $(fileInput).fileupload({
			        url: apiUrl + 'file/upload',
			        dataType: 'json',
			        autoUpload: false,
			        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
			        maxFileSize: 999000,
			        // Enable image resizing, except for Android and Opera,
			        // which actually support image resizing, but fail to
			        // send Blob objects via XHR requests:
			        disableImageResize: /Android(?!.*Chrome)|Opera/
			            .test(window.navigator.userAgent)
		    	})
		    	.on('fileuploadprocessalways', function (e, data) {
		    		
			        var index = data.index;
			        var file = data.files[index];
			        var btnUpload = imgToUpload.find('.btn-upload');

			        if (file.error) {

			        	btnUpload
			        		.text(file.error)
			        		.addClass('disabled btn-danger');

			        	return false;
			        }

			        if (file.preview) {
			        	
			        	$('.file-to-upload').empty();

			        	imgToUpload.prepend('<canvas id="' + canvasId + '"></canvas><br/>');

			            FileUploader.drawImageToCanvas(file,
			            	document.getElementById(canvasId));

			            var fileNameInputText = $('<input>')
			               		.attr({'type' : 'hidden',
			               			'name' : 'file_name',
			               			'class' : 'file-name'})
			               		.prop('value', "");

			            imgToUpload.append(fileNameInputText);

			            FileUploader.filesInfo = file;
			        }

			        if (data.files.length)
		                btnUpload.text('Upload')   	
			    	
				})
		    	.on('fileuploadprogressall', function (e, data) {
			        var progress = parseInt(data.loaded / data.total * 100, 10);
			        
			        jqUploadProgbar.find('.progress-bar')
			        	.css('width', progress + '%');

		    	})
		    	.on('fileuploaddone', function (e, data) {
			        $.each(data.result.files, function (index, file) {

			            if (file.url) {

			                var link = $('<a>')
			                    .attr('target', '_blank')
			                    .prop('href', file.url);

			                    imgToUpload.children().wrap(link);

			                    if (file.name) {
			                		imgToUpload
			                			.find('input[name=file_name]')
			                			.attr('value', file.name);
			                    }



			            } else if (file.error) {

			                var error = $('<span class="text-danger"/>').text(file.error);
			                imgToUpload.append(error);
			            }

			            jqUploadProgbar.find('.progress-bar')
			            	.css('width', '0px');
			            jqUploadProgbar.hide();

			        });

		    	})
		    	.on('fileuploadfail', function (e, data) {
			        $.each(data.files, function (index) {
			            var error = $('<span class="text-danger"/>').text('File upload failed.');
			            imgToUpload.append('<br>').append(error);
			    	});
			    })
			    .prop('disabled', !$.support.fileInput)
			    .parent().addClass($.support.fileInput ? undefined : 'disabled');

			    return fileUploader;
		}

		function template(fileUploaderCon, viewData) {
			
			var renderedTemp =  _.template($('#file-uploader-temp').html());
    		$(fileUploaderCon).html(
    			renderedTemp(viewData)
    		);

    		return FileUploader;
		}

		
		function drawImageToCanvas (imgInfo, canvasElem, width) {
	    	
    		try {

    			var customWidth = (width) ? width : 500;
		    	var Img = new Image();
		    	
		    	var canvas = canvasElem || FileUploader.canvasElem;
		    	var context = canvas.getContext("2d");

		    	var imgUrl = (typeof imgInfo === 'object') 
		    		? URL.createObjectURL(imgInfo) : imgInfo;

		    	//console.log(imgUrl || FileUploader.imgUrl);

				Img.addEventListener("load", function() {
					
					var picWidth = this.width;
				  	var picHeight = this.height;
				  	var wdthHghtRatio = picHeight/picWidth;
				  
				  	if (Number(picWidth) > 400) {
				    	var newHeight = Math.round(Number(400) * wdthHghtRatio);
				  	} else {
				    	return false;
				  	}

				  	canvas.height = newHeight;
				  	canvas.width = 500;
				  	context.drawImage(Img, 0, 0, customWidth, newHeight);

				}, false);

				Img.src = imgUrl || FileUploader.imgUrl || BASE_URL + 'api/v1/public/files/no-img.jpg';
				//console.log(Img.src, canvas);

	    	} catch(e) {

	    		console.log(e);

	    	} finally {

	    		return canvas;

	    	}

	    }

})($);