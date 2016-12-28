<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>

	<?php
		include 'include/css.php';
	?>

	<!-- Document Title
	============================================= -->
	<title>Edit Part Time Job</title>

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
				<h1>Part Time</h1>
				<ol class="breadcrumb">
					<li>Job</li>
					<li class="active"><a href="index.php">My Job Post</a></li>
					<li class="active"><a href="jobs-list.php?employment_type_id=2">Part Time</a></li>
					<li class="active">Edit Part Time Job</li>
				</ol>
			</div>

		</section><!-- #page-title end -->

		<!-- Content
		============================================= -->
		<section id="content">

			<div class="content-wrap">

				<div class="container clearfix page-main-container">
					<div class="row">						
							<!-- Add new job
					        ================ -->
					        <div class="col-md-4 col-md-offset-4 error-msg-con">
					        </div>

					        <div class="col-md-10 col-md-offset-1 add-new-job-con">
					        	<form name="add-new-job-form" class="form-horizontal" role="form" novalidate>
					        		<input type="hidden" name="employment_type_id" value="2">
					        		<!-- multiple job posting form
					        		============================-->
						            <div class="panel panel-default panel-part-time-con">
						            	
						            	<div class="panel-heading">
							            	<!--Panel Header buttons
							            	===================================-->
							                <div class="btn-group" data-toggle="buttons">
												<label class="btn btn-primary active" id="btn-group-job">
												   	<input type="radio" name="post_type_id" id="posttype-group-post" 
												    	autocomplete="off" value="1" checked> Post Group of Jobs
												</label>
												<label class="btn btn-primary" id="btn-single-job">
												    <input type="radio" name="post_type_id" id="posttype-single-post" 
												    	autocomplete="off" value="2"> Post a Single Job
												</label>
						                	</div><!--Panel Header buttons END - HERE
						            		===================================-->
						            	</div>
						                <div class="panel-body">

						                	<!-- multiple job posting form
					                        ===========================-->
						                	<div class="job-group-post">
						                    </div><!-- END -->

					                        <!-- single job posting form
					                        ===========================-->
					                        <div class="job-single-post">
					                        </div><!-- END -->

						                </div>

						                <div class="panel-footer">
						                	<!---- control button display here
						                	====================---->
						                	<div class="form-group btn-job-group-post">
											    <div class="col-md-8 col-xs-9 col-md-offset-6 col-sm-offset-6 col-xs-offset-3">
											        <a href="index.php" class="btn btn-primary">
											            Cancel
											        </a>
											        <a href="javascript:void(0);" 
											        	class="btn btn-primary btn-save-more-addmore"
											            onclick="JobPartTime.addSaveAddMore();">
											            Save & Add more
											        </a>
											        <button type="submit" class="btn btn-primary btn-preview" 
											        	id="btn-group-preview">
											            Preview
											        </button>
											    </div>
											</div>

											<div class="form-group btn-job-single-post hidden">
											    <div class="col-md-8 col-xs-9 col-md-offset-6 col-sm-offset-6 col-xs-offset-3">
											        <a href="index.php" class="btn btn-primary">
											            Cancel
											        </a>
											        <button type="submit" class="btn btn-primary btn-preview">
											            Preview
											        </button>
											    </div>
											</div><!---- control button display END HERE
						                	====================---->	
						                </div>

						            </div>
					            </form>
							</div><!-- END - Add new job -->

							<!-- Preview
					        ================ -->
					        <div class="col-md-12 part-time-preview-con hidden">
					        </div><!-- END - Preview -->

					        <div class="alert-msg-temp-con"></div>
					        
					</div>

				</div>

			</div><!-- .content-wrap end -->
			
		</section><!-- #content end -->

		<?php
			include 'include/footer.php';
		?>

	</div><!-- #wrapper end -->

	<!-- Go To Top
	============================================= -->
	<div id="gotoTop" class="icon-angle-up"></div>

	<!-- load needed job underscore tmeplate
	============================================= -->
	<?php include 'template/job/common-temp.html'; ?>
	<?php include 'template/job/part-time/common.html'; ?>

	<?php
		include 'include/js.php';
	?>

	<!-- Add  needed js for Job posting functionality
	======================================================= -->
	<script type="text/javascript">
		var jobGroupID = "<?php echo $_GET['job_group_id']; ?>";
		var postTypeID = <?php echo $_GET['post_type_id']; ?>;
	</script>
	<script type="text/javascript" src="js/app/job-part-time.js"></script>

</body>
</html>