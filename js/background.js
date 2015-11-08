/*
* UPYUN custom menu plugin background script
* 
* @author Sneezry
* @github Sneezry/upyun-custom-menu-plugin
*/

chrome.runtime.onMessage.addListener(function(message, sender, callback) {
  if ('get_custom_menu' === message.action) {
    callback(customMenuData);
  } else if ('upyun_api_upload' === message.action) {
    upyunAPIUpload(message, sender);
  }
});

function base64toBlob(base64Data, contentType, filename) {
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType }, filename);
}

function upyunAPIUpload(options, sender) {
  upyun = new UPYUN({
    operator: options.operator,
    password: options.password
  });

  var file = base64toBlob(options.base64Data, options.fileType, options.fileName);

  upyun.upload(options.bucket, options.path, file, options.fileName, options.fileSize, function(result) {
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'upyun_api_upload_message',
      bucket: options.bucket,
      path:  options.path,
      filename: options.fileName,
      data: result
    })
  });
};

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    details.requestHeaders.push({
      name: 'Date',
      value: new Date().toGMTString()
    });
    return {requestHeaders: details.requestHeaders};
  },
  {urls: ["*://*.api.upyun.com/*"]},
  ["blocking", "requestHeaders"]);