import IPSObject from "./IPSObject"
import IPSProxy from "../network/IPSProxy"

export default class IPSInstance extends IPSObject {
  constructor(proxy, object) {
    super(proxy, object);

    this.connectionID = object['data']['connectionID'];
    this.instanceStatus = object['data']['status'];
    this.moduleID = object['data']['moduleID'];
    this.moduleName = object['data']['moduleName'];
    this.moduleType = object['data']['moduleType'];
  }

  processMessage(message) {
    switch(message.message) {
      case IPSProxy.IM_CREATE:
        this.moduleID = message.data[0];
        this.moduleName = message.data[1];
        this.moduleType = message.data[2];
        break;
    }

    super.processMessage(message);
  }
}
