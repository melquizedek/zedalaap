<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>

	<?php
		include 'include/css.php';
	?>

	<!-- Document Title
	============================================= -->
	<title>Account Management - Jobs Global | Employer</title>

</head>

<body class="stretched">

	<!-- Document Wrapper
	============================================= -->
	<div id="wrapper" class="clearfix">

		<?php
			include 'include/navigation.php';
		?>

		<!-- Page Title
		============================================= -->
		<section id="page-title">

			<div class="container clearfix">
				<h1>Account Management</h1>
				<ol class="breadcrumb">
					<li>Utitlies</li>
					<li class="active">Accounts</li>
				</ol>
			</div>

		</section><!-- #page-title end -->

		<!-- Content
		============================================= -->
		<section id="content">

			<div class="content-wrap">

				<div class="container clearfix">

					<!-- Listing view
					============================================= -->

					<div id="list-view" class="hidden">
						<button class="button button-3d nomargin" id="add-new-record"><i class="fa fa-plus"></i>&nbsp;Add New User</button>

						<div class="clear bottommargin-xxsm"></div>

						<div class="table-responsive">

							<table id="datalist" class="table table-striped table-bordered" cellspacing="0" width="100%">
								<thead>
									<tr>
										<th class="center">Name</th>
										<th class="center">Email</th>
										<th class="center">Contact</th>
										<th class="center">&nbsp;</th>
									</tr>
								</thead>
								<tbody>
									
								</tbody>
							</table>

						</div>
					</div> <!-- END - Listing view -->

					<div>
						<b>This sample is Populated by Underscore Template</b>
					 	<p/>
					 	<ul id="userList">
					 	</ul>
					</div>

					<!-- Add view
					============================================= -->

					<div id="add-view" class="hidden">

						<div class="col_two_third nobottommargin">	

							<div class="fancy-title title-border">
								<h3>Add New <span>User</span></h3>
							</div>
						
							<div class="style-msg2 errormsg add-form-error-container hidden">
								<div class="msgtitle add-form-error-message-title">Fix the Following Errors:</div>
								<div class="sb-msg">
									<ul class="add-form-error-message">
										<!-- APPEND ERROR MESSAGES HERE -->
									</ul>
								</div>
							</div>
						
							<form id="add-form" name="add-form" class="nobottommargin">

								<div class="col_half">
									<label for="add-form-email">Email Address:</label>
									<input type="text" id="add-form-email" name="add-form-email" value="" class="sm-form-control" />
								</div>

								<div class="clear"></div>

								<div class="col_half">
									<label for="add-form-first-name">Name:</label>
									<input type="text" id="add-form-name" name="add-form-first-name" value="" class="sm-form-control" />
								</div>

								<div class="col_half col_last">
									<label for="add-form-last-name">Contact:</label>
									<input type="text" id="add-form-contact" name="add-form-last-name" value="" class="sm-form-control" />
								</div>

							</form>

							<div class="clear"></div>

							<div class="col_full nobottommargin">
								<button class="button button-3d nomargin" id="add-form-submit" name="add-form-submit" value="add"><i class="fa fa-save"></i>&nbsp;Save</button>

								<button class="button button-3d nomargin hidden" id="add-form-submit-loading" value="add" disabled>Saving &nbsp;<i class="fa fa-spin fa-circle-o-notch"></i></button>

								<button class="button button-3d button-amber nomargin back-btn fright"><i class="fa fa-mail-reply-all"></i>&nbsp;Back</button>
							</div>
						</div>
					</div> <!-- END - Add view -->


					<!-- Edit view
					============================================= -->

					<div id="edit-view" class="hidden">
						<div class="col_two_third nobottommargin">	

							<div class="fancy-title title-border">
								<h3>Update <span>User</span></h3>
							</div>
						
							<div class="style-msg2 errormsg edit-form-error-container hidden">
								<div class="msgtitle edit-form-error-message-title">Fix the Following Errors:</div>
								<div class="sb-msg">
									<ul class="edit-form-error-message">
										<!-- APPEND ERROR MESSAGES HERE -->
									</ul>
								</div>
							</div>
						
							<form id="edit-form" name="edit-form" class="nobottommargin">

								<input type="hidden" id="edit-form-employer-user-id" />

								<div class="col_half">
									<label for="edit-form-email">Email Address:</label>
									<input type="text" id="edit-form-email" name="edit-form-email" value="" class="sm-form-control" disabled />
								</div>

								<div class="clear"></div>

								<div class="col_half">
									<label for="edit-form-first-name">Name:</label>
									<input type="text" id="edit-form-name" name="edit-form-name" value="" class="sm-form-control" />
								</div>

								<div class="col_half col_last">
									<label for="edit-form-last-name">Contact:</label>
									<input type="text" id="edit-form-contact" name="edit-form-contact" value="" class="sm-form-control" />
								</div>

							</form>

							<div class="clear"></div>

							<div class="col_full nobottommargin">
								<button class="button button-3d nomargin" id="edit-form-submit" name="edit-form-submit" value="edit"><i class="fa fa-save"></i>&nbsp;Update</button>

								<button class="button button-3d nomargin hidden" id="edit-form-submit-loading" value="edit" disabled>Updating &nbsp;<i class="fa fa-spin fa-circle-o-notch"></i></button>

								<button class="button button-3d button-amber nomargin back-btn fright"><i class="fa fa-mail-reply-all"></i>&nbsp;Back</button>
							</div>
						</div>
					</div> <!-- END - Edit view -->


					<!-- Delete Modal
					============================================= -->

					<input type="hidden" id="delete-form-employer-user-id" />
					<div class="modal fade delete-modal" tabindex="-1" role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-sm">
							<div class="modal-body">
								<div class="modal-content">
									<div class="modal-header">
										<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
										<h4 class="modal-title">Delete this record?</h4>
									</div>
									<div class="modal-body">
										<p class="nobottommargin">
											Are you sure you want to delete account with <b><span id="delete-email"></span></b> email address?
										</p>
									</div>
									<div class="modal-footer">
										<button class="button button-3d button-red nomargin fleft delete-submit-loading hidden"><i class="fa fa-trash"></i>Deleting &nbsp;<i class="fa fa-spin fa-circle-o-notch"></i></button>

										<button class="button button-3d button-red nomargin fleft" id="delete-submit"><i class="fa fa-trash"></i>&nbsp;Delete</button>

										<button class="button button-3d button-amber nomargin delete-cancel" data-dismiss="modal" aria-hidden="true"><i class="fa fa-mail-reply-all"></i>&nbsp;Cancel</button>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>

			</div>

		</section><!-- #content end -->

		<?php
			include 'include/footer.php';
		?>

	</div><!-- #wrapper end -->

	<!-- Go To Top
	============================================= -->
	<div id="gotoTop" class="icon-angle-up"></div>

	<?php
		include 'include/js.php';
	?>

	<script type="text/javascript" src="js/app/exam.js"></script>

</body>
</html>