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
      var code, data;

      code = xhr.status === 200 ? 0 : 1;

      try {
        data = JSON.parse(xhr.responseText)
      } catch(e) {
        data = {
          msg: xhr.responseText
        }
      }

      callback({
        code: code,
        headers: xhr.getAllResponseHeaders(),
        data: data
      });
    }
  }
  xhr.send(data);
};

UPYUN.prototype.upload = function(bucket, relativePath, file, filesize, callback) {
  var scope = this,
      path = '/' + bucket + '/' + relativePath;

  scope.request('PUT', path, file, filesize, {}, function(result){
    if (0 === result.code) {
      callback({
        code: 0,
        data: {
          url: 'http://' + bucket + '.b0.upaiyun.com/' + relativePath
        }
      });
    } else {
      callback({
        code: 1,
        data: {
          message: result.data.msg
        }
      });
    }
  });
};

UPYUN.prototype.getFileInfo = function(bucket, relativePath, callback) {
  var scope = this,
      path = '/' + bucket + '/' + relativePath;

  scope.request('HEAD', path, null, 0, {}, callback);
};

UPYUN.prototype.deleteFile = function(bucket, relativePath, callback) {
  var scope = this,
      path = '/' + bucket + '/' + relativePath;

  scope.request('DELETE', path, null, 0, {}, callback);
};

UPYUN.prototype.createFolder = function(bucket, relativePath, callback) {
  var scope = this,
      path = '/' + bucket + '/' + relativePath,
      data = 'folder=true',
      dataLength = data.length;

  scope.request('POST', path, data, dataLength, {}, callback);
};

UPYUN.prototype.deleteFolder = UPYUN.prototype.deleteFile;

UPYUN.prototype.getFileList = function(bucket, relativePath, callback) {
  var scope = this,
      path = '/' + bucket + '/' + relativePath;

  scope.request('GET', path, null, 0, callback);
};

UPYUN.prototype.getUsage = function(bucket, callback) {
  var scope = this,
      path = '/' + bucket + '/?usage';

  scope.request('GET', path, null, 0, callback);
}