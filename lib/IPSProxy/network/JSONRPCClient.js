export default class JSONRPCClient {
  constructor(url) {
    this.url = url;
    this.password = "";
    this.username = "";
  }

  setUsername(newUsername) {
    this.username = newUsername;
  }

  setPassword(newPassword) {
    this.password = newPassword;
  }

  setUrl(newUrl) {
    this.url = newUrl;
  }

  getUrl() {
    return this.url;
  }

  static _defaultOrValue(actualValue, defaultValue) {
    return typeof actualValue !== 'undefined' ? actualValue : defaultValue;
  }

  makeRequest(method, params, progressCallback) {
    // Set defaults for optional parameters
    params = JSONRPCClient._defaultOrValue(params, []);
    let id = Date.now() / 1000 | 0;

    // Build request object
    let RPCrequest = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: id
    };

    let context = this;
    return new Promise(function (resolve, reject) {
      // Configure the request
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('POST', context.url);
      httpRequest.setRequestHeader('Content-Type', 'application/json');
      if (context.password != '') {
        let credentials = window.btoa(context.username + ":" + context.password);
        httpRequest.setRequestHeader('Authorization', 'Basic ' + credentials);
      }
      httpRequest.onreadystatechange = function () {
        if (this.readyState != 4) return;

        let response = {};
        try {
          response = JSON.parse(this.responseText);
        } catch (error) {
          response.error = "JSON parsing failed";
        }

        if (response == null) {
          response = {
            error: 'Unknown JSON-RPC error (HTTP status code: ' + this.status + ') ' + this.statusText
          };
        }

        if (this.status === 200) {
          if (typeof response.error !== 'undefined') {
            resolve(response);
          } else {
            resolve(response.result);
          }
        } else if (this.status === 401) {
          reject('401');
        } else {
          reject(response.error);
        }
      };

      httpRequest.onerror = function () {
        reject('Network error');
      };

      httpRequest.onprogress = function (event) {
        // Because the response is gzipped, lengthComputable is set to false. There is a
        // workaround for this. See:
        // http://stackoverflow.com/a/32799706
        if (event.lengthComputable) {
          if (progressCallback != null) progressCallback((event.loaded / event.total) * 100.0);
        } else {
          let total = event.target.getResponseHeader('X-Content-Length');
          if (total == null) {
            if (progressCallback != null) progressCallback(-1);
          } else {
            if (progressCallback != null) progressCallback((event.loaded / total) * 100.0);
          }
        }
      };

      httpRequest.send(JSON.stringify(RPCrequest));
    });
  }
}
