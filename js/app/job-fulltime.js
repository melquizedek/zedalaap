var JobFulltime = (function($) {

    var templates = [];
    var baseTemplateUrl = 'template/job/full-time/';
    var postingUrl = 'job/posting';
    var formID = 1;
    var formData = null;
    var fileUploader = null;
    var ajaxLoader = '<center><i class="fa fa-spin fa-5x fa-circle-o-notch"></i></center>';

    return {
        init: init,
        formData : formData,
        posting: posting,
        removeSaveAddMore : removeSaveAddMore,
        fulltimePreviewBack : fulltimePreviewBack,
        fulltimePreview : fulltimePreview,
        singleFileUploader : singleFileUploader
    };

    function init() 
    {
        addEventHandlers();
        loadTemplate();
    }

    function addEventHandlers()
    {
        $('.panel-heading').on('click', '#btn-single-job', singleJobPost);
        $('.panel-heading').on('click', '#btn-group-job', groupJobPost);
        $('.btn-job-group-post').on('click', '.btn-save-more-addmore', saveAddMore);
        $('.add-new-job-con').on('submit', 'form[name=add-new-job-form]', preview);
    }

    function singleJobPost()
    {
        $('#posttype-group-post').prop('checked', false);
        $('#posttype-single-post').prop('checked', true);
        $('#job-group-post, .error-msg-con').empty();
        singlePostTemp();
    }

    function groupJobPost()
    {
        $('#posttype-single-post').prop('checked', false);
        $('#posttype-group-post').prop('checked', true);
        $('#job-single-post, .error-msg-con').empty();
        loadTemplate();
        $('.btn-job-single-post').addClass('hidden');
        $('.btn-job-group-post').removeClass('hidden');
    }

    function preview(e)
    {
        e.preventDefault();

        var dataArr = $(this).serializeArray();

        var successCallback =  function(response) {
            
            Helper.btnLoader('.btn-preview', 'Preview', 'complete');

            cleanUnNeededDom();

            var responseData = JSON.parse(response);

            if (responseData.errorMsg) {
                
                getTemplate('error-msg.html', function(template) {
                    var renderedTemp = template({ errorMsgs : responseData.errorMsg });
                    $('.error-msg-con').html(renderedTemp);
                    $('body,html').stop(true).animate({ 'scrollTop': 0 });
                }, baseTemplateUrl);
                
            } else {
                
                $('.error-msg-con').empty();
                
                //check if their is an image to upload - then do upload
                $.when(Helper.doUploadProcess(JobFulltime.fileUploader))
                    .done(function (response) {
                        console.log(response, 'done');
                        if (response.data) {
                            responseData.file_name = response.data.name;
                            fulltimePreview(responseData);
                        }
                    })
                    .fail(function (response) {
                        console.log(response, 'fail');
                    })
                    .progress(function (response) {
                        console.log(response, 'progress');
                        fulltimePreview(responseData);
                    });

                setformData(responseData);
            }
        }

        Helper.btnLoader('.btn-preview', '', 'start');

        $.ajax({
            type: 'POST',
            url: apiUrl + 'to-json-encode',
            data: dataArr,
            success: successCallback,
            error: function(response) {
                console.log("Failed: ", response);
            }
        });
    }

    function singlePostTemp()
    {
        $('.btn-job-group-post').addClass('hidden');
        $('.btn-job-single-post').removeClass('hidden');

        $('#job-single-post').html(ajaxLoader);

        getTemplate('single-post.html', function(template) {
            
            $('#job-single-post').html(template);

            templateDependencies();
            Helper.number('.number-only');
            captureFormInputVal();

        }, baseTemplateUrl);
    }

    function templateDependencies() 
    {
        $('.datepicker').datepicker({
            format: 'yyyy-mm-dd'
        });

        //create select pickers for locations, industries and currencies
        selectPicker.inputTextContainer = '#job-single-post';
        selectPicker.locations('.location-0', "jobs[job-0][location][]", "", 0, 'location_text');
        selectPicker.industries('.industry-0', "jobs[job-0][industry][]", "", 0, 'industry_text');
        selectPicker.currencies('.currency-0', "jobs[job-0][currency_id]", "", 0, 'currency_text');

        //create fileuploader
        singleFileUploader()
            .on('fileuploadadd', 
                function(e, data) {
                    JobFulltime.fileUploader = data;
                });
    }

    function singleFileUploader()
    {
        FileUploader.template('.single-job-fileupload-con', 
            { fileId : 'single-job-file-id' });

        return FileUploader.uploader('#single-job-file-id', 'single-job-canvas');
    }

    /*Single Post Logic - END - HERE
    ====================================*/
    
    function initGroupFileUploader()
    {
        groupJobFileuploader().on('fileuploadadd', 
            function(e, data) {
                JobFulltime.fileUploader = data;
        });
    }

    function loadTemplate()
    {
        selectPicker.inputTextContainer = "";
        
        //if jobGroupId exist then do update process
        if (typeof jobGroupID !== 'undefined') 
        {
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
                        if (postTypeID == 1) postCon = $('#job-group-post');
                        if (postTypeID == 2) postCon = $('#job-single-post');
                        postCon.html('<center><i class="fa fa-spin fa-5x fa-circle-o-notch" ></i></center>');
                    },
                    success: function(response) {
                        
                        if (postTypeID == 1) 
                        {
                            $('#job-group-post').html(response.html);
                            initGroupFileUploader();
                        }

                        if (postTypeID == 2) 
                        {
                            $('#job-single-post').html(response.html);

                            $('#posttype-single-post').attr('checked', true);
                            $('#posttype-group-post').removeAttr('checked');

                            $('.btn-job-group-post').addClass('hidden');
                            $('.btn-job-single-post').removeClass('hidden');

                            singleFileUploader()
                                .on('fileuploadadd', function(e, data) {
                                        JobFulltime.fileUploader = data;
                                });

                            selectPicker.inputTextContainer = '#job-single-post';
                        }

                        if (jobObj.cover_photo) 
                        {
                            setTimeout(function () {
                                $('.file-to-upload')
                                    .append('<img src="api/v1/public/files/' + jobObj.cover_photo + '" width="500" height="300"/>')
                                    .append('<input type="hidden" name="file_name" value="' + jobObj.cover_photo + '"/>');
                            }, 1000);
                        }

                        $('form[name=add-new-job-form]').append($('<input type="hidden" name="job_group_id"/>').val(jobGroupID));

                        resetAddedFormId();
                        
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

                        formID = getAddedFormNum();

                        $('.datepicker').datepicker({
                                format: 'yyyy-mm-dd'
                            }
                        );

                        Helper.number('.number-only');

                        captureFormInputVal();
                    },
                    error: function(response) {
                        console.log(response);
                    }
                });
        } 
        else {
            groupPostTemp();            
        }
    }


    function groupPostTemp()
    {
        $('#job-group-post').html(ajaxLoader);
        getTemplate('group-post.html', function(template) {

            $('#job-group-post').html(template);

            formID = getAddedFormNum();
            selectPickers();
            initGroupFileUploader();

            $('.datepicker').datepicker({
                    format: 'yyyy-mm-dd'
                }
            );

            Helper.number('.number-only');
            captureFormInputVal();            
        }, baseTemplateUrl);
    }

    function setformData(data, type) {

        JobFulltime.formData = data;
    }

    function posting(elemSelector) 
    {
        
        var jobsArr = _.first($.makeArray(JobFulltime.formData.jobs));
        
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

        //put here additional post data for industries, locations and currencies
        JobFulltime.formData.for_editing = JSON.stringify(forEditing);

        //for updating job
        if (typeof jobGroupID !== 'undefined') { 
            postingUrl = 'job/update';
        }

        JobFulltime.formData.employment_type_text = 'Fulltime';

        Helper.btnLoader('.btn-post', 'Posting...', 'start');

        $.ajax({
            type: 'POST',
            url: apiUrl + postingUrl,
            data : JobFulltime.formData,
            success : function(response) {
                Helper.btnLoader('.btn-post', 'Post', 'complete');
                if (response.success) {
                    window.location.href = "short-listed.php";
                }
            }
        });

    }

    function getDOMContent() 
    {
        var job_group_post = $('#job-group-post');
        var job_single_post = $('#job-single-post');

        if (job_group_post.children().length) 
            return job_group_post.html();

        if (job_single_post.children().length) 
            return job_single_post.html();
    }

    function fulltimePreview(response) {

        var fullTimePreviewData = {
                file_name : response.file_name || null,
                headline : response.headline || null,
                headlineDesc : response.headline_desc || null,
                validUntil : response.hiring_duration_to,
                jobs : response.jobs,
                preeviewBack  : 'JobFulltime.fulltimePreviewBack()',
                posting : 'JobFulltime.posting(this)'
            };
        
        getTemplate('preview.html', function(template) {
            
            var tempRender = template(fullTimePreviewData);
            $('.fulltime-preview-con').html(tempRender);

            $('.add-new-job-con').addClass('hidden');
            $('.fulltime-preview-con').removeClass('hidden');

        }, baseTemplateUrl);
    }

    function fulltimePreviewBack() {

        $('.fulltime-preview-con').addClass('hidden');
        $('.add-new-job-con').removeClass('hidden');
    }

    function selectPickers() {

        if (localStorage.getItem('countries') 
                && localStorage.getItem('industries')
                && localStorage.getItem('currencies')) {

            //create location, industries, currency selectpicker
            selectPicker.locations('.location-0', "", "", 0, 'location_text');
            selectPicker.industries('.industry-0', "", "", 0, 'industry_text');
            selectPicker.currencies('.currency-0', "", "", 0, 'currency_text');

        } else {

            //create country selectpicker
            Resources.getCountry(function(response) {

                if (response.data) {

                    localStorage.setItem('countries',
                        JSON.stringify(response.data));

                    selectPicker.locations('.location-0', "", "", 0, 'location_text');                
                }

            });

            //create industries selectpicker
            Resources.getIndustry(function(response) {

                if (response.data) {

                    localStorage.setItem('industries', 
                        JSON.stringify(response.data));

                    selectPicker.industries('.industry-0', "", "", 0, 'industry_text');
                }
            });

            //create currency selectpicker
            Resources.getCurrency(function(response) {
                
                if (response.data) {

                    localStorage.setItem('currencies', 
                        JSON.stringify(response.data));

                    selectPicker.currencies('.currency-0', "", "", 0, 'currency_text');
                }

            });

        }
    }

    function removeSaveAddMore(elem) 
    {
        if ($('.added-job-form').length > 1) 
            $(elem).parent().parent().remove();
    }

    function saveAddMore () 
    {
        //button disabled start with loader
        Helper.btnLoader('.btn-save-more-addmore', '', 'start');

        //check if current job form has filled up of data, if not alert message pop up.
        Helper.validateSaveAddMore($('form[name=add-new-job-form]').serializeArray(), 
            function(isValidData, errorMsg) {

                //button disabled complete with loader
                Helper.btnLoader('.btn-save-more-addmore', 'Save & Add more', 'complete');

                if (!isValidData) {
                    //modal alert message
                    Helper.formValidationMsg(errorMsg, 
                            baseTemplateUrl, false);
                        saveAddMoreAlertMsg();
                    return false;
                }

                getTemplate('add-new-job.html', function(template) {

                    $('.added-job-form-con').append(template({ formID : formID }));

                    //create select pickers for industries, locations and currencies
                    selectPicker.locations('.location-' + formID, 
                    "",
                    "jobs[job-" + formID + "][location][]",
                    formID,
                    'location_text');

                    selectPicker.industries('.industry-' + formID,
                        "",
                        "jobs[job-" + formID + "][industry][]",
                        formID,
                        'industry_text');

                    selectPicker.currencies('.currency-' + formID,
                         "",
                         "jobs[job-" + formID + "][currency_id]", 
                         formID,
                        'currency_text');

                    captureFormInputVal();

                    Helper.number('.number-only');

                    formID++;
                    
                }, baseTemplateUrl);

        });
    }

    //use to create fileuploader
    function groupJobFileuploader () {
        
        FileUploader.template('.group-job-fileupload-con', 
            { fileId : 'group-job-file-id' });

        return FileUploader.uploader('#group-job-file-id', 'group-job-canvas');
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

    function cleanUnNeededDom() {

        if ($('#posttype-group-post').is(':checked'))
            $('#job-single-post').empty();

        if ($('#posttype-single-post').is(':checked'))
            $('#job-group-post').empty(); 
    }

})($);
$(JobFulltime.init);