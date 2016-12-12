<?php $employment_type_id = isset($_GET['employment_type_id']) ? $_GET['employment_type_id'] : null; ?>
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
				<?php if ($employment_type_id == 1) { ?>
					<h1>Full Time</h1>
				<?php } ?>
				<?php if ($employment_type_id == 2) { ?>
					<h1>Part Time</h1>
				<?php } ?>
				<?php if ($employment_type_id == 3) { ?>
					<h1>Temporary</h1>
				<?php } ?>
				<ol class="breadcrumb">
					<li>Job</li>
					<li class="active"><a href="index.php">My Job Post</a></li>
					<?php if ($employment_type_id == 1) { ?>
						<li class="active"><a href="jobs-list.php?employment_type_id=1">Full Time</a></li>
					<?php } ?>
					<?php if ($employment_type_id == 2) { ?>
						<li class="active"><a href="jobs-list.php?employment_type_id=2">Part Time</a></li>
					<?php } ?>
					<?php if ($employment_type_id == 3) { ?>
						<li class="active"><a href="jobs-list.php?employment_type_id=3">Temporary</a></li>
					<?php } ?>
					<li class="active">Suggested Candidates</li>
				</ol>
			</div>

		</section><!-- #page-title end -->

		<!-- Content
		============================================= -->
		<section id="content">

			<div class="content-wrap">

				<div class="container clearfix page-main-container">

					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-dismissable alert-success" style="display: none;">
								<button type="button" class="close" data-dismiss="alert" aria-hidden="true">
									×
								</button>
								<center><strong>Job has been successfully posted.</strong></center>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="page-header">
								<h1>
									Suggested Candidates
								</h1>
							</div>
						</div>
					</div>
					<div class="row shorlisted-con">
					</div>

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

	<?php include 'template/job/short-listed-temp.html' ?>

	<?php
		include 'include/js.php';
	?>

	<!-- Add  needed js for shortlisted
	======================================================= -->
	<script type="text/javascript" src="js/app/short-listed.js"></script>

</body>
</html>