var JobPartTime = (function($) {
    
    var templates = [];
    var baseTemplateUrl = 'template/job/part-time/';
    var postingUrl = 'job/posting';
	var formID = 1;
	var formData = null;
    var fileUploader = null;
    var isRendered = false;
    var ajaxLoader = '<center><i class="fa fa-spin fa-5x fa-circle-o-notch"></i></center>';

	return {
		init: init,
        addSaveAddMore: addSaveAddMore,
		removeSaveAddMore: removeSaveAddMore,
		previewBack: previewBack,
		posting: posting
	};

	function init()
	{
        $.fn.datepicker.defaults.format = "yyyy-mm-dd";
        addEventHandlers();
        groupPostTemp();
        captureFormInputVal();
	}

    function addEventHandlers()
    {
        $(".panel-heading").on("click", "#btn-single-job", jobSinglePosting);
        $(".panel-heading").on("click", "#btn-group-job", jobGroupPosting);
        $(".add-new-job-con").on('submit',"form[name=add-new-job-form]", preview);
    }

    function jobSinglePosting()
    {   
        $('.btn-job-group-post').addClass('hidden');
        $('.btn-job-single-post').removeClass('hidden');
        $('.error-msg-con').empty();
        $('.job-group-post').empty();
        singlePostTemp();
    }

    function jobGroupPosting()
    {
        $('.btn-job-single-post').addClass('hidden');
        $('.btn-job-group-post').removeClass('hidden');
        $('.error-msg-con').empty();
        $('.job-single-post').empty();
        groupPostTemp();
    }

	function preview(e)
	{
        e.preventDefault();

        var dataArr = $(this).serializeArray();
        
        var successCallback =  function(response) {
            
            Helper.btnLoader('.btn-preview', 'Preview', 'complete');

            var responseData = JSON.parse(response);

            if (responseData.errorMsg) 
            {
                Helper.formValidationMsg(responseData.errorMsg,
                    baseTemplateUrl, true);
                return false;
            }   
            
            $('.error-msg-con').empty();
            $('.add-new-job-con').addClass('hidden');
            $('.part-time-preview-con').removeClass('hidden');

            responseData = createDayTime(responseData);

            JobPartTime.formData = responseData;
            JobPartTime.formData.employment_type_text = 'Part time';

            var previewTempData = {
                file_name : responseData.file_name || null,
                headline : responseData.headline || null,
                headlineDesc : responseData.headline_desc || null,
                validUntil : responseData.hiring_duration_to,
                jobs : responseData.jobs
            };

            JobPartTime.formData.file_name = responseData.file_name;

            Template.get('#part-time-preview', 
                            '.part-time-preview-con',
                            previewTempData);

            //check if their is an image to upload - then do upload 
            if (FileUploader.fileLength) 
            {
                $.when(Helper.doUploadProcess(JobPartTime.fileUploader))
                    .done(function (response) {
                            
                        var filename = response.data.name;
                        previewTempData.file_name = filename;
                        JobPartTime.formData.file_name = filename;

                        Template.get('#part-time-preview', 
                            '.part-time-preview-con',
                            previewTempData);

                        console.log(FileUploader.fileLength, FileUploader.inProgress);
                        
                        if (FileUploader.inProgress === 'done')
                            Helper.btnLoader('.btn-post', 'Post', 'complete');

                    })
                    .fail(function (response) {
                        console.log(response.data)
                    })
                    .progress(function (response) {
                        console.log(FileUploader.fileLength, FileUploader.inProgress);
                        if (FileUploader.inProgress === 'start')
                            Helper.btnLoader('.btn-post', "Photo Headline Uploading...", 'start');
                    });
            }
            
        }

        Helper.btnLoader('.btn-preview', '', 'start');
        
        $.ajax({
            type: 'POST',
            url: apiUrl + 'to-json-encode',
            cache: false,
            data: dataArr,
            success: successCallback,
            error: function(response) {
                console.log("Failed: ", response);
            }
        });
	}

    //method use to create time range data
    function createDayTime(responseData)
    {
        var dayTimeArr = [];

        _.each(responseData.jobs, function(job, jobId) {
            
            _.each(job.durations, function(duration, timestamp) { 

                dayTimeArr.push({
                        timestamp: timestamp,
                        date: duration.date,
                        day: duration.day,
                        duration_time_enable: duration.duration_time_enable,
                        duration_time_from: duration.duration_time_from,
                        duration_time_to: duration.duration_time_to
                    });

                $.extend(responseData.jobs[jobId], {
                    day_time : JSON.stringify(dayTimeArr)
                });

            });

            dayTimeArr = [];
        });

        return responseData;
    }

    function createSearchkeys()
    {
        var jobsArr = _.first($.makeArray(JobPartTime.formData.jobs));

        var jobsArrNew = $.map(jobsArr, function(val, key) { 
                if (typeof val.industry_text !== "undefined" && 
                    typeof val.location_text !== "undefined") {
                        return arrayToString(val.industry_text) + " " + val.job_title + 
                        " " + arrayToString(val.location_text) + " " + val.currency_text +
                        " " + val.salary;
                }
            });
        
        return jobsArrNew;
    }

	function posting() {
        
        //store searckeys to a storage in able to use it on next page  
        var searchKeys = createSearchkeys();
        localStorage.setItem('searchKeys', JSON.stringify(searchKeys));
 
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
       JobPartTime.formData.for_editing = JSON.stringify(forEditing);

        //if jobGroupId exist then do update process
        if (typeof jobGroupID !== 'undefined') 
        {
            postingUrl = 'job/list/' + jobGroupID;
            JobPartTime.formData._METHOD = 'PUT';
        }

        Helper.btnLoader('.btn-post', '', 'start');

        $.ajax({
            type: 'POST',
            url: apiUrl + postingUrl,
            cache: false,
            data : JobPartTime.formData,
            success : function(response) {
                
                Helper.btnLoader('.btn-post', 'Post', 'complete');

                if (response.success) {
                    window.location.href = 
                        "short-listed.php?employment_type_id=2";
                }
            }
        });

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
		$('.part-time-preview-con').addClass('hidden');
		$('.add-new-job-con').removeClass('hidden');
	}

	function groupPostTemp()
	{
		//edit part time job
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
                cache: false,
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

                        groupPostFileUploader().on('fileuploadadd',
                            function(e, data) {
                                JobPartTime.fileUploader = data;
                            });
                    }

                    if (postTypeID == 2) 
                    {
                        $('.job-single-post').html(response.html);
                        $('#posttype-single-post').attr('checked', true);
                        $('#posttype-group-post').removeAttr('checked');
                        $('.btn-job-group-post').addClass('hidden');
                        $('.btn-job-single-post').removeClass('hidden');
                        $('.single-job-fileupload-con').empty();

                        //create fileuploader
                        singlePostFileUploader().on('fileuploadadd', 
                            function(e, data) {
                                JobPartTime.fileUploader = data;
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

                    $('form[name=add-new-job-form]')
                        .append($('<input type="hidden" name="job_group_id"/>')
                        .val(jobGroupID));

                    resetAddedFormId();
                    
                    formID = getAddedFormNum();

                    $('.bootstrap-select').remove();

                    //create select picker for locations
                    $.each(response.selectOptsLocation, 
                        function(i, opts) {
                            selectPicker.locations('.location-' + i, "", 'jobs[job-' + i + '][location][]', i, 'location_text', $.trim(opts));
                        });

                    //create select picker for industries
                    $.each(response.selectOptsIndustry, 
                        function(i, opts) {
                            selectPicker.industries('.industry-' + i, "", 'jobs[job-' + i + '][industry][]', i, 'industry_text', $.trim(opts));
                        });

                    //create select picker for currencies
                    $.each(response.selectOptsCurrencies, 
                        function(i, opts) {
                            selectPicker.currencies('.currency-' + i, "", 'jobs[job-' + i + '][currency_id]', i, 'currency_text', $.trim(opts));
                        });

                    $('.datepicker').datepicker({
                            format: 'yyyy-mm-dd'
                        }
                    );

                    $('.added-job-form').each(function(i, elem) {
                        //create date range with time input fields
						DateHelper.rangePicker('.date-range-' + i, 
                            '.date-range-input-' + i, '.day-time-con-' + i, i);                    	
                    });

                    validation();

                    captureFormInputVal();
                },
                error: function(response) {
                    console.log(response);
                }
            });

		} else {

            $('.job-group-post').html(ajaxLoader);

            getTemplate('group-post.html', function(template) {
                
                var renderTemp = template({ formID : 0 });
                $('.job-group-post').html(renderTemp);

                //create fileuploader
                groupPostFileUploader()
                    .on('fileuploadadd', function(e, data) {
                        JobPartTime.fileUploader = data;
                    });

                selectPickers();    

                //create datepicker with time to and from input fields
                DateHelper.rangePicker('.date-range-0', '.date-range-input-0', '.day-time-con-0', 0);

                $('.datepicker').datepicker({
                    format: 'yyyy-mm-dd'
                });

                validation();
                
                captureFormInputVal();
            });

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
        $('.job-single-post').html(ajaxLoader);

        getTemplate('single-post.html', function(template) {
            
            var renderTemp = template({ formID : 0 });
            $('.job-single-post').html(renderTemp);

            singlePostFileUploader().on('fileuploadadd',
                function(e, data) {
                    JobPartTime.fileUploader = data;
                });
            
            $('.datepicker').datepicker({
                format: 'yyyy-mm-dd'
            });

            selectPickers();

            //create range picker with time from and to fields
            DateHelper.rangePicker('.date-range-0', '.date-range-input-0', '.day-time-con-0', 0);

            validation();

            captureFormInputVal();
        });

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
            function(hasValidInput, errorMsg) {
            
                //button disabled complete with loader
                Helper.btnLoader('.btn-save-more-addmore', 'Save & Add more', 'complete');

                if (!hasValidInput) {
                    //modal alert message
                    Helper.formValidationMsg(errorMsg, 
                        baseTemplateUrl, false);
                    saveAddMoreAlertMsg();
                    return false;
                }

                if (hasValidInput)
                {
                    getTemplate('add-new-job.html', function(template) {

                        var renderedTemp = template({ formID : formID });
                        $('.job-group-multiple-form-con').append(renderedTemp);
                        
                        //create select pickers for industries, locations and currencies
                        selectPicker.locations('.location-' + formID, "jobs[job-" + formID + "][location]", "", formID, 'location_text');
                        selectPicker.industries('.industry-' + formID, "jobs[job-" + formID + "][industry]", "", formID, 'industry_text');
                        selectPicker.currencies('.currency-' + formID, "jobs[job-" + formID + "][currency_id]", "", formID, 'currency_text');

                        DateHelper.rangePicker('.date-range-' + formID, '.date-range-input-' + formID, '.day-time-con-' + formID, formID);
                        
                        Helper.number('.number-only');

                        captureFormInputVal();

                        formID++;
                    });
                }
        });
	}

	function removeSaveAddMore(elem) 
	{
        if ($('.added-job-form').length > 1)
		  $(elem).parent().parent().remove();
	}

    //use to create fileuploader
	function fileUploaderTemp(container, fileId, canvasId)
	{
		FileUploader.template(container, { fileId : fileId });
        FileUploader.uploader('#' + fileId, canvasId);
	}

    function validation()
    {
        Helper.number('.number-only');
        Helper.time('.time-only');
    }

    // Get Template
    function getTemplate(templateName, callback, source) {

        var defer = $.Deferred();
        baseTemplateUrl = (source) ? source : baseTemplateUrl;

        defer.notify("processing...");
        if (!templates[templateName]) {
            $.get(baseTemplateUrl + templateName, function(resp) {
                compiled = _.template(resp);
                templates[templateName] = compiled;
                if (_.isFunction(callback)) {
                    callback(compiled);
                    defer.resolve("temp_rendered");
                }
            }, 'html')
            .fail(function(jqXHR, textStatus ) {
                defer.reject(textStatus);
                console.log(textStatus + ": Failed to rendered the template.");
            });
        } else {
            callback(templates[templateName]);
            defer.resolve("temp_in_array");
            defer.notify("done");
        }

        return defer;
    }

})($);
$(JobPartTime.init);