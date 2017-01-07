var JobTemporary = (function ($) {
	
	var templates = [];
    var baseTemplateUrl = 'template/job/temporary/';
    var postingUrl = 'job/posting';
    var formID = 1;
    var formData = null;
    var fileUploader = null;
    var isRendered = false;
    var ajaxLoader = '<center><i class="fa fa-spin fa-5x fa-circle-o-notch"></i></center>';

	return {
		init: init,
		removeSaveAddMore: removeSaveAddMore,
		addSaveAddMore: addSaveAddMore,
		previewBack: previewBack,
		posting: posting
	};

	function init()
	{
		$.fn.datepicker.defaults.format = "yyyy-mm-dd";
        addEventHandlers();
		jobGroupTemp();
		captureFormInputVal();
	}

    function addEventHandlers()
    {
        $(".panel-heading").on("click", "#btn-group-job", jobGroupPosting);
        $(".panel-heading").on("click", "#btn-single-job", jobSinglePosting);
        
        $(".btn-job-group-post").on("click", ".btn-save-more-addmore", addSaveAddMore);

        $(".add-new-job-con").on('submit',"form[name=add-new-job-form]", preview);
    }

    function jobGroupPosting()
    {
        $('.btn-job-single-post').addClass('hidden');
        $('.btn-job-group-post').removeClass('hidden');
        $('.error-msg-con').empty();
        $('.job-single-post').empty();
        jobGroupTemp();
    }

    function jobSinglePosting()
    {
        $('.btn-job-group-post').addClass('hidden');
        $('.btn-job-single-post').removeClass('hidden');
        $('.error-msg-con').empty();
        $('.job-group-post').empty();
        singlePostTemp();
    }

	function preview(e)
	{
        e.preventDefault();

        var dataArr = $(this).serializeArray();
        
        var successCallback =  function(response) {
            
            Helper.btnLoader('.btn-preview', 'Preview', 'complete');

            var responseData = JSON.parse(response);

            if (responseData.errorMsg) {

                getTemplate('error-msg.html', function(template) {
                    var renderedTemp = template({ errorMsgs : responseData.errorMsg });
                    $('.error-msg-con').html(renderedTemp);
                    $('body,html').stop(true).animate({ 'scrollTop': 0 });
                }, baseTemplateUrl);

            } else {

                $('.error-msg-con').empty();
                
                $('.add-new-job-con').hide();
                $('.temporary-preview-con').show();

                var previewTempData = {
	                file_name : responseData.file_name || null,
	                headline : responseData.headline || null,
	                headlineDesc : responseData.headline_desc || null,
	                validUntil : responseData.hiring_duration_to,
	                jobs : responseData.jobs,
	            };

	            JobTemporary.formData = responseData;
                JobTemporary.formData.employment_type_text = 'Temporary';
                JobTemporary.formData.file_name = responseData.file_name || null;
	            
                //check if their is an image to upload - then do upload
                $.when(Helper.doUploadProcess(JobTemporary.fileUploader))
                        .done(function (response) {
                            var filename = response.data.name;

                            previewTempData.file_name = filename;

                            JobTemporary.formData.file_name = filename;

                            loadPreviewTemp(previewTempData);
                        })
                        .fail(function (response) {
                            console.log(response, 'fail');
                        })
                        .progress(function (response) {
                            loadPreviewTemp(previewTempData);
                        });
            }
        }

        Helper.btnLoader('.btn-preview', '', 'start');

        $.ajax({
            type: 'POST',
            url: apiUrl + '/to-json-encode',
            data: dataArr,
            success: successCallback,
            error: function(response) {
                console.log("Failed: ", response);
            }
        });
	}

    function loadPreviewTemp(previewTempData) {

        getTemplate('preview.html', function(template) {
            
            var renderedTemp = template(previewTempData)

            $('.temporary-preview-con').html(renderedTemp);

            $('.btn-post').on('click', function() {
                posting($(this));
            });

            previewBack();
            
        }, baseTemplateUrl);
    }

	function posting(btn) {
        
        var jobsArr = _.first($.makeArray(JobTemporary.formData.jobs));
        
        var jobsArrNew = $.map(jobsArr, 
            function(val, key) { 
                if (typeof val.industry_text !== "undefined" && typeof val.location_text !== "undefined") {
                    return arrayToString(val.industry_text) + " " + val.job_title + 
                    " " + arrayToString(val.location_text) + " " + val.currency_text +
                    " " + val.salary;
                }
            });

        //store searckeys to a storage in able to use it on next page  
        localStorage.setItem('searchKeys', JSON.stringify(jobsArrNew));
 
        var forEditing = {
            html : getDOMContent(),
            selectOptsLocation : [],
            selectOptsIndustry : [],
            selectOptsCurrencies : []
        };

        $.each($('select[id^=location]'), function(index, elem) {
            var opts = $(elem).html();
            forEditing.selectOptsLocation.push(opts); 
        });

        $.each($('select[id^=industry]'), function(index, elem) {
            var opts = $(elem).html();
            forEditing.selectOptsIndustry.push(opts);
        });

        $.each($('select[id^=currency]'), function(index, elem) {
            var opts = $(elem).html();
            forEditing.selectOptsCurrencies.push(opts);
        });

        //put here additional post data
       JobTemporary.formData.for_editing = JSON.stringify(forEditing);

        var url = 'job/posting';

        //if jobGroupId exist then do update process
        if (typeof jobGroupID !== 'undefined') { 
            url = 'job/update';
        }

        //create ajax button with loader
        Http.ajaxButton({
            type: 'POST',
            url: apiUrl + url,
            data : JobTemporary.formData,
            success : function(response) {
                if (response.success) {
                    window.location.href = "short-listed.php?employment_type_id=3";
                }
            }
        }, $(btn), 'Posting...' );

    }

    function getDOMContent() 
    {
        if ($('.job-group-post').children().length) 
            return $('.job-group-post').html();

        if ($('.job-single-post').children().length) 
            return $('.job-single-post').html();
    }


	function previewBack() 
	{
        $('.btn-preview-back').on('click', function() {
            $('.temporary-preview-con').hide();
            $('.add-new-job-con').show();
        });
	}

	function jobGroupTemp()
	{
		//if jobGroupId exist then do update process
		if (typeof jobGroupID !== 'undefined') {

			var jobObj = JSON.parse(localStorage.getItem('jobObj'));
            var jsonForEdit = JSON.parse(jobObj.for_editing);

            var jsonFileInputText = $('<input type="hidden"/>')
                    .attr({ name: 'json_file_id', value: jsonForEdit.jsonId });
            
            $('form[name=add-new-job-form]').prepend(jsonFileInputText);

            selectPicker.isEdit = true;
            
            Helper.setPostTypeStatus(postTypeID);
            
            $.ajax(jsonForEdit.file, {
                dataType: 'JSON',
                beforeSend: function() {
                    var postCon = null;
                    if (postTypeID == 1) postCon = $('.job-group-post');
                    if (postTypeID == 2) postCon = $('.job-single-post');
                    postCon.html(ajaxLoader);
                },
                success: function(response) {
                    
                    if (postTypeID == 1) 
                    {
                        $('.job-group-post').html(response.html);
                        
                        $('.group-job-fileupload-con').empty();
                        
                        //create fileuploader
                        groupPostFileUploader().on('fileuploadadd',
                            function(e, data) {
                                JobTemporary.fileUploader = data;
                            });
                    }

                    if (postTypeID == 2) 
                    {
                        $('.job-single-post').html(response.html);

                        $('#posttype-single-post').attr('checked', true);
                        $('#posttype-group-post').removeAttr('checked');

                        $('.btn-job-group-post').hide();
                        $('.btn-job-single-post').show();

                        $('.single-job-fileupload-con').empty();

                        singlePostFileUploader().on('fileuploadadd',
                            function(e, data) {
                                JobTemporary.fileUploader = data;
                            });

                    }

                    if (jobObj.cover_photo) 
                    {
                        setTimeout(function () {
                            $('.file-to-upload')
                                .append('<img src="api/v1/public/files/' + jobObj.cover_photo + '"/>')
                                .append('<input type="hidden" name="file_name" value="' + jobObj.cover_photo + '"/>');
                        }, 1000);
                    }

                    $('form[name=add-new-job-form]').append($('<input type="hidden" name="job_group_id"/>').val(jobGroupID));

                    resetAddedFormId();
                    
                    formID = getAddedFormNum();
                    console.log('edit form id ', formID);

                    $('.bootstrap-select').remove();

                    //create select picker for locations
                    $.each(response.selectOptsLocation, 
                        function(i, opts) {
                            selectPicker.locations('.location-' + i, "", 'jobs[job-' + i + '][location][]', i, 'location_text', $.trim(opts));
                        });

                    //create select picker for locations
                    $.each(response.selectOptsIndustry, 
                        function(i, opts) {
                            selectPicker.industries('.industry-' + i, "", 'jobs[job-' + i + '][industry][]', i, 'industry_text', $.trim(opts));
                        });

                    //create select picker for currencies
                    $.each(response.selectOptsCurrencies, 
                        function(i, opts) {
                            selectPicker.currencies('.currency-' + i, "", 'jobs[job-' + i + '][currency_id]', i, 'currency_text', $.trim(opts));
                        });

                    $('.datepicker').datepicker();

                    $('.added-job-form').each(function(i, elem) {
						DateHelper.rangePicker('.date-range-' + i, '.date-range-input-' + i, '.day-time-con-' + i, i);                    	
                    });

                    DateHelper.disabledDayTime();

                    Helper.number('.number-only');
                    removeSaveAddMore();
                    captureFormInputVal();
                },
                error: function(response) {
                    console.log(response);
                }
            });

		} else {

            getTemplate('group-post.html', function(template) {

                $('.job-group-post').html(template({ formID : 0 }));

                //create fileuploader
                groupPostFileUploader()
                    .on('fileuploadadd',
                        function(e, data) {
                            JobTemporary.fileUploader = data;
                        });

                selectPickers();

                $('.datepicker').datepicker();

                Helper.number('.number-only');
                removeSaveAddMore();
                captureFormInputVal();

            }, baseTemplateUrl);

		}

	}

    //create select pickers for locations, industries and currencies
	function selectPickers()
	{
		selectPicker.locations('.location-0', "", "", 0, 'location_text');
		selectPicker.industries('.industry-0', "", "", 0, 'industry_text');
		selectPicker.currencies('.currency-0', "", "", 0, 'currency_text');
	}

    //create file uploader
	function groupPostFileUploader()
	{
		FileUploader.template('.group-job-fileupload-con',
            { fileId : 'group-job-file-id' });
        
        return FileUploader.uploader('#group-job-file-id', 'group-job-canvas');
	}

	function singlePostTemp()
	{
        getTemplate('single-post.html', function(template) {

            var renderedTemp = template({ formID : 0 });
            $('.job-single-post').html(renderedTemp);

            //create fileuploader
            singlePostFileUploader()
                .on('fileuploadadd',
                    function(e, data) {
                        JobTemporary.fileUploader = data;
                    });
            
            $('.datepicker').datepicker();

            selectPickers();

            Helper.number('.number-only');

            captureFormInputVal();
            
        }, baseTemplateUrl);
	}

	function singlePostFileUploader()
	{
		FileUploader.template('.single-job-fileupload-con',
            { fileId : 'single-job-file-id' });

        return FileUploader.uploader('#single-job-file-id', 'single-job-canvas');
	}

    function addSaveAddMore() 
    {
        //button disabled start with loader
        Helper.btnLoader('.btn-save-more-addmore', '', 'start');

        //check if current job form has filled up of data, if not alert message pop up.
        Helper.validateSaveAddMore($('form[name=add-new-job-form]').serializeArray(), 
            function(isValidInput, errorMsg) {
            
                //button disabled complete with loader
                Helper.btnLoader('.btn-save-more-addmore', 'Save & Add more', 'complete');

                if (!isValidInput) {
                    //modal alert message
                    Helper.formValidationMsg(errorMsg, 
                        baseTemplateUrl, false);
                    saveAddMoreAlertMsg();
                    return false;
                }

                if (isValidInput)
                {
                    getTemplate('add-new-job.html', function(template) {

                        var renderedTemp = template({ formID : formID });
                        $('.job-group-multiple-form-con').append(renderedTemp);

                        //create select pickers for industries, locations and currencies
                        selectPicker.locations('.location-' + formID, "jobs[job-" + formID + "][location]", "", formID, 'location_text');
                        selectPicker.industries('.industry-' + formID, "jobs[job-" + formID + "][industry]", "", formID, 'industry_text');
                        selectPicker.currencies('.currency-' + formID, "jobs[job-" + formID + "][currency_id]", "", formID, 'currency_text');

                        Helper.number('.number-only');

                        removeSaveAddMore();

                        captureFormInputVal();

                        formID++;

                    }, baseTemplateUrl);
                }
        });
    }

    function removeSaveAddMore() 
    {
        $('.btn-remove-added-form').on('click', function() {
            if ($('.added-job-form').length > 1)
                $(this).parent().parent().remove();  
        });
    }

    //use to create fileuploader
	function fileUploaderTemp(container, fileId, canvasId)
	{
		FileUploader.template(container, 
            { fileId : fileId })
            .uploader('#' + fileId, canvasId);
	}

    /*
        Getting template for Underscore
    */
    function getTemplate(templateName, callback, source) {
        if (!templates[templateName]) {
            $.get(source + templateName, function(resp) {
                compiled = _.template(resp);
                templates[templateName] = compiled;
                if (_.isFunction(callback)) {
                    callback(compiled);
                }
            }, 'html');
        } else {
            callback(templates[templateName]);
        }
    }

})($);
$(JobTemporary.init);