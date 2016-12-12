
var Resources = (function() {
	
	return {
		init: init,
		getCountry: getCountry,
		getIndustry: getIndustry,
		getCurrency: getCurrency,
	};

	function init () {}
	
	function getCountry (callback) {
		$.post(apiUrl + 'job/resources/country', 
			{fields: 'country_id, country_name'}, callback);
	}

	function getIndustry (callback) {
		$.post(apiUrl + 'job/resources/industry', 
			{fields: 'industry_id, industry'}, callback);
	}

	function getCurrency (callback) {
		$.post(apiUrl + 'job/resources/currency', 
			{fields: 'currency_id, currency_name, currency_code'}, callback);
	}

})($);
$(Resources.init);



var Http = (function($) {

	
	var config = {};

	return {
		init: init,
		config: config,
		ajaxButton: ajaxButton,
	};

	function init() {}

	function ajaxButton (config, elem, textLoader) {

		if (!config) 
			throw "Http.create: ajax config parameter is required.";
		
		var origTxt = elem.text();

		elem
			.text(textLoader)
			.prepend('<i class="fa fa-spin fa-circle-o-notch"></i> ')
		    .addClass('disabled');
		
		$.ajax(config)
			.fail(function() {

				console.log("Ajax Request Failed!");
			})
			.always(function() {

				elem.find('.fa').remove();
		    	elem.text(origTxt).removeClass('disabled');
		  	});
	}

})($);
$(Http.init);

/*
=====================Selecpicker========================>
*/
var selectPicker = (function() {
	
	var inputTextContainer = "";
	var isEdit = false;

	return {
		init: init,
		inputTextContainer: inputTextContainer,
		locations: locations,
		__createSelectInputText: __createSelectInputText,
		industries: industries,
		currencies: currencies,
		isEdit: isEdit,
	};

	function init() {}

	function locations(selectCon, selectClass, selectName,
		uniqueId, selectInputTextName, opts) {
		
		var selectClass = $.trim(selectClass).length ? 
			selectClass : ".select-location";

		var selectName = $.trim(selectName).length ? 
			selectName : "location_id";

		var selectId = "location-" + uniqueId;

		var jsonData = {
			name : selectName,
			className : selectClass.replace(/\./g, ""),
			formUniqueId : uniqueId,
			id: selectId,
			locations: JSON.parse(localStorage.getItem('countries')),
			options : opts,
		};

		Template.get('#select-location-temp', selectCon, jsonData);

		var selecpicker = $('#' + selectId).selectpicker({
			tickIcon:  'fa fa-check',
			width: 'auto',
		});

		var selectInputTextName = $.trim(selectInputTextName) ? selectInputTextName : "";
		selectPicker.__createSelectInputText(selecpicker, selectInputTextName);

		return selecpicker;
	}

	function industries(selectCon, selectClass, selectName, 
		uniqueId, selectInputTextName, opts) {
		
		var selectClass = $.trim(selectClass).length ? 
			selectClass : ".select-industry";

		var selectName = $.trim(selectName).length ? 
			selectName : "industry_id";

		var selectId = "industry-" + uniqueId;

		var jsonData = {
			name : selectName,
			className : selectClass.replace(/\./g, ""),
			formUniqueId : uniqueId,
			id: selectId,
			industries : JSON.parse(localStorage.getItem('industries')),
			options : opts,
		};

		Template.get('#select-industry-temp', selectCon, jsonData);
		
		var selecpicker = $('#' + selectId).selectpicker({
			tickIcon:  'fa fa-check',
			width: 'auto',
		});

		var selectInputTextName = $.trim(selectInputTextName) ? selectInputTextName : "";
		selectPicker.__createSelectInputText(selecpicker, selectInputTextName);

		return selecpicker;
	}

	function currencies(selectCon, selectClass, selectName, 
		uniqueId, selectInputTextName, opts) {
		
		var selectClass = $.trim(selectClass).length ? 
			selectClass : ".select-currency";

		var selectName = $.trim(selectName).length ? 
			selectName : "currency_id";

		var selectId = "currency-" + uniqueId;

		var jsonData = {
			name : selectName,
			className : selectClass.replace(/\./g, ""),
			formUniqueId : uniqueId,
			id: selectId,
			currencies : JSON.parse(localStorage.getItem('currencies')),
			options : opts,
		};

		//console.log(jsonData.options);

		Template.get('#select-currency-temp', selectCon, jsonData);

		console.log(selectPicker.isEdit);

		if (!selectPicker.isEdit) { 
			$('#added-job-form-' + uniqueId)
				.append('<input type="hidden" name="jobs[job-' + uniqueId + '][currency_id]" class="currency-id-' + uniqueId + '" value=""/>');
		}

		var selecpicker = $('#' + selectId).selectpicker({
			width: '400px',
			liveSearchPlaceholder: 'Currency',
		});

		var selectInputTextName = $.trim(selectInputTextName) ? selectInputTextName : "";
		__createSelectInputTextSingle(selecpicker, selectInputTextName);

		return selecpicker;
	}

	function __createSelectInputTextSingle(selecPicker, inputName) {

		selecPicker.on('changed.bs.select', 
			function (event, index, newValue, oldValue) {

				var currentSelect = $(this);
				var formId = currentSelect.data('form-unique-id');
				var opt = $(currentSelect.find('option').eq(index));
	    		var optText = $.trim(opt.text());
	    		var selectType = currentSelect.attr('id').split('-')[0];

	    		currentSelect.find('option').removeAttr("selected");

    			$('.' + selectType + '-input-text-' + formId).remove();
    			$('.' + selectType + '-input-text-json-' + formId).remove();
    			$('.currency-id-' + formId).remove();

    			var inputTextCon = $.trim(selectPicker.inputTextContainer).length ? 
    				selectPicker.inputTextContainer : '#added-job-form-' + formId;

    			console.log('Container used for selectpicker - ', inputTextCon);
    			
    			opt.attr('selected', true);

    			$('.currency-id-' + formId).remove();

    			$(inputTextCon).append('<input type="hidden" name="jobs[job-' + formId + '][currency_id]" class="currency-id-' + formId + '" value="'+ opt.attr('value') +'"/>');

    			Template.get('#select-input-text', inputTextCon,
    				{ inputName : 'jobs[job-' + formId + '][' + inputName + ']', 
    					value : optText,
    					formID : formId, 
    					selectType : selectType,
    					index : index,
    					addedClass : selectType + '-input-text-' + formId, 
    				}
    			, 'append');

    			var jsonStr = "{'" + opt.val() + "' : '" + optText + "'}";
    			Template.get('#select-input-text-json', inputTextCon,
    				{ inputName : 'jobs[job-' + formId + '][' + inputName + '_json]',
    					value : jsonStr,
    					formID : formId,
    					selectType : selectType,
    					index : index,
    					addedClass : selectType + '-input-text-json-' + formId,
    				}
    			, 'append');

			});

	}

	function __createSelectInputText(selecPicker, inputName) {

		selecPicker.on('changed.bs.select', 
			function (event, index, newValue, oldValue) {

				var currentSelect = $(this);
				var formId = currentSelect.data('form-unique-id');
				var opt = $(currentSelect.find('option').eq(index));
	    		var optText = $.trim(opt.text());
	    		var selectType = currentSelect.attr('id').split('-')[0];

	    		if (!newValue)
	    		{	
	    			$('.input-text-' + formId + '.input-text-' + selectType + '-' + index).remove();
	    			$('.input-text-json-' + formId + '.input-text-json-' + selectType + '-' + index).remove();
	    			$('.input-' + selectType + '-' + formId + '-' + index).remove();
	    			opt.removeAttr('selected');
	    		} 
	    		else {
	    			
	    			opt.attr("selected", true);

	    			var textInputContainer = $.trim(selectPicker.inputTextContainer).length ?
	    				selectPicker.inputTextContainer : '#added-job-form-' + formId;

	    			console.log('Container used for selectpicker - ', textInputContainer);
	    			
	    			var inputText = '<input type="hidden" name="jobs[job-' + formId + '][' + selectType + '][]"' +
	    				' class="input-' + selectType + '-' + formId + '-' + index + '" value="' + opt.val() + '"/>';
	    			$(textInputContainer).append(inputText);

	    			Template.get('#select-input-text', textInputContainer,
	    				{ inputName : 'jobs[job-' + formId + '][' + inputName + '][]', 
	    					value : optText,
	    					formID : formId, 
	    					selectType : selectType,
	    					index : index,
	    					addedClass : "",
	    				}
	    			, 'append');

	    			var jsonStr = "{'" + opt.val() + "' : '" + optText + "'}";
	    	

	    			Template.get('#select-input-text-json', textInputContainer,
	    				{ inputName : 'jobs[job-' + formId + '][' + inputName + '_json][]',
	    					value : jsonStr,
	    					formID : formId,
	    					selectType : selectType,
	    					index : index,
	    					addedClass : "",
	    				}
	    			, 'append');
	    		}

			});

	}

})($);
$(selectPicker.init);


function resetAddedFormId() 
{
	//reset selectPickers container
    $.each($('.added-job-form'), function(i, elem) {

        var addedForm = $(this);
        var id = _.last(addedForm.attr("id").split("-"));
        
        addedForm.attr("id", "added-job-form-" + i);
        $('.location-' + id).removeClass('location-' + id).addClass('location-' + i);
        $('.industry-' + id).removeClass('industry-' + id).addClass('industry-' + i);
        $('.currency-' + id).removeClass('currency-' + id).addClass('currency-' + i);

        $('.date-range-' + id).removeClass('date-range-' + id).addClass('date-range-' + i);
        $('.date-range-input-' + id).removeClass('date-range-input-' + id).addClass('date-range-input-' + i);
    });
}

function captureFormInputVal() 
{
    $('input[type="text"], input[type="number"], input[type="time"]')
        .on('keyup', function(e) {
            $(this).attr('value', $(this).val());
        })
        .on('blur', function() {
            $(this).attr('value', $(this).val());
        });

    $('textarea')
        .on('keyup', function(e) {
            $(this).text($(this).val());
        })
        .on('blur', function() {
           $(this).text($(this).val());
        });

    var btnStatusPublish = $('.btn-post-status-publish, #btn-group-job');
    var btnStatusDraft = $('.btn-post-status-draft, #btn-single-job');

    btnStatusPublish.on('click', function() {
        var index = btnStatusPublish.index($(this));
        var input = $(this).children('input');

        if (!input.is(':checked')) 
        {
            input.attr('checked', true);
            $(btnStatusDraft.get(index)).children('input').removeAttr('checked');            
        }
    });

    btnStatusDraft.on('click', function() {
        var index = btnStatusDraft.index($(this));
        var input = $(this).children('input');

        if (!input.is(':checked')) 
        {
            input.attr('checked', true);
            $(btnStatusPublish.get(index)).children('input').removeAttr('checked');
        }
    });

    $('input[type="checkbox"]').on('click', function() {
    	
    	$(this).attr('checked', true);
    	if (!$(this).is(':checked')) 
    		$(this).removeAttr('checked');
    });
}

function getAddedFormNum() 
{
    var addedFormNum = $('.added-job-form').length;
    
    if (addedFormNum > 1) 
        return addedFormNum;
    else 
        return 1;
}

function removeSpecChar(str) {
    return str.replace(/[\t-\n-\r\-\s]+/g, "");
}

var DateHelper = (function($) {
	
	var timeRangeId = 0;

	return {
		init: init,
		getDay: getDay,
		rangePicker: rangePicker,
		addTimeRange: addTimeRange,
		removeTimeRange: removeTimeRange,
		disabledDayTime: disabledDayTime,
	};

	function init() {}

	function removeTimeRange(elem)
	{
		$(elem).remove();
	}

	function getDay(day) {
			var dnames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
	 				'Thursday', 'Friday', 'Saturday', 'Sunday'];
	 		return dnames[day];
	}

	function addTimeRange(timeRangeCon, formId, parentIndex, timeStamp)
	{
		var suffix = formId + '-' + parentIndex + '-' + timeStamp;
		var timeFrom = $('.duration-time-from-' + suffix);
		var timeTo = $('.duration-time-to-' + suffix);

		if (!$.trim(timeFrom.val()).length || !$.trim(timeTo.val()).length) 
		{
			timeFrom.css('border-color', '#a94442');
			timeTo.css('border-color', '#a94442');
			return false;
		} else {
			timeFrom.css('border-color', '');
			timeTo.css('border-color', '');
		}

		var tempData = {
			formId: formId,
			parentIndex: parentIndex,
			timeRangeId: timeRangeId,
			timeStamp: timeStamp,
		};

		var addedTimeRangeTemp = _.template($('#added-time-range-temp').html());
		$(timeRangeCon).after(addedTimeRangeTemp(tempData));

		Helper.time('.time-only');

		captureFormInputVal();

		timeRangeId++;
	}

	function rangePicker(selector1, selector2, dayTimeCon, formId)
	{
		var datePicker = $(selector1).datepicker({
	            format: 'yyyy-mm-dd',
	            inputs: $(selector2)
	        }
	    )
		.on('changeDate', function(e) {

			var inputs = $(selector1).find(selector2);
			var offset = 24 * 60 * 60 * 1000;
			var from = Date.parse($(inputs.eq(0)).val() + ' 00:00:00');
			var to = Date.parse($(inputs.eq(1)).val() + ' 23:59:00');

			var rangeDateArr = [];

			while (from <= to) 
			{
				var dateFrom = new Date(from);
				var day = getDay(dateFrom.getDay());
				var date = (dateFrom.getDate() < 10) 
					? '0' + dateFrom.getDate() : dateFrom.getDate();

				rangeDateArr.push({ label: day + ", " + date,
						timeStamp: from,
						dateStr: dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + date,
						day: day,
						preview : day + " (:time_from to :time_to)"
					});

				from += offset;
			}

			var tempData = {
				formId: formId,
				rangeDateArr: rangeDateArr,
			};

			//console.log(tempData);

			Template.get('#date-range-input-temp', dayTimeCon, tempData);

			disabledDayTime();

			Helper.time('.time-only');

			captureFormInputVal();
	    });

	    return datePicker;
	}

	function disabledDayTime()
	{
		$('input[class^=duration-time-enable]').on('click', function() {
				var checkbox = $(this);
				var elemIndexs = checkbox.data('index').split('-');
				var formId = elemIndexs[0], rangeDateArrIndex = elemIndexs[1], timeStamp = elemIndexs[2];

				var fromInput = $('.duration-time-from-' + formId + '-' + rangeDateArrIndex + '-' + timeStamp);
				var toInput = $('.duration-time-to-' + formId + '-' + rangeDateArrIndex + '-' + timeStamp);
				
				fromInput.removeAttr('disabled');
				toInput.removeAttr('disabled');
				
				$('.duration-time-from-' + formId + '-' + rangeDateArrIndex).removeAttr('disabled');
				$('.duration-time-to-' + formId + '-' + rangeDateArrIndex).removeAttr('disabled');

				if (!checkbox.is(':checked'))
				{
					fromInput.attr('disabled', true);
					toInput.attr('disabled', true);
					
					$('.duration-time-from-' + formId + '-' + rangeDateArrIndex).attr('disabled', true);
					$('.duration-time-to-' + formId + '-' + rangeDateArrIndex).attr('disabled', true);
				}

			});

	}

})($);
$(DateHelper.init);

function makeDurationDate(durations, resource_type) {
	var dateDurations = "";
	var resourceType = resource_type || "";

	if (resourceType === "database") {
		
		durations = JSON.parse(durations);

		$.each(durations, function(i, duration) {
			var date = _.last(duration.date.split('-'));
			var day = duration.day;

			$.each(duration.time, function(i, time){
				dateDurations += day + ' (' +  time.start + ' to ' + time.end + ') <br/>';
			});
		});

		return dateDurations;	
	}

	$.each(durations, function(timestamp, elem) {

		var duration_time_from = elem.duration_time_from;
		var duration_time_to = elem.duration_time_to;

		for(var i in duration_time_from) {
			dateDurations += elem.day + ' (' + duration_time_from[i] + ' to ' + duration_time_to[i] + ') <br/>';
		}

	});

	return dateDurations;
}


function arrayToString(arr, replace)
{
	replace = replace || " ";
	return arr.toString().replace(',', replace);
}

function createIndustryPattern(user_industries) {
	var industries = user_industries
			.replace(/(["-,])+|([\[-\]])+/g, " ")
			.replace(/\band\b|\bof\b|\bthe\b|\bis\b|\ba\b|\bfor\b|\bat\b/g, "");

	var newArray = _.map(industries.split(" "),
			function(str) { 

				if (str !== "") 
					return '\\b' + str + '\\b';
			}
		);

	$pattern = _.filter(newArray, function(str) {
		return typeof str !== 'undefined';
	}).toString().replace(/(,)/g, "|").replace(/(\/)/g, "\\/");

	return '/' + $pattern + '/g';
}

function getApplicants(serverData, searchKeys) 
{
	var newSearchKey = searchKeys.replace(/([\[-\]-\-'-\.-/\n-/\t])+/g, " ");
	var results = {};
	var shortListedApplicant = [];
	var applicantsApplied = [];
	var jobPostId = serverData.job_post_id || null;
	var applicants = serverData.applicants;

	$.each(applicants, function(id, applicant) {

		//console.log('applicant', applicant);
		var userId = applicant.user_id;
		
		var skills = null;
		if (applicant.skills)
			skills = applicant.skills.replace(/(["])+|([\[-\]])+/g, "").split(",");

		var industryPattern = null;
		if (applicant.user_industries.length)
			industryPattern = createIndustryPattern(applicant.user_industries);

		//console.log(industryPattern, typeof applicant.user_industries);

		var isSkillMatch = false;
		var isIndutryMatch = false;

		//console.log(industryPattern);

		var applicantInfo = {
			user_id: userId,
			personal_info: applicant.personal_info,
			location: applicant.location,
			nationality: applicant.nationality,
			skills: applicant.skills,
			first_name: applicant.first_name,
			last_name: applicant.last_name,
			position: applicant.position || applicant.position_preferred || null,
			user_industries: applicant.user_industries
		};

		var checkDuplicate = null;
		$.each(skills, function(i, skill) {

				var pattern = skill.replace(/(\+{1,2})+/g, "\\+\\+").replace(/(\/)+/g, "\\/");	
				isSkillMatch = eval('/(' + pattern + ')+/ig.test("' + newSearchKey + '")');
				
				if (industryPattern) {
					isIndutryMatch = eval(industryPattern + '.test("' + newSearchKey + '")');
				}
				
				//console.log(industryPattern, " - ", isIndutryMatch, newSearchKey);
				//console.log('/(' + pattern + ')+/ig', isSkillMatch, newSearchKey);
				//console.log(isIndutryMatch);

				if (isSkillMatch || isIndutryMatch){
					
					if (checkDuplicate !== userId) {
						shortListedApplicant.push(applicantInfo);
						checkDuplicate = userId;
					}
				}
				else {

					if (!isSkillMatch || !isIndutryMatch) {
						if (checkDuplicate !== userId) {
							applicantsApplied.push(applicantInfo);
							checkDuplicate = userId;
						}
					}
				}
		});

	});

	var shorlisted = { applicants : shortListedApplicant };
	var applied = { applicants : applicantsApplied };

	$.extend(results, {jobPostId : jobPostId, shortListedApplicant, applicantsApplied } );

	return results;
}


function createSearchKeys(jobGroups, jobPostId) 
{
	
	var result = null;

	$.each(jobGroups, function(jobGroupId, jobGroup) {
		
		var jobGroupName = jobGroup.job_group_name;
		var jobDesc = jobGroup.description;

		$.each(jobGroup.jobs, function(i, job) {

			job_block:
			{
				if (jobPostId == job.job_post_id) {
					
					var searchKeys = jobGroupName + " " + jobDesc
						+ " " + job.country_location + " " + job.country_location
						+ " " + job.job_description + " " + job.currency_code
						+ " " + job.job_industries + " " + job.job_title;

					result = {
						job_post_id: job.job_post_id,
						searchKeys: searchKeys.replace(/,/g, " ")
					}

					break job_block;
				}
			}

		});

	});

	return result;
}

(function($){
	
	$.fn.buttonViewer = function(options) {
		var $this = this;

		var shortlistedBtnViews = options.shortlistedBtnViews || {};
		var appliedBtnViews = options.appliedBtnViews || {};
		var viewTemplate = options.viewTemplate || null;
		var viewTemplateCon = options.viewTemplateCon || null;
		var domToHide = options.domToHide || {};

		options = $.extend({
			dataAttr : "",
			ApiUrl : ""
		}, options || {});

		$this
			.text(' Loading...')
			.prepend('<i class="fa fa-spin fa-circle-o-notch"></i>')
			.addClass('disabled');
		
		appliedBtnViews
			.text(' Loading...')
			.prepend('<i class="fa fa-spin fa-circle-o-notch"></i>')
			.addClass('disabled');

		if ($this)
		{
			$.each($this, function(elem, i) {

				var $this = $(this);
				var jobPostId = $this.data(options.dataAttr);
				var data = createSearchKeys(options.jobGroups, jobPostId);
				var currentIndex = shortlistedBtnViews.index($this);

				var currentAppliedBtnViews = $(appliedBtnViews.eq(currentIndex));
				//console.log('currentIndex', currentIndex);

				$.ajax({
					type: 'POST',
					url: apiUrl + options.ApiUrl,
					dataType: 'json',
					data: data,
					success: function(response) {

						var serverResponse = response.data;

						if (response.success) {	console.log(serverResponse.job_details);

							var searchKeys = data.searchKeys.replace(/(['])+/g, "\\'");
							var applicants = getApplicants(serverResponse, searchKeys);

						 	var tempData = {
						 		type: "",
						 		applicants: [],
						 		job: serverResponse.job_details,
								backCallback: "$('.applicant-view-con').empty();$('.jobs-list').show();"
							};

							var numOfShortListed = applicants.shortListedApplicant.length;

							$this
								.text("View " + numOfShortListed + " Shortlisted Applicants")
								.on('click', function() {
									//console.log(serverResponse.job_details, applicants.shortListedApplicant);
									domToHide.hide();
									tempData.type = "shortlisted";
									tempData.applicants = applicants.shortListedApplicant;
									Template.get(viewTemplate, viewTemplateCon, tempData);
									console.log(tempData);
								});
							
							if (numOfShortListed) {
								$this.removeClass('disabled');
							}

							var numOfApplied = applicants.applicantsApplied.length;

							currentAppliedBtnViews
								.text("View " + numOfApplied + " Applicants")
								.on('click', function() {
									
									console.log(serverResponse.job_details, applicants.applicantsApplied);
									
									domToHide.hide();
									tempData.type = "applied";
									tempData.applicants = applicants.applicantsApplied;
									Template.get(viewTemplate, viewTemplateCon, tempData);
								});

							if (numOfApplied) {
								currentAppliedBtnViews.removeClass('disabled');
							}
								
						}

					},
					error: function(response) {
						console.log("Ajax Request Failed : ", response)
					}
				})
				.always(function(response, status){
					
				});

			});
		}

		return $this;
	};

})($);

var Helper = (function($){

	return {
		hide: hide,
		removeSpecChar: removeSpecChar,
		number: number,
		time: time,
		isFileUploaded: isFileUploaded,
	};

	function hide(elem) {
		if (typeof elem !== 'object') {
			return $(elem).hide();
		}
		return elem.hide();
	}

	function removeSpecChar(str) {
		return str.replace(/([,])+/g,", ").replace(/([\[-\]])+/g, "");
	}

	function number(selector) 
	{
		$(selector).on('keyup', function() {
			var $this = $(this);
			var regex = /^-?\d+(\.\d+)?$/;
			var name = $this.attr('name');

			$this.css('border-color', '');

			if ( !regex.test($this.val()) ) 
			{
				$this.css('border-color', 'red');
				$this.val("");
				return false;
			}

			return true;
		});
	}

	function isFileUploaded(selector)
	{
		var $this = $(selector);
		var strVal = $.trim($this.val());

		if (!$this.length || !strVal.length) {
			return false;
		}
		return true;
	}

	function time(selector) 
	{
		$(selector).on('blur', function() {
			var $this = $(this);
			var regex = /\b(\d{2})+:(\d{2})+\s?(AM|am|PM|pm)+\b/;

			$this.css('border-color', '');

			if ( !regex.test($this.val()) ) 
			{
				$this.css('border-color', 'red');
				$this.val("");
				return false;
			}

			return true;
		});
	}
})($);

function isHeadlinePhotoUploaded(backFunction)
{
    if (!Helper.isFileUploaded('input[name="file_name"]')) 
    {
        Template.get('#alert-msg-temp', '.alert-msg-temp-con', {
            title: 'Alert!',
            message: "<h5>In order to have a Job Headline Photo you must to upload it first. Click back to upload or click continue.</h5>",
            okBtn: 'Back',
            backFunction: backFunction,
            closeBtn: null,
        });

        $('.alert-msg').modal('show');
    }
}