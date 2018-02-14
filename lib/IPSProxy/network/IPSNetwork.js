import JSONRPCCClient from "./JSONRPCClient.js";

export default class IPSNetwork {
  constructor(url) {
    this.connection = new JSONRPCCClient(url);
  }

  setUrl(url) {
    this.connection.setUrl(url);
  }

  setCredentials(username, password) {
    this.connection.setUsername(username);
    this.connection.setPassword(password);
  }

  makeRequest(method, params, progressCallback) {
    return this.connection.makeRequest(method, params, progressCallback);
  }

  checkAPI() {
    return new Promise(function (resolve, reject) {
      // Configure request
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('GET', url);
      if (this.username != null && this.password != null) {
        let auth = this.username + ":" + this.password;
        httpRequest.setRequestHeader('Authorization', 'Basic ' + btoa(auth));
      }
      httpRequest.setRequestHeader('Content-Type', 'application/json');
      httpRequest.onreadystatechange = function() {
        if (this.status == 200) {
          // API endpoint responded
          let response = JSON.parse(this.responseText);
          if (response == null) {
            // Invalid API response
            reject('Unknown Error');
          } else {
            // Pass on valid API response
            resolve(response);
          }
          // API did not respond
          resolve(this.responseText);
        } else {
          reject('HTTP status is not OK: ' + this.status + " "  + this.statusText);
        }
      };

      httpRequest.onerror = function() {
        reject('Network error');
      };

      httpRequest.send();
    });
  }
}