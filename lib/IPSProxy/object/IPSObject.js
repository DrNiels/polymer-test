import Comparable from "./Comparable";
import IPSProxy from "../network/IPSProxy";
import ArrayUtils from "../util/ArrayUtils";
import Comparators from "../util/Comparators"

export default class IPSObject extends Comparable {
  constructor(proxy, object) {
    super();
    this.proxy = proxy;

    this.parentID = object['parentID'];
    this.objectID = object['id'];
    this.objectType = object['type'];
    this.objectIdent = object['ident'];
    this.objectName = object['name'];
    this.objectInfo = object['info'];
    this.objectIcon = object['icon'];
    this.objectSummary = object['summary'];
    this.objectPosition = object['position'];
    this.objectIsReadOnly = object['readOnly'];
    this.objectIsHidden = object['hidden'];
    this.objectIsDisabled = object['disabled'];

    /* @type Array<IPSObject> */
    this.children = [];
  }

  processMessage(message) {
    switch(message.message) {
      case IPSProxy.OM_CHANGENAME:
        this.objectName = message.data[0];
        break;
      case IPSProxy.OM_CHANGEPARENT:
        this.parentID = message.data[0];
        break;
      case IPSProxy.OM_CHANGEINFO:
        this.objectInfo = message.data[0];
        break;
      case IPSProxy.OM_CHANGEPOSITION:
        this.objectPosition = message.data[0];
        break;
      case IPSProxy.OM_CHANGEREADONLY:
        this.objectIsReadOnly = message.data[0];
        break;
      case IPSProxy.OM_CHANGEHIDDEN:
        this.objectIsHidden = message.data[0];
        break;
      case IPSProxy.OM_CHANGEDISABLED:
        this.objectIsDisabled = message.data[0];
        break;
      case IPSProxy.OM_CHANGEICON:
        this.objectIcon = message.data[0];
        break;
      case IPSProxy.OM_CHANGEIDENT:
        this.objectIdent = message.data[0];
        break;
      case IPSProxy.OM_CHILDADDED:
        this.children.push(this.proxy.getObject(message.data[0]));
        break;
      case IPSProxy.OM_CHILDREMOVED:
        this.children = ArrayUtils.removeFromArray(this.children, this.proxy.getObject(message.data[0]));
        break;
    }
  }

  compareTo(other) {
    if (this.objectPosition != other.objectPosition)
      return Comparators.compareNumber(this.objectPosition, other.objectPosition);

    if (this.objectType != other.objectType)
      return Comparators.compareNumber(this.objectType, other.objectType);

    let myName = this.objectName.toLowerCase();
    let otherName = other.objectName.toLowerCase();
    if (myName != otherName)
      return Comparators.compareStringLex(myName, otherName);

    if (this.objectID != other.objectID)
      return Comparators.compareNumber(this.objectID, other.objectID);

    return 0;
  }

  getIcon() {
    return this.objectIcon;
  }

  toString() {
    return this.objectName;
  }

}