<?php
//echo '<pre>'; var_dump($_SERVER);exit;
?>
<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>

	<?php
		include 'include/css.php';
	?>

	<!-- Document Title
	============================================= -->
	<title>Job Posting - Full Time</title>

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
				<h1 class="employment-label"></h1>
				<ol class="breadcrumb">
					<li>Job</li>
					<li class="active"><a href="index.php">My Job Post</a></li>
					<li class="active employment-label"></li>
				</ol>
			</div>

		</section><!-- #page-title end -->

		<!-- Content
		============================================= -->
		<section id="content">

			<div class="content-wrap">

				<div class="container clearfix page-main-container">

						<div class="row jobs-list">
							<div class="col-md-2 col-md-offset-10">
								<a href="#" class="btn btn-primary btn-add-new-job">
									Add New Job
								</a>
							</div>
						</div>
						
						<div class="row jobs-list">
							<div class="col-md-12">
								<div class="tabbable" id="tabs-187283">
									<ul class="nav nav-tabs">
										<li class="active">
											<a href="#panel-publish" data-toggle="tab">Publish</a>
										</li>
										<li>
											<a href="#panel-draft" data-toggle="tab">Draft</a>
										</li>
										<li>
											<a href="#panel-rejected" data-toggle="tab">Rejected</a>
										</li>
									</ul>
									<div class="tab-content">

										<div class="tab-pane active" id="panel-publish">
											<br/>
											<div class="publish-search-form-con"></div>
											<br/>
											<div class="publish-job-list-con job-list">
											</div>
										</div>

										<div class="tab-pane" id="panel-draft">
											<br/>
											<div class="draft-search-form-con"></div>
											<br/>
											<div class="draft-job-list-con job-list">
											</div>
										</div>

										<div class="tab-pane" id="panel-rejected">
											<br/>
											<div class="reject-search-form-con"></div>
											<br/>
											<div class="reject-job-list-con job-list">
											</div>
										</div>
										
									</div>
								</div>
							</div>
						</div>

						<div class="preview-con"></div>

						<div class="applicant-view-con"></div>

						<div class="alert-msg-temp-con"></div>

				</div><!-- container clearfix end -->

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
	<?php include 'template/job/job-list-temp.html'; ?>

	<?php
		include 'include/js.php';
	?>

	<!-- Add  needed js for job list
	======================================================= -->
	<script type="text/javascript">
		var employmentTypeId = '<?php echo isset($_GET['employment_type_id']) ? $_GET['employment_type_id'] : ""; ?>';
		var validityStart = '<?php //echo date("m/d/Y", time()); ?>';
		var validityEnd = '<?php //echo date("m/d/Y", time()); ?>';
	</script>

	<script type="text/javascript" src="js/app/job-list.js"></script>

</body>
</html>