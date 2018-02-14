import IPSProxy from "network/IPSProxy";
import IPSNetwork from "network/IPSNetwork";
import Broadcaster from "util/Broadcaster";
import IPSCategory from "object/IPSCategory";

export default class IPSProxyFactory {
  static IPSProxy(url, username, password) {
    let broadcaster = new Broadcaster();
    let network = new IPSNetwork(url);
    network.setCredentials(username, password);
    return new IPSProxy(network, broadcaster);
  }
}

//module.exports = IPSProxyFactory;
