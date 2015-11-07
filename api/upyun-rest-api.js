/*
* UPYUN REST API
* 
* @author Sneezry
* @github Sneezry/upyun-custom-menu-plugin
*/

var UPYUN = function(options) {
  // Default options
  this.options = {
    server: 'v0.api.upyun.com'
  };

  var customOptionsItem;

  for (customOptionsItem in options) {
    this.options[customOptionsItem] = options[customOptionsItem];
  }
};

UPYUN.prototype.request = function(path, parameter, file, callback) {
  parameter['expiration'] = Math.ceil(new Date().getTime() / 1000) + 600;

  var scope = this,
      url = 'http://' + scope.options.server + '/' + path,
      xhr = new XMLHttpRequest(),
      policy = btoa(JSON.stringify(parameter)),
      signature = hex_md5(policy + '&' + scope.options.secret),
      formData = new FormData();

  formData.append('policy', policy);
  formData.append('signature', signature);
  if (file) {
    formData.append('file', file);
  }

  xhr.open('POST', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback({
          code: 0,
          message: 'http://' + parameter.bucket + '.b0.upaiyun.com' + JSON.parse(xhr.responseText).url
        });
      } else {
        callback({
          code: 1,
          message: JSON.parse(xhr.responseText).message
        });
      }
    }
  }
  xhr.send(formData);
};

UPYUN.prototype.upload = function(bucket, relativePath, file, filename, filetype, callback) {
  var scope = this,
      parameter = {},
      path = '/' + (relativePath ? relativePath + '/' : '') + filename;

  parameter['bucket'] = bucket;
  parameter['save-key'] = path;
  parameter['content-type'] = filetype;

  scope.request(bucket, parameter, file, callback);
};