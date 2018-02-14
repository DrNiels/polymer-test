import IPSObject from "./IPSObject"
import IPSProxy from "../network/IPSProxy"

export default class IPSLink extends IPSObject {
  constructor(proxy, object) {
    super(proxy, object);

    this.targetID = object['data']['targetID'];
  }

  processMessage(message) {
    switch(message.message) {
      case IPSProxy.LM_CREATE:
        break;
      case IPSProxy.LM_CHANGETARGET:
        this.targetID = message.data[0];
        break;
    }

    super.processMessage(message);
  }
}
