
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
			selectName : "location";

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
			selectName : "industry";

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

		//console.log(selectPicker.isEdit);

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

    			$(inputTextCon)
    				.append('<input type="hidden" name="jobs[job-' + formId + '][currency_id]" class="currency-id-' + formId + '" value="'+ opt.attr('value') +'"/>');

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
	    			$('.input-text-' + selectType + '-' +  formId + '-' + index).remove();
	    			$('.input-text-json-' + selectType + '-' +  formId + '-' + index).remove();
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
    	var newFormId = i;
        var addedForm = $(this);
        var id = _.last(addedForm.attr("id").split("-"));
        
        addedForm
        	.attr("id", "added-job-form-" + i)
        	.removeClass("added-job-form-" + id)
        	.addClass("added-job-form-" + i);

        addedForm
        	.find('textarea.job-desc-' + id)
        	.removeClass('job-desc-' + id)
        	.addClass('job-desc-' + newFormId)
        	.attr('name', 'jobs[job-' + newFormId + '][job_desc]');

        addedForm
        	.find('input.job-title-' + id)
        	.removeClass('job-title-' + id)
        	.addClass('job-title-' + newFormId)
        	.attr('name', 'jobs[job-' + newFormId + '][job_title]');

        addedForm
        	.find('input.salary-' + id)
        	.removeClass('salary-' + id)
        	.addClass('salary-' + newFormId)
        	.attr('name', 'jobs[job-' + newFormId + '][salary]');

        addedForm
        	.find('input.yr-exp-' + id)
        	.removeClass('yr-exp-' + id)
        	.addClass('yr-exp-' + newFormId)
        	.attr('name', 'jobs[job-' + newFormId + '][yr_exp]');

        addedForm.find('.duration-from-' + id)
			.removeClass('duration-from-' + id)
        	.addClass('duration-from-' + newFormId)
        	.attr('name', 'jobs[job-' + newFormId + '][duration_from]');

        addedForm.find('.duration-to-' + id)
			.removeClass('duration-to-' + id)
        	.addClass('duration-to-' + newFormId)
        	.attr('name', 'jobs[job-' + newFormId + '][duration_to]');

        addedForm.find('.publish-' + id)
        	.removeClass('publish-' + id)
        	.addClass('publish-' + newFormId)
        	.attr('name', 'jobs[job-' + newFormId + '][post_status_id]');

        addedForm.find('.draft-' + id)
        	.removeClass('draft-' + id)		
        	.addClass('draft-' + newFormId)
        	.attr('name', 'jobs[job-' + newFormId + '][post_status_id]');

        if (addedForm.find('.date-range-' + id)) {

        	addedForm.find('.date-range-' + id)
        		.removeClass('date-range-' + id)
        		.addClass('date-range-' + newFormId);

        	addedForm.find('.day-time-con-' + id)
        		.removeClass('day-time-con-' + id)
        		.addClass('day-time-con-' + newFormId);

        	addedForm.find('.date-time-from-' + id)
        		.removeClass('date-time-from-' + id + ' date-range-input-' + id)
        		.addClass('date-time-from-' + newFormId + ' date-range-input-' + newFormId)
        		.attr('name', 'jobs[job-' + newFormId + '][duration_from]');

        	addedForm.find('.date-time-to-' + id)
        		.removeClass('date-time-to-' + id + ' date-range-input-' + id)
        		.addClass('date-time-to-' + newFormId + ' date-range-input-' + newFormId)
        		.attr('name', 'jobs[job-' + newFormId + '][duration_to]');

     		addedForm.find('input[class^=time-input-enable-' + id + ']').each(function() {
     			var $this = $(this);
     			var dataIndex = $this.data('index').split('-');
     			var timestamp = dataIndex[0];
     			var addedTimeId = dataIndex[1];

     			$this
     				.removeClass('time-input-enable-' + id + '-' + timestamp + '-' + addedTimeId)
     				.addClass('time-input-enable-' + newFormId + '-' + timestamp + '-' + addedTimeId)
     				.attr({
     					'name' : 'jobs[job-' + newFormId + '][durations][' + timestamp + '][duration_time_enable]',
     					'onclick' : 
     						'DateHelper.disabledDayTime(this, ' + newFormId + ', ' + timestamp + ')'
     				});
     		});

     		addedForm.find('a[class^=btn-add-newsched-' + id + ']').each(function(index) {
     			var $this = $(this);
     			var dataInfo = $this.data('addNewschedInfo').split('|');
     			var timestamp = dataInfo[0], label = dataInfo[1], dateStr = dataInfo[2], 
     				day = dataInfo[3], addedTimeId = dataInfo[4];

     			$this
     				.removeClass('btn-add-newsched-' + id + '-' + timestamp + '-' + addedTimeId)
     				.addClass('btn-add-newsched-' + newFormId + '-' + timestamp + '-' + addedTimeId);

     			$this.attr('onclick',
     					"DateHelper.addTimeRange(" + newFormId + ","
     					+ timestamp + ","
                        + "'.time-input-" + newFormId + "-" + timestamp + "',"
                        + "'" + label + "',"
                        + "'" + dateStr + "',"
                        + "'" + day + "');");

                addedForm.find('.time-input-' + id + '-' + timestamp).each(
                	function() {

	                	var $this = $(this);
	                	var dataInfo = $this.data('info').split('|');
	                	var timestamp = dataInfo[1];
	                	var addedTimeId = dataInfo[2];

	                	$this.removeClass('time-input-' + id + '-' + timestamp + ' time-input-con-' + id + '-' + timestamp + '-' + addedTimeId);
	                	$this.addClass('time-input-' + newFormId + '-' + timestamp + ' time-input-con-' + newFormId + '-' + timestamp + '-' + addedTimeId)
	                	$this.attr('data-info', newFormId + '|' + timestamp + '|' + addedTimeId);

	                	addedForm.find('.hidden-datestr-' + id + '-' + timestamp + '-' + addedTimeId)
	                		.removeClass('hidden-datestr-' + id + '-' + timestamp + '-' + addedTimeId)
	                		.addClass('hidden-datestr-' + newFormId + '-' + timestamp + '-' + addedTimeId)
	                		.attr('name', 'jobs[job-' + newFormId + '][durations][' + timestamp + '][date]');

	                	addedForm.find('.hidden-timestamp-' + id + '-' + timestamp + '-' + addedTimeId)
	                		.removeClass('hidden-timestamp-' + id + '-' + timestamp + '-' + addedTimeId)
	                		.addClass('hidden-timestamp-' + newFormId + '-' + timestamp + '-' + addedTimeId)
	                		.attr('name', 'jobs[job-' + newFormId + '][durations][' + timestamp + '][day]');

	                	addedForm.find('.time-input-from-' + id + '-' + timestamp + '-' + addedTimeId)
	                		.removeClass('time-input-from-' + id + '-' + timestamp + ' time-input-from-' + id + '-' + timestamp + '-' + addedTimeId)
	                		.addClass('time-input-from-' + newFormId + '-' + timestamp + ' time-input-from-' + newFormId + '-' + timestamp + '-' + addedTimeId)
	                		.attr('name', 'jobs[job-' + newFormId + '][durations][' + timestamp + '][duration_time_from][]');

	                	addedForm.find('.time-input-to-' + id + '-' + timestamp + '-' + addedTimeId)
	                		.removeClass('time-input-to-' + id + '-' + timestamp + ' time-input-to-' + id + '-' + timestamp + '-' + addedTimeId)
	                		.addClass('time-input-to-' + newFormId + '-' + timestamp + ' time-input-to-' + newFormId + '-' + timestamp + '-' + addedTimeId)
	                		.attr('name', 'jobs[job-' + newFormId + '][durations][' + timestamp + '][duration_time_to][]');
	                });

     		});

        }

        $('.location-' + id).removeClass('location-' + id).addClass('location-' + i);
        
        $.each(addedForm.find('input[class^=input-location-' + id + ']'), 
        	function(i, elem) {

	        	var textLocationElem = $(this);
	        	var optIndex = _.last(textLocationElem.attr('class').split('-'));
	        	
	        	console.log(id + ' change to ', newFormId, optIndex);

	        	addedForm
	        		.find('input.input-location-' + id + '-' + optIndex)
	        		.removeClass('input-location-' + id + '-' + optIndex)
	        		.addClass('input-location-' + newFormId + '-' + optIndex)
	        		.attr('name', 'jobs[job-' + newFormId + '][location][]');

	        	addedForm
	        		.find('input.input-text-location-' + id + '-' + optIndex)
	        		.removeClass('input-text-location-' + id + '-' + optIndex)
	        		.addClass('input-text-location-' + newFormId + '-' + optIndex)
	        		.attr('name', 'jobs[job-' + newFormId + '][location_text][]');

	        	addedForm
	        		.find('input.input-text-json-location-' + id + '-' + optIndex)
	        		.removeClass('input-text-json-location-' + id + '-' + optIndex)
	        		.addClass('input-text-json-location-' + newFormId + '-' + optIndex)
	        		.attr('name', 'jobs[job-' + newFormId + '][location_text_json][]');

	        });

		$('.industry-' + id).removeClass('industry-' + id).addClass('industry-' + i);

        $.each(addedForm.find('input[class^=input-industry-' + id + ']'), 
        	function(i, elem) {
        		
	        	var textIndustryElem = $(this);
	        	var optIndex = _.last(textIndustryElem.attr('class').split('-'));
	        	
	        	console.log(id + ' change to ', newFormId, optIndex);

	        	addedForm
	        		.find('input.input-industry-' + id + '-' + optIndex)
	        		.removeClass('input-industry-' + id + '-' + optIndex)
	        		.addClass('input-industry-' + newFormId + '-' + optIndex)
	        		.attr('name', 'jobs[job-' + newFormId + '][industry][]');

	        	addedForm.find('input.input-text-industry-' + id + '-' + optIndex)
	        		.removeClass('input-text-industry-' + id + '-' + optIndex)
	        		.addClass('input-text-industry-' + newFormId + '-' + optIndex)
	        		.attr('name', 'jobs[job-' + newFormId + '][industry_text][]');

	        	addedForm.find('input.input-text-json-industry-' + id + '-' + optIndex)
	        		.removeClass('input-text-json-industry-' + id + '-' + optIndex)
	        		.addClass('input-text-json-industry-' + newFormId + '-' + optIndex)
	        		.attr('name', 'jobs[job-' + newFormId + '][industry_text_json][]');
	        });
        
        $('.currency-' + id).removeClass('currency-' + id).addClass('currency-' + i);
        
        addedForm.find('.currency-id-' + id)
			.removeClass('currency-id-' + id)
			.addClass('currency-id-' + newFormId)
			.attr('name', 'jobs[job-' + newFormId + '][currency_id]');
		
		var currencyInputText = addedForm.find('.currency-input-text-' + id);
		var currencyInputTextIndex = currencyInputText.attr('class').split(" ")[0].substr(-1);
		currencyInputText
			.removeClass('currency-input-text-' + id + ' input-text-currency-' + id + '-' + currencyInputTextIndex)
			.addClass('currency-input-text-' + newFormId + ' input-text-currency-' + newFormId + '-' + currencyInputTextIndex)
			.attr('name', 'jobs[job-' + newFormId + '][currency_text]');

		var currencyInputTextJSON = addedForm.find('.currency-input-text-json-' + id);
		currencyInputTextJSON
			.removeClass('currency-input-text-json-' + id + ' input-text-json-currency-' + id + '-' + currencyInputTextIndex)
			.addClass('currency-input-text-json-' + newFormId + ' input-text-json-currency-' + newFormId + '-' + currencyInputTextIndex)
			.attr('name', 'jobs[job-' + newFormId + '][currency_text_json]');

        $('.date-range-' + id).removeClass('date-range-' + id).addClass('date-range-' + i);
        $('.date-range-input-' + id).removeClass('date-range-input-' + id).addClass('date-range-input-' + i);

        console.log('edit reset id => ', id + ' = ' + i);
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
    var lastAddedForm = $('.added-job-form').last();
    var classStr = lastAddedForm.attr('class');
    var lastAddedFormNum = parseInt(classStr.substring(classStr.indexOf('added-job-form-')+15)) + 1;

    console.log(lastAddedFormNum);
   
   	return lastAddedFormNum; 
}

function removeSpecChar(str) {
    return str.replace(/[\t-\n-\r\-\s]+/g, "");
}

var DateHelper = (function($) {
	
	var addedTimeId = 1;

	return {
		init: init,
		getDay: getDay,
		rangePicker: rangePicker,
		addTimeRange: addTimeRange,
		removeTimeRange: removeTimeRange,
		disabledDayTime: disabledDayTime,
		getDateStr: getDateStr,
		getMonth: getMonth
	};

	function init() {}

	function getDay(day, short) 
	{			
		var dnames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
 				'Thursday', 'Friday', 'Saturday', 'Sunday'];
 		if (short) {
 			dnames = ['Sun', 'Mon', 'Tue', 'Wed',
 				'Thur', 'Fri', 'Sat', 'Sun'];
 		}
 		return dnames[day];
	}


	function getMonth(month) {
		var mnames = ['Jan', 'Feb', 'Mar', 'Apr',
 				'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 		return mnames[month];
	}

	function removeTimeRange()
	{
		console.log('run for edit');
		$('.btn-time-remove').on('click', function() {
			var $this = $(this);
			var formId = $this.data('options').formId;
			var timeStamp = $this.data('options').timeStamp;
			var appendId = $this.data('options').appendId;

			//console.log($('.time-input-' + formId + '-' + timeStamp).length, $('.time-input-con-' + appendId).length);

			if ($('.time-input-' + formId + '-' + timeStamp).length >  1)
				$('.time-input-con-' + appendId).remove();
		});
	}

	function addTimeRange() {
		console.log('run for edit');
		$('.btn-add-newsched').on('click', function() {
			
			var $this = $(this);

			var formId = $this.data('options').formId;
			var timeStamp = $this.data('options').timeStamp;
			var date = $this.data('options').label;
			var dateStr = $this.data('options').dateStr;
			var day = $this.data('options').day;
			var timeInputConClass = '.time-input-' + formId + '-' + timeStamp;
			var lastFrom = $('.time-input-from-' + formId + '-' + timeStamp).last();
			var lastTo = $('.time-input-to-' + formId + '-' + timeStamp).last();
			
			lastFrom.css('border-color', '');
			lastTo.css('border-color', '');

			if (!lastFrom.val().length || !lastTo.val().length) {
				lastFrom.css('border-color', 'red');
				lastTo.css('border-color', 'red');
				return false;
			}

			var timeInputConClass = $(timeInputConClass).last();
			var addedDateRangeTemp = _.template($('#added-date-range-temp').html());
			
			addedDateRangeTemp = addedDateRangeTemp({
					formId: formId,
					timeStamp: timeStamp,
					addedTimeId: addedTimeId,
					date: date,
					dateStr: dateStr,
					day: day
				});

			timeInputConClass.after(addedDateRangeTemp);

			Helper.time('.time-only');
			removeTimeRange();
			captureFormInputVal();

			addedTimeId++;
		});
	}

	function rangePicker(selector1, selector2, dayTimeCon, 
		formId) 
	{
		var datePicker = $(selector1).datepicker({
	            format: 'yyyy-mm-dd',
	            inputs: $(selector2)
	        }
	    )
		.on('changeDate', function(e) {
			
			var inputs = $(selector1).find(selector2);
			
			var fromElem = $(inputs.eq(0)); 
			var toElem = $(inputs.eq(1));

			var offset = 24 * 60 * 60 * 1000;
			var from = Date.parse(fromElem.val() + ' 00:00:00');
			var to = Date.parse(toElem.val() + ' 23:59:00');

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
						day: day
					});

				from += offset;
			}

			fromElem.attr('value', fromElem.val());
			toElem.attr('value', toElem.val());

			var tempData = {
				formId: formId,
				addedTimeId: 0,
				rangeDateArr: rangeDateArr,
			};
			Template.get('#date-range-input-temp', dayTimeCon, tempData);

			disabledDayTime();
			addTimeRange();
			removeTimeRange();
			Helper.time('.time-only');
			captureFormInputVal();
	    });

	    return datePicker;
	}

	function disabledDayTime()
	{
		$('.time-input-enable').on('click', function() {
			var $this = $(this);
			var formId = $this.data('options').formId;
			var timestamp = $this.data('options').timeStamp;
			var inputs = $('.time-input-' + formId + '-' + timestamp).find(':input');

			inputs.removeAttr('disabled');
			
			if (!$this.is(':checked'))
			{
				inputs.attr('disabled', true);
			}
		});
	}

	function getDateStr(date, type) {
		
		var newDate = new Date(date);

		var day = getDay(newDate.getDay(), true);
		var date = (newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate();
		var year = newDate.getFullYear();
		var month = newDate.getMonth();

		if (type == "day") return day;
		if (type == "sm-d-y") return DateHelper.getMonth(month) + ", " + date + ", " + year;
		return day + " "+ date + ", " + year;
	}

})($);
$(DateHelper.init);




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

				$.ajax({
					type: 'POST',
					url: apiUrl + options.ApiUrl,
					dataType: 'json',
					data: data,
					success: function(response) {

						var serverResponse = response.data;

						if (response.success) {	//console.log(serverResponse.job_details);

							var searchKeys = data.searchKeys.replace(/(['])+/g, "\\'");
							var applicants = getApplicants(serverResponse, searchKeys);

						 	var tempData = {
						 		type: "",
						 		applicants: [],
						 		job: serverResponse.job_details
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
									back();
								});
							
							if (numOfShortListed) {
								$this.removeClass('disabled');
							}

							var numOfApplied = applicants.applicantsApplied.length;

							currentAppliedBtnViews
								.text("View " + numOfApplied + " Applicants")
								.on('click', function() {
									//console.log(serverResponse.job_details, applicants.applicantsApplied);
									domToHide.hide();
									tempData.type = "applied";
									tempData.applicants = applicants.applicantsApplied;
									Template.get(viewTemplate, viewTemplateCon, tempData);
									back();
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

		function back()
		{
			$('.applicant-view-back').on('click', function() {
				$('.applicant-view-con').empty();
				$('.jobs-list').show();
			});
		}

		return $this;
	};

})($);

var Helper = (function($){

	var templates = [];

	return {
		hide: hide,
		removeSpecChar: removeSpecChar,
		number: number,
		time: time,
		isFileUploaded: isFileUploaded,
		setPostTypeStatus: setPostTypeStatus,
		makeDurationDate: makeDurationDate,
		doUploadProcess: doUploadProcess,
		validateSaveAddMore: validateSaveAddMore,
		formValidationMsg: formValidationMsg,
		btnLoader: btnLoader,
		getTemplate: getTemplate
	};

	// Get Template
    function getTemplate(templateName, callback, source) {

        var defer = $.Deferred();

        defer.notify("processing...");
        if (!templates[templateName]) {
            $.get(source + templateName, function(resp) {
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

	function formValidationMsg(errorMsgs, baseTemplateUrl, isCrollUp) 
	{
		errorMsgs = errorMsgs || null;
		isCrollUp = (!isCrollUp) ? isCrollUp : true;
		//console.log(isCrollUp);
		getTemplate('error-msg.html', function(template) {
			$('.error-msg-con').empty();
			if (errorMsgs) {
	            var renderedTemp = template({ errorMsgs : errorMsgs });
	            $('.error-msg-con').html(renderedTemp);
	            if (isCrollUp)
	            	$('body,html').stop(true).animate({ 'scrollTop': 0 });
        	}
        }, baseTemplateUrl);
	}

	function validateSaveAddMore(formData, callback)
	{
		$.ajax({
                type: 'POST',
                url: apiUrl + 'to-json-encode',
                cache: false,
                data: formData,
                dataType: 'json',
                success: function(response) {
                	if (response.errorMsg) {
                		callback(false, response.errorMsg);
                	} else {
                		callback(true, null);
                	}
                },
                error: function(response) {
                    console.log("Failed: ", response);
                }
            });
	}

	function btnLoader(btn, label, eventType)
	{
		btn = $.trim(btn).length ? btn : null;
	
		if (btn) {
			
			if(eventType === "start") {
				$(btn)
					.text(label || "Processing...")
					.prepend('<i class="fa fa-spin fa-circle-o-notch"></i> ')
					.addClass('disabled');
			};

			if(eventType === "complete") {
				$(btn)
					.text(label)
					.removeClass('disabled');
			}
		}
	}

	function doUploadProcess(fileUploader) 
    {
    	var dfd = $.Deferred();
        var filename = null;

		var response = {
			data: "processing"
		}

		dfd.notify(response);
		
        if (fileUploader) 
        {
            fileUploader
            	.submit()
                .success(function (result) { 
                    
                    var file = _.first(result.files);
                    
                    if (file) {
                        response.data = file;
                        dfd.resolve(response);
                    }
                })
                .error(function (jqXHR, textStatus, errorThrown) {
                	response.data = textStatus;
                	dfd.reject(response);
                });
        }

        return dfd;
    }

	function setPostTypeStatus(postTypeID)
	{
		if (postTypeID == 1) {
			$('#btn-single-job').removeClass('active');
			$('#posttype-single-post').prop('checked', false);

			$('#btn-group-job').addClass('active');
			$('#posttype-group-post').prop('checked', true);
		}

		if (postTypeID == 2) {
			$('#btn-group-job').removeClass('active');
			$('#posttype-group-post').prop('checked', false);

			$('#btn-single-job').addClass('active');
			$('#posttype-single-post').prop('checked', true);
		}
	}

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
			var regex = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/i;
			
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

	function makeDurationDate(durations) 
	{
		var dateDurations = "";
		
		//console.log(durations);
		durations = (typeof durations === "object") ? durations : JSON.parse(durations);
		//console.log(durations);

		$.each(durations, function(timestamp, elem) {

			var duration_time_from = elem.duration_time_from;
			var duration_time_to = elem.duration_time_to;

			for(var i in duration_time_from) {
				dateDurations += elem.day + ' (' + duration_time_from[i] + ' to ' + duration_time_to[i] + ') <br/>';
			}

		});

		return dateDurations;
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
            closeFunction: null,
            closeBtn: null,
        });

        $('.alert-msg').modal('show');
    }
}

function saveAddMoreAlertMsg()
{
    Helper.getTemplate('modal-temp.html', function(template) {

		var renderedtemp = template({
			title: 'Alert!',
	        message: "<h5>Please fill up required fields before adding more job position.</h5>",
	        okBtn: "Check Required Fields",
	        closeBtn: "Close",
		});

		$('.alert-msg-temp-con').html(renderedtemp);
		
		$('.alert-msg').modal('show');

		$('.btn-modal-back').on('click', function() {
			gotoTop();
		});

	}, 'template/job/');
}

function gotoTop()
{
	$('body,html').stop(true).animate({ 'scrollTop': 0 });	
}