import IPSObject from "./IPSObject"
import IPSProxy from "../network/IPSProxy"

export default class IPSScript extends IPSObject {
  constructor(proxy, object) {
    super(proxy, object);

    this.scriptType = object['data']['type'];
    this.scriptFile = object['data']['file'];
    this.scriptExecuted = object['data']['lastExecute'];
    this.scriptIsBroken = object['data']['isBroken'];
  }

  processMessage(message) {
    switch(message.message) {
      case IPSProxy.SM_CREATE:
        this.scriptType = message.data[0];
        this.scriptFile = message.senderID + '.ips.php';
      break;
      case IPSProxy.SM_CHANGEFILE:
        this.scriptFile = message.data[0];
      break;
      case IPSProxy.SM_BROKEN:
        this.scriptIsBroken = message.data[0];
      break;
      case IPSProxy.SE_EXECUTE:
        this.scriptExecuted = message.data[3];
      break;
    }

    super.processMessage(message);
  }
}
