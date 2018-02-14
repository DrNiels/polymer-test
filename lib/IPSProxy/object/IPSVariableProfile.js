import IPSProxy from "../network/IPSProxy"
let sprintf = require("node_modules/sprintf-js/dist/sprintf.min.js").sprintf;

export class IPSVariableProfileAssociation {
  constructor(mixed, name, icon, color) {
    switch(arguments.length) {
      case 1:
        this.value = Number(mixed['value']);
        this.name = mixed['name'];
        this.icon = mixed['icon'];
        this.color = mixed['color'];
        break;
      case 4:
        this.value = mixed;
        this.name = name;
        this.icon = icon;
        this.color = color;
    }
  }
}

export default class IPSVariableProfile {
  constructor(name, profile) {
    this.profileName = name;
    this.profileType = profile['type'];
    this.icon = profile['icon'];
    this.prefix = profile['prefix'];
    this.suffix = profile['suffix'];
    this.minValue = Number(profile['minValue']);
    this.maxValue = Number(profile['maxValue']);
    this.stepSize = Number(profile['stepSize']);
    this.digits = profile['digits'];
    this.isReadOnly = profile['readOnly'];

    this.associations = [];

    profile['associations'].forEach(function (association) {
      this.associations.push(new IPSVariableProfileAssociation(association));
    }, this);
  }

  processMessage(message) {
    switch(message.message) {
      case IPSProxy.PM_CHANGETEXT:
        this.prefix = message.data[1];
        this.suffix = message.data[2];
        break;
      case IPSProxy.PM_CHANGEVALUES:
        this.minValue = Number(message.data[1]);
        this.maxValue = Number(message.data[2]);
        this.stepSize = Number(message.data[3]);
        break;
      case IPSProxy.PM_CHANGEDIGITS:
        this.digits = Math.round(message.data[1]);
        break;
      case IPSProxy.PM_CHANGEICON:
        this.icon = message.data[1];
        break;
      case IPSProxy.PM_ASSOCIATIONADDED:
        this.associations.push(new IPSVariableProfileAssociation(message.data[1], message.data[2], message.data[3], message.data[4]));
        this.associations.sort(function (associationA, associationB) {
          return associationA.value - associationB.value;
        });
        break;
      case IPSProxy.PM_ASSOCIATIONREMOVED:
        let index = this.associations.findIndex(function (association, index) {
          if (association.value == message.data[1])
            return index;

          return -1;
        });
        if (index != -1)
          this.associations = this.associations.splice(index);
        break;
      case IPSProxy.PM_ASSOCIATIONCHANGED:
        this.associations.forEach(function (association) {
          if(association.value == message.data[1]) {
            association.name = message.data[2];
            association.icon = message.data[3];
            association.color = message.data[4];
          }
        });
        break;
    }
  }

  getAssociation(value) {
    if(this.associations.length == 0)
      return null; //throw 'Format error: No association items';

    switch(this.profileType) {
      case 0: //Boolean
        if(this.associations.length < 2)
          return null; //throw 'Format error: Invalid boolean association';

        if(value == true) {
          return this.associations[1];
        } else if(value == false) {
          return this.associations[0];
        } else {
          return null; //throw 'Format error: Invalid variable value';
        }
      case 1: //Integer
        for (let i = this.associations.length - 1; i >= 0; i--) {
          if(value >= Math.round(this.associations[i].value))
            return this.associations[i];
        }
        return null; //throw 'Format error: Association value out of bounds';
      case 2: //Float
        for (let i = this.associations.length - 1; i >= 0; i--) {
          //work around double precision comparison errors
          if(Math.round(value * Math.pow(10, this.digits))
            >= Math.round(this.associations[i].value * Math.pow(10, this.digits)))
          {
            return this.associations[i];
          }
        }
        return null; //throw 'Format error: Association value out of bounds';
      case 3: //String
        return null; //throw 'Format error: Associations are undefined for type string';
    }

    return null;
  }

  addPrefixSuffix(value) {
    return this.prefix + value + this.suffix;
  }

  getValueFormatted(value) {
    if(this.associations.length == 0) {

      //format for simple cases
      switch(this.profileType) {
        case 0: //Boolean
          if(value == true) {
            return this.addPrefixSuffix('true');
          } else if(value == false) {
            return this.addPrefixSuffix('false');
          } else {
            return 'Format error: Invalid variable value';
          }
        case 1: //Integer
          if((this.suffix.trim() == '%') && ((this.maxValue - this.minValue) > 0)) {
            return this.addPrefixSuffix(Math.round((value - this.minValue) * 100 / (this.maxValue - this.minValue)).toString());
          } else {
            return this.addPrefixSuffix(Math.round(value).toString());
          }
        case 2: //Float
          if((this.suffix.trim() == '%') && ((this.maxValue - this.minValue) > 0)) {
            return this.addPrefixSuffix(sprintf('%.'+this.digits.toString()+'f', ((Number(value) - this.minValue) * 100 / (this.maxValue - this.minValue))));
          } else {
            return this.addPrefixSuffix(sprintf('%.'+this.digits.toString()+'f', Number(value)));
          }
        case 3: //String
          return this.addPrefixSuffix(value);
        default:
          return 'Format error: Invalid variable type';
      }

    }  else {

      this.association = this.getAssociation(value);

      if(this.association == null)
        return 'Format error: Invalid profile association';

      //format association values
      try {
        switch(this.profileType) {
          case 0: //Boolean
            return this.addPrefixSuffix(this.association.name);
          case 1: //Integer
            return this.addPrefixSuffix(sprintf(this.association.name, Number(value)));
          case 2: //Float
            return this.addPrefixSuffix(sprintf(this.association.name, Number(value)));
          default:
            return 'Format error: Invalid variable type';
        }
      } catch(e) {
        return this.addPrefixSuffix(this.association.name);
      }

    }
  }
}
