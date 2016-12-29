<!-- The fileinput-button span is used to style the file input field as button -->
<span class="btn btn-success fileinput-button">
    <i class="glyphicon glyphicon-plus"></i>
    <span>Add Files or Drag Here...</span>
    <!-- The file input field used as target for the file upload widget -->
    <input class="fileupload" type="file" name="files" multiple>
</span>
<br>
<br>
<!-- The global progress bar -->
<div class="progress jq-upload-progbar" style="display: none">
    <div class="progress-bar progress-bar-success"></div>
</div>
<!-- The container for the uploaded files -->
<div class="files">
    <p class="img-to-upload"></p>
</div>