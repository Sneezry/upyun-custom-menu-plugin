/*
* UPYUN custom menu plugin custom functions script
* 
* @author Sneezry
* @github Sneezry/upyun-custom-menu-plugin
*/

/* Upload File Custom Functions */
function i18nUpload() {
  document.getElementById('operator_name_label').innerText = chrome.i18n.getMessage('CML_operator_name');
  document.getElementById('operator_password_label').innerText = chrome.i18n.getMessage('CML_operator_password');
  document.getElementById('operator_btn').innerText = chrome.i18n.getMessage('CML_operator_save');
  document.getElementById('upload_path_label').innerText = chrome.i18n.getMessage('CML_upload_path');
  document.getElementById('upload_file_label').innerText = chrome.i18n.getMessage('CML_upload_file');
  document.getElementById('change_operator_btn').innerText = chrome.i18n.getMessage('CML_change_operator');
  document.getElementById('upload_start_btn').innerText = chrome.i18n.getMessage('CML_upload_start');
  document.getElementById('upload_again_btn').innerText = chrome.i18n.getMessage('CML_upload_again');
}

function eventsUpload() {
  document.getElementById('operator_btn').onclick = function() {
    if (document.getElementById('operator_name').value && document.getElementById('operator_password').value) {
      localStorage['operator_name_' + getBucketName()] = document.getElementById('operator_name').value;
      localStorage['operator_password_' + getBucketName()] = document.getElementById('operator_password').value;
      document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'upload_window');
    }
  };

  document.getElementById('change_operator_btn').onclick = function() {
    document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'set_operator');
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
          operator: localStorage['operator_name_' + getBucketName()],
          password: localStorage['operator_password_' + getBucketName()],
          bucket: getBucketName(),
          path: (path ? path + '/' : '') + file.name,
          fileType: file.type,
          fileSize: file.size,
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
    if (result.rawdata.code === 0) {
      document.getElementById('upload_url').innerText = result.rawdata.data.url;
      document.getElementById('upload_url').href = result.rawdata.data.url;
      document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'upload_result');
    } else {
      document.getElementById('upload_error_message').innerText = result.rawdata.data.message;
      document.getElementsByClassName('cm_upload')[0].setAttribute('data-step', 'upload_error');
    }
  }
});