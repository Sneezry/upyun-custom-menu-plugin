/*
* UPYUN custom menu plugin controller script
* 
* @author Sneezry
* @github Sneezry/upyun-custom-menu-plugin
*/

var customMenuController = function() {};

/* Upload File Custom controller */
customMenuController.uploadFiles = function(submenu) {
  i18nUpload();
  eventsUpload();

  document.getElementById('upload_bucket').value = getBucketName();

  if (!localStorage['operator_name_' + getBucketName()] || !localStorage['operator_password_' + getBucketName()]) {
    document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'set_operator');
  } else {
    document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'upload_window');
  }
};