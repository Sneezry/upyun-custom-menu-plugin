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

  if (!localStorage['form_secret_' + getBucketName()]) {
    document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'set_form_secret');
  } else {
    document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'upload_window');
  }
};