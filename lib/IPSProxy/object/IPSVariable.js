import IPSObject from "./IPSObject";
import IPSProxy from "../network/IPSProxy";
import IPSIcons from "./IPSIcons";

let sprintf = require("node_modules/sprintf-js/dist/sprintf.min.js").sprintf;

export default class IPSVariable extends IPSObject {
  constructor(proxy, object) {
    super(proxy, object);

    this.variableProfile = object['data']['profile'];
    this.variableAction = object['data']['action'];
    this.variableCustomProfile = object['data']['customProfile'];
    this.variableCustomAction = object['data']['customAction'];
    this.variableUpdated = object['data']['lastUpdate'];
    this.variableChanged = object['data']['lastChange'];
    this.variableType = object['data']['type'];
    this.variableValue = object['data']['value'];
    this.variableIsLocked = object['data']['isLocked'];
  }

  getIcon() {
    let icon = super.getIcon();

    if (icon === "") {
      icon = this.getProfileIcon();
    } else {
      if (IPSIcons.existsAdaptiveIcon(icon)) {
        icon = IPSIcons.getAdaptiveIcon(icon, this.getPercentageValue());
      }
    }

    return icon;
  }

  getPercentageValue() {

    if (this.hasProfile() && this.proxy.hasProfile(this.getProfile()))
      return this.getProfilePercentageValue();

    if (this.variableType == 0 /* Boolean */)
      return (this.variableValue == true) ? 100.0 : 0.0;

    if (this.variableType == 3 /* String */)
      return -1.0;//return faulty value for strings so it will be ignored

    let minValue = 0.0;
    let maxValue = 100.0;

    let a = Number(this.variableValue) - minValue;
    let b =  maxValue - minValue;

    let result =  (a / b) * 100;

    if (result < 0)
      result = 0.0;

    if (result > 100)
      result = 100.0;

    return result;
  }

  getProfilePercentageValue() {
    let profile = this.getProfileObject();

    if (profile.profileName === "~UnixTimestamp"){
      //use the timestamp's time to calculate the percentage of the day
      let timestamp = new Date(Number(this.variableValue) * 1000);
      return (timestamp.getMinutes() + timestamp.getHours() * 60) / 14.40;
    }

    if (this.variableType == 3 /* String */)
      return -1.0;//return faulty value for strings so it will be ignored

    let result = 0.0;

    //we need to make an override for booleans
    if (profile.profileType == 0 /* Boolean */) {

      result = (this.variableValue == true) ? 100.0 : 0.0;

    } else {

      let a = Number(this.variableValue) - profile.minValue;
      let b = profile.maxValue - profile.minValue;

      //if division by zero profile return -1 to indicate error status
      if (b == 0.0)
        return -1.0;

      result = (a / b) * 100;

      if (result < 0)
        result = 0.0;

      if (result > 100)
        result = 100.0;
    }

    //we have some legacy profiles that are badly defined and would be inconsistent
    if(profile.profileName.startsWith("~Alert") || profile.profileName.startsWith("~Battery")||
      profile.profileName.startsWith("~Window"))
    {
      result = 100 - result;
    }

    //if we have a reversed profile, reverse our percentage value
    if(profile.profileName.endsWith(".Reversed")) {
      result = 100 - result;
    }

    return result;
  }

  processMessage(message) {
    switch(message.message) {
      case IPSProxy.VM_CREATE: /* Variable */
        this.variableType = message.data[0];
        switch(this.variableType) {
          case 0: /* Boolean */
            this.variableValue = false;
            break;
          case 1: /* Integer */
            this.variableValue = 0;
            break;
          case 2: /* Float */
            this.variableValue = 0.0;
            break;
          case 3: /* String */
            this.variableValue = '';
            break;
        }
        break;
      case IPSProxy.VM_UPDATE:
        this.variableValue = message.data[0];
        if (message.data[1]) {
          this.variableChanged = message.data[3];
        }
        this.variableUpdated = message.data[3];
        break;
      case IPSProxy.VM_CHANGEPROFILENAME:
        this.variableCustomProfile = message.data[0];
        this.variableProfile = message.data[1];
        break;
      case IPSProxy.VM_CHANGEPROFILEACTION:
        this.variableCustomAction = message.data[0];
        this.variableAction = message.data[1];
        break;
    }

    super.processMessage(message);
  }

  getProfile() {
    if(this.variableCustomProfile != '')
      return this.variableCustomProfile;
    else if(this.variableProfile != '')
      return this.variableProfile;
    else
      return '';
  }

  hasProfile() {
    return this.getProfile() !== "";
  }

  getProfileObject() {
    if (this.hasProfile() && this.proxy.hasProfile(this.getProfile()))
      return this.proxy.getProfile(this.getProfile());
    else
      return null;
  }

  getProfileIcon() {
    if(!this.hasProfile())
      return '';

    if(!this.proxy.hasProfile(this.getProfile()))
      return '';

    let profile = this.proxy.getProfile(this.getProfile());

    if (profile.profileType != this.variableType)
      return '';

    let association = profile.getAssociation(this.variableValue);
    if(association != null)
      if(association.icon != '')
        return association.icon;

    if (profile.icon != null)
      return profile.icon;

    return '';
  }

  getAction() {
    if (this.variableCustomAction != 0)
      return this.variableCustomAction;
    else if (this.variableAction != 0)
      return this.variableAction;
    else
      return 0;
  }

  hasAction() {
    return this.getAction() >= 10000;
  }

 getValueFormatted(value) {
    if (!this.hasProfile()) {
      switch (this.variableType) {
        case 2: //Float
          let floatValue = sprintf('%f', Number(value));
          //cut following zeroes (4,34000 -> 4.34)
          while (floatValue.endsWith('0')) {
            floatValue = floatValue.substring(0, floatValue.length -1);
          }
          //remove , and . so it will work in different localizations
          if (floatValue.endsWith(',') || floatValue.endsWith('.')) {
            floatValue = floatValue.substring(0, floatValue.length -1);
          }
          return floatValue;
        default:
          return String(value);
      }
    }

    if(!this.proxy.hasProfile(this.getProfile()))
      return 'Invalid profile';

    let profile = this.proxy.getProfile(this.getProfile());

    if(profile.profileType != this.variableType)
      return 'Invalid profile type';

    return profile.getValueFormatted(value);
  }

  toString() {
    return this.getValueFormatted(this.variableValue);
  }
}