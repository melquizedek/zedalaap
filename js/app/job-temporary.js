var temporaryForm = $('form[name=add-new-job-form]');

var JobTemporary = (function ($) {
	
	var formID = 1;
	var formData = null;
	var btnGroupPostType = null;
	var btnSinglePostType = null;
	var formCon = null;
	var jobPanel = null;
	var jobGroupPostCon = null;
	var jobSinglePostCon = null;
	var jobPreviewCon = null;
	var postTypeSingleRadio = null;
    var postTypeGroupRadio = null;
	var isGroupPost = false;
	var isSinglePost = false;
	var btnJobGroup = null;
    var btnJobSingle = null;

	return {
		init: init,
		removeSaveAddMore: removeSaveAddMore,
		addSaveAddMore: addSaveAddMore,
		previewBack: previewBack,
		makeDurationDate: makeDurationDate,
		posting: posting,
	};

	function init()
	{
		$.fn.datepicker.defaults.format = "yyyy-mm-dd";

		commonTemp();

		btnGroupPostType = $('#btn-group-job');
		btnSinglePostType = $('#btn-single-job');

		formCon = $('.add-new-job-con');
		errorMsgCon = $('.error-msg-con');
		jobPanel = $('.panel-part-time-con');
		jobGroupPostCon = $('.job-group-post');
		jobSinglePostCon = $('.job-single-post');
		jobPreviewCon = $('.temporary-preview-con');
		postTypeGroupRadio = $('#posttype-group-post');
		postTypeSingleRadio = $('#posttype-single-post');

		btnJobGroup = $('.btn-job-group-post');
    	btnJobSingle = $('.btn-job-single-post');
        
		groupPostTemp();
		jobPreview();
		selectedPost();
        Helper.number('.number-only');
		captureFormInputVal();
	}

	function commonTemp() 
	{
		Template.get('#btn-post-type-temp', '.panel-heading');
		Template.get('#panel-control-button-temp', '.panel-footer', { callback : 'JobTemporary.addSaveAddMore()' });
	}

	function selectedPost()
	{
		btnGroupPostType.on('click', function() {

			$('.btn-job-single-post').hide();
			$('.btn-job-group-post').show();

			errorMsgCon.empty();
			jobSinglePostCon.empty();
			groupPostTemp();
		});

		btnSinglePostType.on('click', function() {
			
			$('.btn-job-group-post').hide();
			$('.btn-job-single-post').show();

			errorMsgCon.empty();
			jobGroupPostCon.empty();
			singlePostTemp();
		});
	}

	function jobPreview()
	{
		temporaryForm.on('submit', function(e) {

            e.preventDefault();

            var dataArr = $(this).serializeArray();
            
            var fileInfo = {};

            try {
                fileInfo = { name : 'FileInfo', 
                    value: URL.createObjectURL(FileUploader.filesInfo) };
            } catch(e) {
                fileInfo = { name : 'FileInfo', value: null };
            }

            dataArr.push(fileInfo);

            var successCallback =  function(response) {
                
                //JobFulltimeActions.cleanUnNeededDom();

                var responseData = JSON.parse(response);

                if (responseData.errorMsg) {
                    
                    Template.get('#error-msg-temp', '.error-msg-con',
                        { errorMsgs : responseData.errorMsg });

                    $('body,html').stop(true).animate({ 'scrollTop': 0 });

                } else {

                    errorMsgCon.empty();
                    
                    formCon.hide();
                    jobPreviewCon.show();

                    var previewTempData = {
		                file_name : responseData.file_name,
		                headline : (typeof responseData.headline !== "undefined") ? responseData.headline : null,
		                headlineDesc : (typeof responseData.headline_desc !== "undefined") ? responseData.headline_desc : null,
		                validUntil : responseData.hiring_duration_to,
		                jobs : responseData.jobs,
		            };

		            JobTemporary.formData = responseData;
		            JobTemporary.formData.employment_type_text = 'Temporary';

                    isHeadlinePhotoUploaded('JobTemporary.previewBack()');
                    
		            Template.get('#temporary-time-preview', '.temporary-preview-con', previewTempData);
                    //console.log(JobTemporary.formData);
                }
            }

            $.ajax({
                type: 'POST',
                url: apiUrl + '/to-json-encode',
                data: dataArr,
                success: successCallback,
                error: function(response) {
                    console.log("Failed: ", response);
                }
            });

        });
	}

	function posting(btn) {
        
        var jobsArr = $.makeArray(JobTemporary.formData.jobs);
        
        var jobsArrNew = $.map(jobsArr[0], 
            function(val, key) { 
                return arrayToString(val.industry_text) + " " + val.job_title + 
                " " + arrayToString(val.location_text) + " " + val.currency_text +
                " " + val.salary;
            });

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
        //for updating job
        if (typeof jobGroupID !== 'undefined') 
        {
            url = 'job/list/' + jobGroupID;
            JobTemporary.formData._METHOD = 'PUT';
        }

        //console.log(JobTemporary.formData);

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
        if (jobGroupPostCon.children().length) 
            return jobGroupPostCon.html();

        if (jobSinglePostCon.children().length) 
            return jobSinglePostCon.html();
    }


	function previewBack() 
	{
		jobPreviewCon.hide();
		formCon.show();
	}

	function groupPostTemp()
	{
		//edit part time job
		if (typeof jobGroupID !== 'undefined') {

			var jobObj = JSON.parse(localStorage.getItem('jobObj'));
            var jsonForEdit = JSON.parse(jobObj.for_editing);

            var jsonFileInputText = $('<input type="hidden"/>')
                    .attr({ name: 'json_file_id', value: jsonForEdit.jsonId });
            
            temporaryForm.prepend(jsonFileInputText);

            selectPicker.isEdit = true;
            
            $.ajax(jsonForEdit.file, {
                dataType: 'JSON',
                beforeSend: function() {

                    var postCon = null;
                    if (postTypeID == 1) postCon = jobGroupPostCon;
                    if (postTypeID == 2) postCon = jobSinglePostCon;
                    postCon.html('<center><i class="fa fa-spin fa-5x fa-circle-o-notch"></i></center>');
                },
                success: function(response) {
                    
                    //console.log(response);

                    if (postTypeID == 1) 
                    {
                        jobGroupPostCon.html(response.html);
                        
                        $('.group-job-fileupload-con').empty();
                        groupPostFileUploader();
                    }

                    if (postTypeID == 2) 
                    {
                        jobSinglePostCon.html(response.html);

                        postTypeSingleRadio.attr('checked', true);
                        postTypeGroupRadio.removeAttr('checked');

                        btnJobGroup.hide();
                        btnJobSingle.show();

                        $('.single-job-fileupload-con').empty();
                        singlePostFileUploader();

                    }

                    if (jobObj.cover_photo) 
                    {
                        setTimeout(function () {
                            $('.file-to-upload')
                                .append('<img src="api/v1/public/files/' + jobObj.cover_photo + '"/>')
                                .append('<input type="hidden" name="file_name" value="' + jobObj.cover_photo + '"/>');
                        }, 1000);
                    }

                    temporaryForm.append($('<input type="hidden" name="job_group_id"/>').val(jobGroupID));

                    resetAddedFormId();
                    
                    formID = getAddedFormNum();

                    $('.bootstrap-select').remove();
                    $.each(response.selectOptsLocation, 
                        function(i, opts) {
                            selectPicker.locations('.location-' + i, "", 'jobs[job-' + i + '][location_id][]', i, 'location_text', $.trim(opts));
                        });

                    $.each(response.selectOptsIndustry, 
                        function(i, opts) {
                            selectPicker.industries('.industry-' + i, "", 'jobs[job-' + i + '][industry_id][]', i, 'industry_text', $.trim(opts));
                        });

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

                    captureFormInputVal();
                },
                error: function(response) {
                    console.log(response);
                }
            });

		} else {

			Template.get('#group-add-job-form-temp', '.job-group-post', { formID : 0 });

			groupPostFileUploader();

			selectPickers();

			$('.datepicker').datepicker();

			jobDateDuration();

            Helper.number('.number-only');

			captureFormInputVal();
		}

	}

	function jobDateDuration(formId)
	{
		formId = formId || 0;
		Template.get('#date-duration-temp', '.job-duration-' + formId , { formID : formId });
	}

	function selectPickers()
	{
		selectPicker.locations('.location-0', "", "", 0, 'location_text');
		selectPicker.industries('.industry-0', "", "", 0, 'industry_text');
		selectPicker.currencies('.currency-0', "", "", 0, 'currency_text');
	}

	function groupPostFileUploader()
	{
		FileUploader.template('.group-job-fileupload-con',
            { fileId : 'group-job-file-id' })
            .uploader('#group-job-file-id', 'group-job-canvas');
	}

	function singlePostTemp()
	{
		Template.get('#single-add-new-job-temp', '.job-single-post', { formID : 0 });

		singlePostFileUploader();
        
        $('.datepicker').datepicker();

		selectPickers();

		jobDateDuration();

        Helper.number('.number-only');

		captureFormInputVal();
	}

	function singlePostFileUploader()
	{
		FileUploader.template('.single-job-fileupload-con',
            { fileId : 'single-job-file-id' })
            .uploader('#single-job-file-id', 'single-job-canvas');
	}

	function addSaveAddMore() 
	{
		Template.get('#job-group-multiple-form-temp', '.job-group-multiple-form-con', { formID : formID }, 'append');
		
		selectPicker.locations('.location-' + formID, "jobs[job-" + formID + "][location_id]", "", formID, 'location_text');
		selectPicker.industries('.industry-' + formID, "jobs[job-" + formID + "][industry_id]", "", formID, 'industry_text');
		selectPicker.currencies('.currency-' + formID, "jobs[job-" + formID + "][currency_id]", "", formID, 'currency_text');

		DateHelper.rangePicker('.date-range-' + formID, '.date-range-input-' + formID, '.day-time-con-' + formID, formID);
		
		jobDateDuration(formID);

        Helper.number('.number-only');

		captureFormInputVal();

		formID++;
	}

	function removeSaveAddMore(formID) 
	{
		$('#added-job-form-' + formID).remove();
	}

	function fileUploaderTemp(container, fileId, canvasId)
	{
		FileUploader.template(container, 
            { fileId : fileId })
            .uploader('#' + fileId, canvasId);
	}

})($);
$(JobTemporary.init);