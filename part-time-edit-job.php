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
						                <!---- post type button display here
						                ====================---->
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
						                </div>

						            </div>
					            </form>
							</div><!-- END - Add new job -->

							<!-- Preview
					        ================ -->
					        <div class="col-md-12 part-time-preview-con" style="display: none">
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
	<?php include 'template/job/part-time-temp.html'; ?>

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