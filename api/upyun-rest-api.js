/*
* UPYUN REST API
* 
* @author Sneezry
* @github Sneezry/upyun-custom-menu-plugin
*/

var UPYUN = function(options) {
  // Default options
  this.options = {
    server: 'v1.api.upyun.com'
  };

  var customOptionsItem;

  for (customOptionsItem in options) {
    this.options[customOptionsItem] = options[customOptionsItem];
  }
};

UPYUN.prototype.getSignature = function(method, path, datalength) {
  var str = method.toUpperCase() + '&' + path + '&' +
            new Date().toGMTString() + '&' + datalength + '&' + hex_md5(this.options.password);

  return 'UpYun ' + this.options.operator + ':' + hex_md5(str);
};

UPYUN.prototype.request = function(method, path, data, datalength, headers, callback) {

  var headerKey,
      scope = this,
      url = 'http://' + scope.options.server + path,
      xhr = new XMLHttpRequest(),
      authorization = scope.getSignature(method, path, datalength);

  xhr.open(method, url, true);
  xhr.setRequestHeader('Authorization', authorization);

  for (headerKey in headers) {
    xhr.setRequestHeader(headerKey, headers[headerKey]);
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback({
          code: 0,
          message: 'success'
        });
      } else {
        callback({
          code: 1,
          message: JSON.parse(xhr.responseText).msg
        });
      }
    }
  }
  xhr.send(data);
};

UPYUN.prototype.upload = function(bucket, relativePath, file, filename, filesize, callback) {
  var scope = this,
      parameter = {},
      path = '/' + bucket + '/' + (relativePath ? relativePath + '/' : '') + filename;

  scope.request('PUT', path, file, filesize, {}, callback);
};