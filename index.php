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
				<h1>My Job Post</h1>
				<ol class="breadcrumb">
					<li>Job</li>
					<li class="active">My Job Post</li>
				</ol>
			</div>

		</section><!-- #page-title end -->

		<!-- Content
		============================================= -->
		<section id="content">

			<div class="content-wrap">

				<div class="container clearfix page-main-container">

					<div class="row" style="text-align: center">
						<div class="col-md-4">
							<div class="panel panel-default">
								
								<div class="panel-body">
									<h1>
										<a href="jobs-list.php?employment_type_id=1">
											<i class="fa fa-users fa-5x" aria-hidden="true"></i><br/>
											Full Time Jobs
										</a>   
									</h1>
								</div>
								
							</div>
						</div>
						<div class="col-md-4">
							<div class="panel panel-default">
								
								<div class="panel-body">
									<h1>
										<a href="jobs-list.php?employment_type_id=2">
										<i class="fa fa-clock-o fa-5x" aria-hidden="true"></i><br/>
										Part Time Jobs
										</a>
									</h1>
								</div>
								
							</div>
						</div>
						<div class="col-md-4">
							<div class="panel panel-default">
								
								<div class="panel-body">
									<h1>
										<a href="jobs-list.php?employment_type_id=3">
											<i class="fa fa-calendar fa-5x" aria-hidden="true"></i>
											Temporary Jobs
										</a> 
									</h1>
								</div>
								
							</div>
						</div>
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
	
	<?php
		include 'include/js.php';
	?>

	<script type="text/javascript">
		$('document').ready(function function_name(arg) {
			
			Resources.getCountry(function(response) {

                if (response.data) {
                    localStorage.setItem('countries',
                        JSON.stringify(response.data));
                }

            });

            Resources.getIndustry(function(response) {

                if (response.data) {
                    localStorage.setItem('industries', 
                        JSON.stringify(response.data));
                }
            });

            Resources.getCurrency(function(response) {
                
                if (response.data) {
                    localStorage.setItem('currencies', 
                        JSON.stringify(response.data));
                }

            });


		});
	</script>
</body>
</html>