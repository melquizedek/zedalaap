var ShortListed = (function($) {

	return {
		init: init
	};

	function init() {
		addEventHandlers();
	}

	function addEventHandlers()
	{
		$(window).on('load', getShortListed());
	}

	function getShortListed()
	{
		var searchKeys = localStorage.getItem('searchKeys');
		searchKeys = searchKeys.replace(/([\[-\]-"])/g, "")

		$('.shorlisted-con').html('<center><i class="fa fa-spin fa-5x fa-circle-o-notch" ></i></center>');

		$.ajax({
			type: 'POST',
			url : apiUrl + 'job/suggested',
			dsataType : 'JSON',
			data: [{name : 'searchKeys', value: searchKeys}],
			success: function(response) {
				
				var applicants = {
					job_post_id: null,
					applicants: response.data
				}

				var filteredApplicants = getApplicants(applicants, searchKeys);
				
				applicants = _.uniq(filteredApplicants.shortListedApplicant, true, 
					function(val, index) {
						return val.user_id;
					});

				if (response.success) 
				{
					if (!applicants.length) {

						$('.page-header').find('h1').text("No Suggested Candidates");
					}

					if (applicants.length) {

						Template.get('#short-listed-temp', '.shorlisted-con', {
							applicantInfo : applicants
						});
					}

					$('.alert-success').fadeIn();
				}

			},
			error: function(response) {
				console.log(response);
			},
			complete: function() {

				$('.shorlisted-con').find('.fa-circle-o-notch').remove();
			}
		});		
	}

})($);
$(ShortListed.init);