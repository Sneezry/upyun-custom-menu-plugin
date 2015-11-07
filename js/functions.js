/*
* UPYUN custom menu plugin custom functions script
* 
* @author Sneezry
* @github Sneezry/upyun-custom-menu-plugin
*/

/* Upload File Custom Functions */
function i18nUpload() {
  document.getElementById('form_secret_label').innerText = chrome.i18n.getMessage('CML_form_secret');
  document.getElementById('form_secret_btn').innerText = chrome.i18n.getMessage('CML_form_secret_save');
  document.getElementById('upload_path_label').innerText = chrome.i18n.getMessage('CML_upload_path');
  document.getElementById('upload_file_label').innerText = chrome.i18n.getMessage('CML_upload_file');
  document.getElementById('change_secret_btn').innerText = chrome.i18n.getMessage('CML_change_secret');
  document.getElementById('upload_start_btn').innerText = chrome.i18n.getMessage('CML_upload_start');
  document.getElementById('upload_again_btn').innerText = chrome.i18n.getMessage('CML_upload_again');
}

function eventsUpload() {
  document.getElementById('form_secret_btn').onclick = function() {
    if (document.getElementById('form_secret').value) {
      localStorage['form_secret_' + getBucketName()] = document.getElementById('form_secret').value;
      document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'upload_window');
    }
  };

  document.getElementById('change_secret_btn').onclick = function() {
    document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'set_form_secret');
  };

  document.getElementById('upload_again_btn').onclick = function() {
    document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'upload_window');
  };

  document.getElementById('upload_start_btn').onclick = function() {
    if (document.getElementById('upload_file').value) {
      var upyun,
          path = document.getElementById('upload_path').value,
          file = document.getElementById('upload_file').files[0];

      path = path.match(/^[\/\s]*(.*?)[\/\s]*$/)[1];
      
      var reader = new FileReader();
      reader.onload = function(){
        chrome.runtime.sendMessage({
          action: 'upyun_api_upload',
          secret: localStorage['form_secret_' + getBucketName()],
          bucket: getBucketName(),
          path: path,
          fileType: file.type,
          fileName: file.name,
          base64Data: this.result.split(',')[1]
        });
      }
      reader.readAsDataURL(file);
    }
  };
}

chrome.runtime.onMessage.addListener(function(result) {

  /* Upload File Custom Actions */
  if(result.action === 'upyun_api_upload_message') {
    if (result.data.code === 0) {
      document.getElementById('upload_url').innerText = result.data.message;
      document.getElementById('upload_url').href = result.data.message;
      document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'upload_result');
    } else {
      document.getElementById('upload_error_message').innerText = result.data.message;
      document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'upload_error');
    }
  }
});