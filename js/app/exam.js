var accountManagement = (function($) {
    var timer;
    var templates = [],
        baseTemplateUrl = 'template/user/';

    return {
        init: init
    };

    // Init
    function init() {
        addEventHandlers();
        userList();
        userUndercoreTemplate();
        // lazyLoad();
    }

    // Event Handler
    function addEventHandlers() {
        //Show Add Form
        $("#add-new-record").on('click', showAddForm);
        // Back to User Listing
        $(".back-btn").on('click', backAddToList);
        //Show Edit Form
        $("#datalist").on('click', '.editUser', showEditForm);
        //Save User
        $("#add-form-submit").on('click', addUser);
        // Validate if email Exist
        $("#add-form-email").on('blur', checkIfEmailExist);
        // Edit form Submit
        $("#edit-form-submit").on('click', updateUser);
        //Populate Delete Id
        $("#datalist").on('click', '.deleteUser', deletePopulateId);
        //Delete User
        $("#delete-submit").on('click', deleteUser);
        
        removeErrorClass();
    }
    
    // sample Lazy Load 

    // function lazyLoad() {
    //     clearTimeout(timer);
    //     $(window).on('scroll', function(){
    //         if( $(window).scrollTop() > $(document).height() - $(window).height() ) {
    //             $("#loader").removeClass('hidden');
    //             timer = setTimeout(function() {
    //                 $("#loader").addClass('hidden');
    //                 $("#loadmore").append("<div class='editmore'>mapi mendoza</div>");
    //                 $("#loadmore").append("<div class='editmore'>paul mendoza</div>");
    //                 $("#loadmore").append("<div class='editmore'>hero mendoza</div>");
    //                 return false;
    //             }, 1000);
    //         }
    //     }).scroll();
    // }
    // Get Template
    function getTemplate(templateName, callback) {
        if (!templates[templateName]) {
            $.get(baseTemplateUrl + templateName, function(resp) {
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

    // Populated by Underscore template
    function userUndercoreTemplate () {
        $.ajax({
            type: 'GET',
            url: apiUrl + 'user',
            cache: false,
            async: false,
            success: function(response) {
                if(response.success == true) {
                    getTemplate('user.html', function(render) {
                        var renderedhtml = render({
                            users: response.data
                        });
                        $("#userList").html(renderedhtml);
                    });
                }
            }
        });
    }
    //Listing of User
    function userList() {
        $.ajax({
            type: 'GET',
            url: apiUrl + 'user',
            cache: false,
            async: false,
            success: function(response) {
                if(response.success == true) {
                    $('#datalist').DataTable().destroy();

                    var aoColumns   = [];

                    $.each(response.data, function(index, element) {

                        button = '<a href="#" title="Edit Record" class="editUser" data-id="' + element.user_id + '"><span class="fa fa-pencil"></span></a>&nbsp;&nbsp;&nbsp;' +
                                 '<a href="#" data-toggle="modal" data-target=".delete-modal" title="Delete Record" class="deleteUser" data-id="' + element.user_id + '"><span class="fa fa-trash danger-font"></span></a>';

                        var column = {
                            "name": element.name,
                            "email": element.email,
                            "contact": element.phone_number,
                            "button" : button
                        };

                        aoColumns.push(column);
                    });

                    $('#datalist').DataTable({
                        "ordering": false,
                        "autoWidth": false,
                        "sPaginationType": "full_numbers",
                        "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                        "aaData": aoColumns,
                        "aoColumns": [
                            { "mData": "name", "sClass" : "center" },
                            { "mData": "email", "sClass" : "center" },
                            { "mData": "contact", "sClass" : "center" },
                            { "mData": "button", "sClass" : "center" }
                        ]
                    });

                    setTimeout(function() {
                        $('#loading').addClass('hidden');
                        $('#list-view').removeClass('hidden');
                    }, 1000);
                }
            }
        });
    }

    //Show Add Form
    function showAddForm() {
        $('#loading').removeClass('hidden');
        $('#list-view').addClass('hidden');
        setTimeout(function() {
            $('#loading').addClass('hidden');
            $('#add-view').removeClass('hidden');
        }, 200);
    }

    // Add - Back to List
    function backAddToList() {
        $('#loading').removeClass('hidden');
        $('#add-view').addClass('hidden');
        $('#edit-view').addClass('hidden');

        setTimeout(function() {
            $('#loading').addClass('hidden');
            $('#list-view').removeClass('hidden');
        }, 200);
    }

    //Show Edit Form
    function showEditForm(event) {
        event.preventDefault();
        var userId = $(this).data("id");

        $('#loading').removeClass('hidden');
        $('#list-view').addClass('hidden');

        $.ajax({
            type: 'GET',
            url: apiUrl + 'user/' + userId,
            cache: false,
            async: false,
            success: function(response) {
                if(response.success == true) {
                    var user = response.data[0];
                    $("#edit-form-email").val(user.email);
                    $("#edit-form-name").val(user.name);
                    $("#edit-form-contact").val(user.phone_number.replace('+', ''));
                    $("#edit-form-employer-user-id").val(user.user_id);
                }

                setTimeout(function() {
                    $('#loading').addClass('hidden');
                    $('#edit-view').removeClass('hidden');
                }, 200);
            }
        });
    }

    //Add New User
    function addUser(){

        $('#add-form-submit-loading').removeClass('hidden');
        $('#add-form-submit').addClass('hidden');

        var name    = $('#add-form-email');
        var email   = $('#add-form-name');
        var contact = $('#add-form-contact');

        if (!validateAddForm()) {
            setTimeout(function() {
                $('#add-form-submit-loading').addClass('hidden');
                $('#add-form-submit').removeClass('hidden');

                $('.add-form-error-container').removeClass('hidden').fadeIn();
            }, 500);

            return;
        }

        var data = {
            email      : name.val(),
            name       : email.val(),
            contact    : contact.val(),
        };

        $.ajax({
            type: 'POST',
            url: apiUrl + 'user',
            data: data,
            cache: false,
            success: function(response) {

                if(response.success == true) {
                    toastr.success('Successfully Saved.');

                    $('#loading').removeClass('hidden');
                    $('#add-view, #edit-view, #list-view, #credential-view').addClass('hidden');

                    name.val('');
                    email.val('');
                    contact.val('');

                    setTimeout(function() {
                        $('#loading').addClass('hidden');
                        $('#list-view').removeClass('hidden');
                    }, 200);

                    userList();
                    userUndercoreTemplate();
                } else {

                    var errorMsg    = $('.add-form-error-message');

                    errorMsg.empty();

                    if(response.validation == false) {

                        $.each(response.data, function(index, element) {
                            errorMsg.append('<li class="leftmargin-sm">' + element + '</li>');
                        });
                    } else {
                        errorMsg.append('<li class="leftmargin-sm">Please contact the Support Team.</li>');
                    }

                    $('.add-form-error-container').removeClass('hidden').fadeIn();

                    setTimeout(function() {
                        $('.add-form-error-container').fadeOut().addClass('hidden');
                    }, 10000);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var errorMsg    = $('.add-form-error-message');

                errorMsg.empty();

                errorMsg.append('<li class="leftmargin-sm">Please contact the Support Team.</li>');

                $('.add-form-error-container').removeClass('hidden').fadeIn();

                setTimeout(function() {
                    $('.add-form-error-container').fadeOut().addClass('hidden');
                }, 10000);
            }
        });

        setTimeout(function() {
            $('#add-form-submit-loading').addClass('hidden');
            $('#add-form-submit').removeClass('hidden');
        }, 1000);
    }

    //Validate User Add
    function validateAddForm() {
        var email       = $('#add-form-email');
        var name   = $('#add-form-name');
        var contact    = $('#add-form-contact');

        var errorMsg    = $('.add-form-error-message');

        var hasError = false;

        errorMsg.empty();

        if(!validateEmail(email.val())) {
            email.closest('div').addClass('has-error');
            errorMsg.append('<li>Please enter a valid Email Address.</li>');

            hasError = true;
        }

        if(name.val().length < 2) {
            name.closest('div').addClass('has-error');
            errorMsg.append('<li>Please enter valid Name.</li>');

            hasError = true;
        }

        if(!validateInteger(contact.val()) || contact.val().length < 2) {
            contact.closest('div').addClass('has-error');
            errorMsg.append('<li>Please enter valid Contact.</li>');

            hasError = true;
        }

        if(hasError) {
            setTimeout(function() {
                $('.errormsg').fadeOut().addClass('hidden');
            }, 10000);

            return false;
        }

        return true;
    }

    //On Blur Validate Email
    function checkIfEmailExist(){

        var email = $(this);
        var errorMsg  = $('.add-form-error-message');
        var errorContainer = $('.add-form-error-container');
        errorMsg.empty();

        $.ajax({
            type: 'POST',
            url: apiUrl + 'validate/email',
            data : {
                email: email.val()
            },
            cache: false,
            async: false,
            success: function(response) {
                if(response.success == false) {
                    errorContainer.removeClass('hidden').fadeIn();

                    email.closest('div').addClass('has-error');
                    errorMsg.append(response.message);

                    setTimeout(function() {
                        errorContainer.fadeOut().addClass('hidden');
                    }, 10000);
                }
            }
        });
    }

    // Edit Form Submit
    function updateUser() {
        $('#edit-form-submit-loading').removeClass('hidden');
        $('#edit-form-submit').addClass('hidden');

        var name          = $('#edit-form-name');
        var email         = $('#edit-form-email');
        var contact       = $('#edit-form-contact');
        var userId        = $('#edit-form-employer-user-id').val();

        if(!validateEditForm()) {
            setTimeout(function() {
                $('#edit-form-submit-loading').addClass('hidden');
                $('#edit-form-submit').removeClass('hidden');

                $('.edit-form-error-container').removeClass('hidden').fadeIn();
            }, 500);

            return; 
        }

        var data = {
            userId      : userId,
            email       : email.val(),
            contact     : contact.val(),
            name        : name.val()
        };

        $.ajax({
            type: 'PUT',
            url: apiUrl + 'user',
            data: data,
            cache: false,
            success: function(response) {

                if(response.success == true) {
                    toastr.success('Successfully Updated.');

                    $('#loading').removeClass('hidden');
                    $('#add-view, #edit-view, #list-view, #credential-view').addClass('hidden');

                    name.val('');
                    email.val('');
                    contact.val('');

                    setTimeout(function() {
                        $('#loading').addClass('hidden');
                        $('#list-view').removeClass('hidden');
                    }, 200);

                    userList();
                    userUndercoreTemplate();
                } else {

                    var errorMsg    = $('.edit-form-error-message');

                    errorMsg.empty();

                    if(response.validation == false) {

                        $.each(response.data, function(index, element) {
                            errorMsg.append('<li class="leftmargin-sm">' + element + '</li>');
                        });
                    } else {
                        errorMsg.append('<li class="leftmargin-sm">Please contact the Support Team.</li>');
                    }

                    $('.edit-form-error-container').removeClass('hidden').fadeIn();

                    setTimeout(function() {
                        $('.edit-form-error-container').fadeOut().addClass('hidden');
                    }, 10000);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var errorMsg    = $('.edit-form-error-message');

                errorMsg.empty();

                errorMsg.append('<li class="leftmargin-sm">Please contact the Support Team.</li>');

                $('.edit-form-error-container').removeClass('hidden').fadeIn();

                setTimeout(function() {
                    $('.edit-form-error-container').fadeOut().addClass('hidden');
                }, 10000);
            }
        });

        setTimeout(function() {
            $('#edit-form-submit-loading').addClass('hidden');
            $('#edit-form-submit').removeClass('hidden');
        }, 1000);
    }

    //Populate hidden value on Delete User
    function deletePopulateId(event) {
        event.preventDefault();

        var userId = $(this).data('id');

        $("#delete-form-employer-user-id").val(userId);
    }

    //Delete User
    function deleteUser() {
        $('.delete-submit-loading').removeClass('hidden');
        $('#delete-submit, .delete-cancel').addClass('hidden');

        var user_id = $("#delete-form-employer-user-id").val();

        $.ajax({
            type: 'DELETE',
            url: apiUrl + 'user/' + user_id,
            cache: false,
            async: false,
            success: function(response) {
                if(response.success == true) {
                    toastr.success('Successfully Deleted.');

                    setTimeout(function() {
                        $('.delete-submit-loading').addClass('hidden');
                        $('#delete-submit, .delete-cancel').removeClass('hidden');

                        $('.delete-modal').modal('toggle');

                        userList();
                        userUndercoreTemplate();
                    }, 200);
                } else {
                    toastr.error('Something is wrong while deleting the record.');

                    setTimeout(function() {
                        $('.delete-submit-loading').addClass('hidden');
                        $('#delete-submit, .delete-cancel').removeClass('hidden');
                    }, 200);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                toastr.error('Something is wrong while deleting the record.');

                setTimeout(function() {
                    $('.delete-submit-loading').addClass('hidden');
                    $('#delete-submit, .delete-cancel').removeClass('hidden');
                }, 200);
            }
        });
    }

    //validate Edit Form
    function validateEditForm() {

        var name       = $('#edit-form-name');
        var email      = $('#edit-form-email');
        var contact    = $('#edit-form-contact');

        var errorMsg    = $('.edit-form-error-message');

        var hasError = false;

        errorMsg.empty();

        if(!validateEmail(email.val())) {
            email.closest('div').addClass('has-error');
            errorMsg.append('<li>Please enter a valid Email Address.</li>');

            hasError = true;
        }

        if(name.val().length < 2) {
            name.closest('div').addClass('has-error');
            errorMsg.append('<li>Please enter valid Name.</li>');

            hasError = true;
        }

        if(!validateInteger(contact.val()) || contact.val().length < 2) {
            contact.closest('div').addClass('has-error');
            errorMsg.append('<li>Please enter valid Contact.</li>');

            hasError = true;
        }

        if(hasError) {
            setTimeout(function() {
                $('.edit-form-error-container').fadeOut().addClass('hidden');
            }, 10000);

            return false;
        }

        return true;
    }

    // removeErrorClass
    function removeErrorClass() {

        $('#add-form-email').on('focusin', function() {
            $(this).closest('div').removeClass('has-error');
        });

        $('#add-form-contact').on('focusin', function() {
            $(this).closest('div').removeClass('has-error');
        });

        $('#add-form-name').on('focusin', function() {
            $(this).closest('div').removeClass('has-error');
        });

        $('#edit-form-email').on('focusin', function() {
            $(this).closest('div').removeClass('has-error');
        });

        $('#edit-form-name').on('focusin', function() {
            $(this).closest('div').removeClass('has-error');
        });

        $('#edit-form-contact').on('focusin', function() {
            $(this).closest('div').removeClass('has-error');
        });

    }

})($);
$(accountManagement.init);