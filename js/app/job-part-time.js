var fulltimeForm = $('form[name=add-new-job-form]');

var JobPartTime = (function ($) {
	
	var formID = 1;
	var formData = {};
	var btnGroupJob = null;
	var btnSingleJob = null;
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
		commonTemp();

		btnGroupJob = $('#btn-group-job');
		btnSingleJob = $('#btn-single-job');
		formCon = $('.add-new-job-con');
		errorMsgCon = $('.error-msg-con');
		jobPanel = $('.panel-part-time-con');
		jobGroupPostCon = $('.job-group-post');
		jobSinglePostCon = $('.job-single-post');
		jobPreviewCon = $('.part-time-preview-con');
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
		Template.get('#panel-control-button-temp', '.panel-footer', { callback : 'JobPartTime.addSaveAddMore()' });
	}

	function selectedPost()
	{
		btnGroupJob.on('click', function() {

			$('.btn-job-single-post').hide();
			$('.btn-job-group-post').show();

			errorMsgCon.empty();
			jobSinglePostCon.empty();
			groupPostTemp();
		});

		btnSingleJob.on('click', function() {
			
			$('.btn-job-group-post').hide();
			$('.btn-job-single-post').show();

			errorMsgCon.empty();
			jobGroupPostCon.empty();
			singlePostTemp();
		});
	}

	function jobPreview()
	{
		fulltimeForm.on('submit', function(e) {

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
		                file_name : responseData.file_name || null,
		                headline : (typeof responseData.headline !== "undefined") ? responseData.headline : null,
		                headlineDesc : (typeof responseData.headline_desc !== "undefined") ? responseData.headline_desc : null,
		                validUntil : responseData.hiring_duration_to,
		                jobs : responseData.jobs,
		            };

		            JobPartTime.formData = modifyJobObjct(responseData);
		            JobPartTime.formData.employment_type_text = 'Part time';

		            isHeadlinePhotoUploaded('JobPartTime.previewBack()');

		            Template.get('#part-time-preview', '.part-time-preview-con', previewTempData);
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
        
        var jobsArr = $.makeArray(JobPartTime.formData.jobs);
        
        //console.log(jobsArr[0]);
        
        var jobsArrNew = $.map(jobsArr[0],
            function(val, key) { 
                return arrayToString(val.industry_text) + " " + val.job_title + 
                " " + arrayToString(val.location_text) + " " + val.currency_text +
                " " + val.salary;
            });	

        //console.log(jobsArrNew);

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
       JobPartTime.formData.for_editing = JSON.stringify(forEditing);

        var url = 'job/posting';
        //for updating job
        if (typeof jobGroupID !== 'undefined') 
        {
            url = 'job/list/' + jobGroupID;
            JobPartTime.formData._METHOD = 'PUT';
        }

        //console.log(JobPartTime.formData);

        Http.ajaxButton({
            type: 'POST',
            url: apiUrl + url,
            data : JobPartTime.formData,
            success : function(response) {
                if (response.success) {
                    window.location.href = "short-listed.php?employment_type_id=2";
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

	function modifyJobObjct(responseData)
	{
		//var json = JSON.parse(JSON.stringify({"employment_type_id":"2","post_type_id":"1","headline":"sdsadasad","headline_desc":"asdasdasdas","file_name":"Jellyfish (3).jpg","hiring_duration_from":"2016-12-07","hiring_duration_to":"2016-12-22","location_id":"8","jobs":{"job-0":{"job_title":"dsadsadassa","job_desc":"dasdasdasdasdas","salary":"3232","yr_exp":"3-4","duration_from":"2016-12-01","duration_to":"2016-12-03","durations":{"1480521600000":{"preview":"Thursday (:time_from to :time_to)","date":"2016-12-01","day":"Thursday","duration_time_enable":"on","duration_time_from":["5:00 PM"],"duration_time_to":["7:00pm"]},"1480608000000":{"preview":"Friday (:time_from to :time_to)","date":"2016-12-02","day":"Friday","duration_time_enable":"on","duration_time_from":["6:00pm","8:00 pm","10:00 PM"],"duration_time_to":["7:00pm","9:00 PM","11: 59PM"]},"1480694400000":{"preview":"Saturday (:time_from to :time_to)","date":"2016-12-03","day":"Saturday","duration_time_enable":"on","duration_time_from":["4:00pm"],"duration_time_to":["9:00 PM"]}},"post_status_id":"2","location":["6","9"],"location_text":["ANGOLA","ANTIGUA AND BARBUDA"],"location_text_json":["{'6' : 'ANGOLA'}","{'9' : 'ANTIGUA AND BARBUDA'}"],"industry":["32","31"],"industry_text":["Beauty\/Fitness\/PersonalCare\/SPA","Aviation\/ Airlines\/ Aerospace"],"industry_text_json":["{'32' : 'Beauty\/Fitness\/PersonalCare\/SPA'}","{'31' : 'Aviation\/ Airlines\/ Aerospace'}"],"currency_id":"7","currency_text":"ARS","currency_text_json":"{'7' : 'ARS'}"},"job-1":{"job_title":"asdasdsd","job_desc":"asdasdasdasdasda","salary":"23232","yr_exp":"2-4","duration_from":"2016-12-09","duration_to":"2016-12-10","durations":{"1481212800000":{"preview":"Friday (:time_from to :time_to)","date":"2016-12-09","day":"Friday","duration_time_enable":"on","duration_time_from":["3:00 AM","5:57 AM"],"duration_time_to":["5:45 PM","6: 55 AM"]},"1481299200000":{"preview":"Saturday (:time_from to :time_to)","date":"2016-12-10","day":"Saturday","duration_time_enable":"on","duration_time_from":["7:00 AM"],"duration_time_to":["3:00 PM"]}},"post_status_id":"2","location":["5"],"location_text":["ANDORRA"],"location_text_json":["{'5' : 'ANDORRA'}"],"industry":["2"],"industry_text":["Automotive\/ Ancillaries"],"industry_text_json":["{'2' : 'Automotive\/ Ancillaries'}"],"currency_id":"4","currency_text":"ALL","currency_text_json":"{'4' : 'ALL'}"},"job-2":{"job_title":"sdfaass","job_desc":"dsadsadas","salary":"32323","yr_exp":"3-4","duration_from":"2016-12-01","duration_to":"2016-12-02","durations":{"1480521600000":{"preview":"Thursday (:time_from to :time_to)","date":"2016-12-01","day":"Thursday","duration_time_enable":"on","duration_time_from":["4:00 PM"],"duration_time_to":["6:00 PM"]},"1480608000000":{"preview":"Friday (:time_from to :time_to)","date":"2016-12-02","day":"Friday","duration_time_enable":"on","duration_time_from":["7: 00 AM"],"duration_time_to":["10:00 PM"]}},"post_status_id":"2","location":["4","8","6"],"location_text":["AMERICAN SAMOA","ANTARCTICA","ANGOLA"],"location_text_json":["{'4' : 'AMERICAN SAMOA'}","{'8' : 'ANTARCTICA'}","{'6' : 'ANGOLA'}"],"industry":["34","32"],"industry_text":["Cement","Beauty\/Fitness\/PersonalCare\/SPA"],"industry_text_json":["{'34' : 'Cement'}","{'32' : 'Beauty\/Fitness\/PersonalCare\/SPA'}"],"currency_id":"6","currency_text":"AOK","currency_text_json":"{'6' : 'AOK'}"}},"industry_id":"34","currency_id":"","FileInfo":"blob:http:\/\/localhost\/9c988aa8-6f51-4435-8f58-098ec737900a"}));
		//console.log(json.jobs);
		var tempArr = [];

		$.each(responseData.jobs, function(jobId, job) {

			$.each(job.durations, function(timestamp, duration) {
				
				tempArr.push({
					timestamp: timestamp,
					date: duration.date,
					day: duration.day,
					time: iterateDurations(duration.duration_time_from, duration.duration_time_to),
				});

				$.extend(responseData.jobs[jobId], { day_time:  JSON.stringify(tempArr) });
			});

			tempArr = [];
		});

		return responseData;
	}

	function iterateDurations(duration_time_from, duration_time_to) {
		var durationArr = [];

		for(var i in duration_time_from) {

			durationArr.push({ start : duration_time_from[i], end : duration_time_to[i] });
		}
		return durationArr;
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
//console.log(jobObj);
            var jsonFileInputText = $('<input type="hidden"/>')
                    .attr({ name: 'json_file_id', value: jsonForEdit.jsonId });

            fulltimeForm.prepend(jsonFileInputText);

            //console.log(jsonFileId);

            selectPicker.isEdit = true;
            
            $.ajax(jsonForEdit.file, {
                dataType: 'JSON',
                beforeSend: function() {
                    var postCon = null;
                    if (postTypeID == 1) postCon = jobGroupPostCon;
                    if (postTypeID == 2) postCon = jobSinglePostCon;
                    postCon.html('<center><i class="fa fa-spin fa-5x fa-circle-o-notch" ></i></center>');
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

                    fulltimeForm.append($('<input type="hidden" name="job_group_id"/>').val(jobGroupID));

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

                    $('.datepicker').datepicker({
                            format: 'yyyy-mm-dd'
                        }
                    );

                    $('.added-job-form').each(function(i, elem) {
						DateHelper.rangePicker('.date-range-' + i, '.date-range-input-' + i, '.day-time-con-' + i, i);                    	
                    });

                    DateHelper.disabledDayTime();

                    Helper.number('.number-only');
                    Helper.time('.time-only');

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

			DateHelper.rangePicker('.date-range-0', '.date-range-input-0', '.day-time-con-0', 0);

			$('.datepicker').datepicker({
				format: 'yyyy-mm-dd'
			});

			captureFormInputVal();
		}
	
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
        
        $('.datepicker').datepicker({
			format: 'yyyy-mm-dd'
		});

		selectPickers();

		DateHelper.rangePicker('.date-range-0', '.date-range-input-0', '.day-time-con-0', 0);

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
$(JobPartTime.init);