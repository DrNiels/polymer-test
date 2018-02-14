import IPSObject from "./IPSObject"
import IPSProxy from "../network/IPSProxy"

export default class IPSMedia extends IPSObject {
  constructor(proxy, object) {
    super(proxy, object);

    this.mediaType = object['data']['type'];
    this.mediaFile = object['data']['file'];
    this.mediaUpdated = object['data']['lastUpdate'];
    this.mediaCRC = object['data']['crc'];
    this.mediaSize = object['data']['size'];
    this.mediaIsAvailable = object['data']['isAvailable'];
    this.mediaIsCached = object['data']['cached'];
  }

  getIcon() {
    let icon = super.getIcon();
    if(icon != '')
      return icon;

    return 'Image';
  }

  processMessage(message) {
    switch(message.message) {
      case IPSProxy.MM_CREATE:
        this.mediaType = message.data[0];
        break;
      case IPSProxy.MM_UPDATE:
        this.mediaCRC = message.data[0];
        this.mediaSize = message.data[1];
        this.mediaUpdated = message.data[2];
        break;
      case IPSProxy.MM_CHANGEFILE:
        this.mediaFile = message.data[0];
        break;
      case IPSProxy.MM_AVAILABLE:
        this.mediaIsAvailable = message.data[0];
        break;
      case IPSProxy.MM_CHANGECACHED:
        this.mediaIsCached = message.data[0];
        break;
    }

    super.processMessage(message);
  }
}
