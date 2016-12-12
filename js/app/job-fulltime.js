var fulltimeForm = $('form[name=add-new-job-form]');

/*JobFulltimesinglePostt
========================================*/
var JobFulltimesinglePostt = (function($) {
    
    return {
        init: init,
        fileUploaderTemp: fileUploaderTemp,
    };

    function init() 
    {
        singlePost();
        captureFormInputVal();
    }

    function singlePost()
    {

        $('#btn-single-job').on('click', function() {
            
            $('#posttype-group-post').prop('checked', false);
            $('#posttype-single-post').prop('checked', true);
            $('#job-group-post, .error-msg-con').empty();

            Template.get('#single-post-temp', '#job-single-post', null);
            
            $('.btn-job-group-post').hide();
            $('.btn-job-single-post').show();

            templateDependencies();

            Helper.number('.number-only');

            captureFormInputVal();
        }); 
    }

    function templateDependencies() 
    {
        fileUploaderTemp();

        $('.datepicker').datepicker({
            format: 'yyyy-mm-dd'
        });

        selectPicker.inputTextContainer = '#job-single-post';
        selectPicker.locations('.location-0', "jobs[job-0][location_id][]", "", 0, 'location_text');
        selectPicker.industries('.industry-0', "jobs[job-0][industry_id][]", "", 0, 'industry_text');
        selectPicker.currencies('.currency-0', "jobs[job-0][currency_id]", "", 0, 'currency_text');
    }

    function fileUploaderTemp()
    {
        FileUploader.template('.single-job-fileupload-con', 
            { fileId : 'single-job-file-id' })
            .uploader('#single-job-file-id', 'single-job-canvas');
    }

})($);
$(JobFulltimesinglePostt.init);

/*
<-- JobFulltimeGroupPost
=====================================*/
var JobFulltimeGroupPost = (function($) {

    var addNewJobFormId = 1;
    var formData = [];

    return {
        init: init,
        setformData : setformData,
        posting: posting,
        formData : formData,
        removeSaveAddMore : removeSaveAddMore,
        fulltimePreviewBack : fulltimePreviewBack,
        fulltimePreview : fulltimePreview
    };

    function init() 
    {
        JobFulltimeGroupPost();
        captureFormInputVal();
    }

    function initTemplate()
    {
        //initialize editing for group and single post
        if (typeof jobGroupID !== 'undefined') 
        {    
            var jobObj = JSON.parse(localStorage.getItem('jobObj'));
            var jsonForEdit = JSON.parse(jobObj.for_editing);

            var jsonFileInputText = $('<input type="hidden"/>')
                    .attr({ name: 'json_file_id', value: jsonForEdit.jsonId });
            
            fulltimeForm.prepend(jsonFileInputText);

            selectPicker.isEdit = true;
            
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
                        }

                        if (postTypeID == 2) 
                        {
                            $('#job-single-post').html(response.html);

                            $('#posttype-single-post').attr('checked', true);
                            $('#posttype-group-post').removeAttr('checked');

                            $('.btn-job-group-post').hide();
                            $('.btn-job-single-post').show();

                            JobFulltimesinglePostt.fileUploaderTemp();
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

                        fulltimeForm.append($('<input type="hidden" name="job_group_id"/>').val(jobGroupID));

                        resetAddedFormId();
                        
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

                        addNewJobFormId = getAddedFormNum();

                        __initGroupJobFileuploader();

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

            //for adding new job
            Template.get('#group-post-temp', '#job-group-post', null);
            selectPickers();

            addNewJobFormId = getAddedFormNum();

            __initGroupJobFileuploader();

            $('.datepicker').datepicker({
                    format: 'yyyy-mm-dd'
                }
            );
        }
    }


    function JobFulltimeGroupPost ()
    {
        initTemplate();

        $('.btn-save-more-addmore').on('click', 
            function () {
                saveAddMore();
            }
        );

        $('#btn-group-job').on('click', 
            function() {
                
                $('#posttype-single-post').prop('checked', false);
                $('#posttype-group-post').prop('checked', true);
                $('#job-single-post, .error-msg-con').empty();
                
                selectPicker.inputTextContainer = "";
                initTemplate();

                $('.btn-job-single-post').hide();
                $('.btn-job-group-post').show();
            }
        );

        Helper.number('.number-only');

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

            var btnPreview = $('.btn-preview');
            btnPreview.prop('disabled', true).text('Processing...');

            var successCallback =  function(response) {
                
                btnPreview.text("Preview").prop('disabled', false);

                JobFulltimeActions.cleanUnNeededDom();

                var responseData = JSON.parse(response);

                if (responseData.errorMsg) {
                    
                    Template.get('#error-msg-temp', '.error-msg-con',
                        { errorMsgs : responseData.errorMsg });

                    $('body,html')
                        .stop(true).animate({ 'scrollTop': 0 });
                } else {
                    
                    isHeadlinePhotoUploaded('JobFulltimeGroupPost.fulltimePreviewBack()');
                    
                    $('.error-msg-con').empty();
                    
                    setformData(responseData);

                    fulltimePreview(responseData);
                }
            }

            $.ajax({
                type: 'POST',
                url: apiUrl + 'to-json-encode',
                data: dataArr,
                success: successCallback,
                error: function(response) {
                    console.log("Failed: ", response);
                }
            });

        });

    }

    function setformData(data, type) {

        JobFulltimeGroupPost.formData = data;
    }

    function posting(elemSelector) {
        
        var jobsArr = $.makeArray(JobFulltimeGroupPost.formData.jobs);
        
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
        JobFulltimeGroupPost.formData.for_editing = JSON.stringify(forEditing);

        var url = 'job/posting';
        //for updating job
        if (typeof jobGroupID !== 'undefined') 
        {
            url = 'job/list/' + jobGroupID;
            JobFulltimeGroupPost.formData._METHOD = 'PUT';
        }

        JobFulltimeGroupPost.formData.employment_type_text = 'Fulltime';
        //console.log(JobFulltimeGroupPost.formData);

        Http.ajaxButton({
            type: 'POST',
            url: apiUrl + url,
            data : JobFulltimeGroupPost.formData,
            success : function(response) {
                if (response.success) {
                    window.location.href = "short-listed.php";
                }
            }
        }, $(elemSelector), 'Posting...' );

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
                headline : (typeof response.headline !== "undefined") ? response.headline : null,
                headlineDesc : (typeof response.headline_desc !== "undefined") ? response.headline_desc : null,
                validUntil : response.hiring_duration_to,
                jobs : response.jobs
            };
        
        //console.log(fullTimePreviewData);

        Template.get('#fulltime-preview',
            '.fulltime-preview-con',
            fullTimePreviewData
        );

        $('.add-new-job-con').hide();
        $('.fulltime-preview-con').show();
    }

    function fulltimePreviewBack() {

        $('.fulltime-preview-con').hide();
        $('.add-new-job-con').show();
    }

    function selectPickers() {

        if (localStorage.getItem('countries') 
                && localStorage.getItem('industries')
                && localStorage.getItem('currencies')) {

            selectPicker.locations('.location-0', "", "", 0, 'location_text');
            selectPicker.industries('.industry-0', "", "", 0, 'industry_text');
            selectPicker.currencies('.currency-0', "", "", 0, 'currency_text');

        } else {

            Resources.getCountry(function(response) {

                if (response.data) {

                    localStorage.setItem('countries',
                        JSON.stringify(response.data));

                    selectPicker.locations('.location-0', "", "", 0, 'location_text');                
                }

            });

            Resources.getIndustry(function(response) {

                if (response.data) {

                    localStorage.setItem('industries', 
                        JSON.stringify(response.data));

                    selectPicker.industries('.industry-0', "", "", 0, 'industry_text');
                }
            });

            Resources.getCurrency(function(response) {
                
                if (response.data) {

                    localStorage.setItem('currencies', 
                        JSON.stringify(response.data));

                    selectPicker.currencies('.currency-0', "", "", 0, 'currency_text');
                }

            });

        }
    }

    function removeSaveAddMore(id) {

        $('#added-job-form-' + id).remove();
        $('.input-text-' + id).remove();
    }

    function saveAddMore () {

        Template.get('#add-new-job-temp', '.added-job-form-con', { formID : addNewJobFormId }, 'append');

        selectPicker.locations('.location-' + addNewJobFormId, 
            "",
            "jobs[job-" + addNewJobFormId + "][location][]",
            addNewJobFormId,
            'location_text');

        selectPicker.industries('.industry-' + addNewJobFormId,
            "",
            "jobs[job-" + addNewJobFormId + "][industry][]",
            addNewJobFormId,
            'industry_text');

        selectPicker.currencies('.currency-' + addNewJobFormId,
             "",
             "jobs[job-" + addNewJobFormId + "][currency_id]", 
             addNewJobFormId,
            'currency_text');

        captureFormInputVal();

        Helper.number('.number-only');

        addNewJobFormId++;
    }

    function __initGroupJobFileuploader () {
        
        FileUploader.template('.group-job-fileupload-con', 
            { fileId : 'group-job-file-id' })
            .uploader('#group-job-file-id', 'group-job-canvas');
    }

})($);
$(JobFulltimeGroupPost.init);

/*
===================*/
var JobFulltimeActions = (function($) {

    return {
        init: init,
        cleanUnNeededDom: cleanUnNeededDom,
    };

    function init() {}

    function cleanUnNeededDom() {

        if ($('#posttype-group-post').is(':checked'))
            $('#job-single-post').empty();

        if ($('#posttype-single-post').is(':checked'))
            $('#job-group-post').empty(); 
    }

})($);
$(JobFulltimeActions.init);