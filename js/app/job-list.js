var JobList = (function($) {

	var templates = [];
    var baseTemplateUrl = 'template/job/job-list/';
	var publishJobListArr = null; 
	var draftJobListArr = null;

	return {
		init: init,
		preview: preview,
		closeJob: closeJob,
		doClose: doClose,
		editPost: editPost,
		fulltimePreviewBack: fulltimePreviewBack,
		publish: publish,
		doPublish: doPublish
	};

	function init() 
	{
		addEventHandlers();
		template();
	}
	
	function addEventHandlers()
	{
		$('.nav-tabs').on('shown.bs.tab', 'a[data-toggle="tab"]', shownTab);
	}

	function shownTab(e)
	{
		var currentTab = $(e.target);
		  	
	  	if (currentTab.attr('href') == '#panel-publish') {
	  		publishJobReq($('form[name=publish-search-form]'), '.publish-job-list-con');
	  	}

	  	if (currentTab.attr('href') == '#panel-draft') {
	  		draftJobListReq($('form[name=draft-search-form]'), '.draft-job-list-con');
	  	}

	  	if (currentTab.attr('href') == '#panel-rejected') {
	  		rejectJobListReq($('form[name=reject-search-form]'), '.reject-job-list-con');
	  	}
	}

	function template()
	{
		var templateData = {
			employmentTypeId: employmentTypeId,
			validityStart: validityStart,
			validityEnd: validityEnd,
		};

		getTemplate('search-form.html', function(template) {
			
			templateData.formName = 'publish-search-form';
			templateData.postStatusId = 1;
			templateData.btnId = 'btn-publish-list-search';

			$('.publish-search-form-con').html(template(templateData));

			publishJobList();
			dependencies();

		}, baseTemplateUrl);

		getTemplate('search-form.html', function(template) {

			templateData.formName = 'draft-search-form';
			templateData.postStatusId = 2;
			templateData.btnId = 'btn-draft-list-search';

			$('.draft-search-form-con').html(template(templateData));

			draftJobList();
			dependencies();

		}, baseTemplateUrl);

		getTemplate('search-form.html', function(template) {

			templateData.formName = 'reject-search-form';
			templateData.postStatusId = 3;
			templateData.btnId = 'btn-reject-list-search';

			$('.reject-search-form-con').html(template(templateData));

			rejectJobList();
			dependencies();

		}, baseTemplateUrl);
		
		if (employmentTypeId == 1) {
			$('.employment-label').text("Full Time");
			$('.btn-add-new-job').attr('href', 'fulltime-add-new-job.php');
		}
		
		if (employmentTypeId == 2){
			$('.employment-label').text("Part Time");
			$('.btn-add-new-job').attr('href', 'part-time-add-new-job.php');
		}

		if (employmentTypeId == 3){
			$('.employment-label').text("Temporary");
			$('.btn-add-new-job').attr('href', 'temporary-add-new-job.php');
		}	
	}
	
	function dependencies()
	{
		$('.datepicker').datepicker({
			format: 'yyyy-mm-dd'
		});
	}

	function publishJobReq(form, templateCon)
	{
		jobListRequest(form.serializeArray(), 
			function(response) {
				if (response.success) {
					
					console.log(response.data.groupJobs);

					JobList.publishJobListArr = response.data.groupJobs;
					
					getTemplate('job-list.html', function(template) {
						
						var renderedtemp = template({ 
							jobList : response.data.groupJobs,
							numJobs : response.numJobs,
							jobPostStatus : 1
						});

						$(templateCon).html(renderedtemp);
						getApplicants(response.data.groupJobs);
						
					}, baseTemplateUrl);

					
				}
			});
	}

	function publishJobList()
	{
		var publishSearchform = $('form[name=publish-search-form]');
		var publishJobListCon = '.publish-job-list-con';

		publishJobReq(publishSearchform, publishJobListCon);
		
		publishSearchform.on('submit', function(e) {
			e.preventDefault();
			
			Http.ajaxButton({
				url : apiUrl + 'job/list',
				type : 'POST',
				dataType : 'json',
				data: publishSearchform.serializeArray(),
				success : function(response) {
					
					if (response.success) {
						//console.log(response.data);
						
						getTemplate('job-list.html', function(template) {
							
							var renderedtemp = template({ 
								jobList : response.data.groupJobs,
								numJobs : response.numJobs,
								jobPostStatus : 1
							});

							$(publishJobListCon).html(renderedtemp);

						}, baseTemplateUrl);

						getApplicants(response.data.groupJobs);
					}
				}		
			}, $('#btn-publish-list-search'), 'Searching...');
		});
	}

	function getApplicants(groupJobs)
	{
		$('.btn-shorlisted-view')
			.buttonViewer({
				dataAttr : 'job-post-id', 
				ApiUrl : 'job/applicants/shortlisted',
				jobGroups: groupJobs,
				shortlistedBtnViews: $('.btn-shorlisted-view'),
				appliedBtnViews: $('.btn-applicants-view'),
				viewTemplate: '#view-applicants-temp',
				viewTemplateCon: '.applicant-view-con',
				domToHide: $('.jobs-list')
			});
	}

	function doClose(btnElem, jobGroupId) 
	{
		Http.ajaxButton({
			url : apiUrl + 'job/close/' + jobGroupId,
			type : 'GET',
			dataType : 'json',
			success : function(response) {
				
				if (response.success) {

					$('#job-group-' + jobGroupId).hide('slow');

					publishJobReq($('form[name=publish-search-form]'), 
						'.publish-job-list-con');
					
					//console.log(response.data.msg);	
				}
			}		
		}, $(btnElem), 'Closing job...');
	}

	function closeJob(btnElem, jobGroupId)
	{
		Template.get('#alert-msg-temp', '.alert-msg-temp-con', {
			title: 'Alert!',
			message: '<h3>Are you sure you want to close this job?</h3>',
			backFunction: "JobList.doClose('" + btnElem + "', '" + jobGroupId + "')",
			okBtn: 'Close this job',
			closeFunction: null,
			closeBtn: 'Cancel'
		});

		$('.alert-msg').modal('show');
	}

	
 	function preview(job_group_id, post_status) 
 	{	
 		var jobList = null;

 		if (post_status == 1) jobList = JobList.publishJobListArr[job_group_id];
		if (post_status == 2) jobList = JobList.draftJobListArr[job_group_id];
		if (post_status == 3) jobList = JobList.rejectJobListArr[job_group_id];
 		
 		//console.log(jobList);

 		$('.jobs-list').hide();

 		Template.get('#preview-temp', '.preview-con', jobList);
 	}

	function editPost(job_group_id, post_status) 
	{
		var jobList = null;
		if (post_status == 1) jobList = JobList.publishJobListArr;
		if (post_status == 2) jobList = JobList.draftJobListArr;
		if (post_status == 3) jobList = JobList.rejectJobListArr;

		var job = $.map(jobList, function(elem, i) {
			return job_group_id === elem.job_group_id ? elem : null;
		});
		
		job = _.first(job);

		localStorage.removeItem('jobObj');

		var url = "";
		if (employmentTypeId == 1) url = "fulltime-edit-job.php";
		if (employmentTypeId == 2) url = "part-time-edit-job.php";
		if (employmentTypeId == 3) url = "temporary-edit-job.php";

		localStorage.setItem('jobObj', JSON.stringify(job));

		window.location.href = url + '?' + 
			'job_group_id=' + job.job_group_id + '&post_type_id=' + job.post_type_id;
	}

	function fulltimePreviewBack()
	{
		$('.preview-con').empty();
		$('.jobs-list').show();
	}

	function draftJobListReq(form, templateCon)
	{
		jobListRequest(form.serializeArray(), 
			function(response) {
				
				if (response.success) {
					
					JobList.draftJobListArr = response.data.groupJobs;
					
					getTemplate('job-list.html', function(template) {
							
						var renderedtemp = template({ 
							jobList : response.data.groupJobs,
							jobListStr : JSON.stringify(response.data.groupJobs),
							numJobs : response.numJobs,
							jobPostStatus : 2,
						});

						$(templateCon).html(renderedtemp);
					}, baseTemplateUrl);

				}
			});
	}

	function draftJobList()
	{
		var draftForm = $('form[name=draft-search-form]');
		var draftTemplateCon = '.draft-job-list-con';

		draftJobListReq(draftForm, draftTemplateCon);
		
		draftForm.on('submit', function(e) {
			e.preventDefault();
			
			Http.ajaxButton({
				url : apiUrl + 'job/list',
				type : 'POST',
				dataType : 'json',
				data: draftForm.serializeArray(),
				success : function(response) {
					
					if (response.success) {
						//console.log(response.data);
						
						getTemplate('job-list.html', function(template) {
							
							var renderedtemp = template({ 
								jobList : response.data.groupJobs,
								numJobs : response.numJobs,
								jobPostStatus : 2,
							});

							$(draftTemplateCon).html(renderedtemp);

						}, baseTemplateUrl);

					}
				}		
			}, $('#btn-draft-list-search'), 'Searching...');
		});
	}

	function rejectJobListReq(form, templateCon)
	{
		jobListRequest(form.serializeArray(), 
			function(response) {
				
				if (response.success) {
					
					JobList.rejectJobListArr = response.data.groupJobs;

					getTemplate('job-list.html', function(template) {
							
						var renderedtemp = template({ 
							jobList : response.data.groupJobs,
							jobListStr : JSON.stringify(response.data.groupJobs),
							numJobs : response.numJobs,
							jobPostStatus : 3,
						});

						$(templateCon).html(renderedtemp);
					}, baseTemplateUrl);

				}
			});
	}

	function rejectJobList()
	{
		var form = $('form[name=reject-search-form]');
		var templateCon = '.reject-job-list-con';
		
		rejectJobListReq(form, templateCon);
		
		form.on('submit', function(e) {
			e.preventDefault();
			
			Http.ajaxButton({
				url : apiUrl + 'job/list',
				type : 'POST',
				dataType : 'json',
				data: form.serializeArray(),
				success : function(response) {
					
					if (response.success) {
						//console.log(response.data);
						getTemplate('job-list.html', function(template) {
							
							var renderedtemp = template({ 
								jobList : response.data.groupJobs,
								numJobs : response.numJobs,
								jobPostStatus : 3,
							});

							$(templateCon).html(renderedtemp);
						}, baseTemplateUrl);

					}
				}		
			}, $('#btn-reject-list-search'), 'Searching...');
		});
	}

	function jobListRequest(formData, callback)
	{
		$('.job-list')
			.html('<center><i class="fa fa-spin fa-5x fa-circle-o-notch" ></i></center>');

		$.ajax(apiUrl + 'job/list', {
			type: 'POST',
			dataType: 'json',
			data: formData,
			beforeSend: function () {
				JobList.publishJobListArr = null;
				JobList.draftJobListArr = null;
				JobList.rejectJobListArr = null;
			},
			success: callback,
			error: function(response) {
				console.log("Request Failed!", response);
			}
		});
	}
	
	function doPublish(btnElem, job_group_id) {
		
		var draftForm = $('form[name=draft-search-form]');
		var daraftTemplateCon = '.draft-job-list-con';

		var jobs = JobList.draftJobListArr[job_group_id].jobs;
		//var jobPostIds = { name: 'job_post_ids', value: [] };
		var postData = [] ;

		_.each(jobs, function(job, index, list) {
			var job_post_id = job.job_post_id;
			postData.push({ name: 'job_post_ids[]', value: job_post_id });
		});

		postData.push({ name: 'job_group_id', value: job_group_id });
		//postData.push(jobPostIds);

		Http.ajaxButton({
			url: apiUrl + 'job/publish',
			method: 'POST',
			dataType: 'json',
			data: postData,
			success: function(response) {

				if (response.success) {
					draftJobListReq(draftForm, daraftTemplateCon);
					$('#job-group-' + job_group_id).fadeOut('slow');
				}
			}
		}, $(btnElem), 'Publishing...');

		//console.log(postData);
	}

	function publish(btnElem, jobGroupId) 
	{
		Template.get('#alert-msg-temp', '.alert-msg-temp-con', {
			title: 'Alert!',
			message: '<h3>Are you sure you want to publish this job?</h3>',
			backFunction: "JobList.doPublish('" + btnElem + "', '" + jobGroupId + "')",
			okBtn: 'Publish this job',
			closeFunction: null,
			closeBtn: 'Cancel'
		});

		$('.alert-msg').modal('show');
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
$(JobList.init);