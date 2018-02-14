import IPSVariableProfile from "../object/IPSVariableProfile";
import IPSObject from "../object/IPSObject";
import IPSCategory from "../object/IPSCategory";
import IPSInstance from "../object/IPSInstance";
import IPSVariable from "../object/IPSVariable";
import IPSScript from "../object/IPSScript";
import IPSEvent from "../object/IPSEvent";
import IPSMedia from "../object/IPSMedia";
import IPSLink from "../object/IPSLink";
import IPSMessage from "./IPSMessage";

let sprintf = require("node_modules/sprintf-js/dist/sprintf.min.js").sprintf;

export default class IPSProxy {
  // --- Message Constants
  // --- BASE MESSAGE
  static IPS_BASE = 10000;                             //Base Message

  static IPS_KERNELSHUTDOWN = IPSProxy.IPS_BASE + 1;            //Pre Shutdown Message, Runlevel UNINIT Follows

  // --- KERNEL
  static IPS_KERNELMESSAGE = IPSProxy.IPS_BASE + 100;           //Kernel Message
  static KR_CREATE = IPSProxy.IPS_KERNELMESSAGE + 1;            //Kernel is being created
  static KR_INIT = IPSProxy.IPS_KERNELMESSAGE + 2;              //Kernel Components are beeing initialised, Modules loaded, Settings read
  static KR_READY = IPSProxy.IPS_KERNELMESSAGE + 3;             //Kernel is ready and running
  static KR_UNINIT = IPSProxy.IPS_KERNELMESSAGE + 4;            //Got Shutdown Message, unloading all stuff
  static KR_SHUTDOWN = IPSProxy.IPS_KERNELMESSAGE + 5;          //Uninit Complete, Destroying Kernel Interface

  static IPS_LOGMESSAGE = IPSProxy.IPS_BASE + 200;              //Logmessage Message
  static KL_MESSAGE = IPSProxy.IPS_LOGMESSAGE + 1;              //Normal Message                      | FG: Black | BG: White  | STLYE : NONE
  static KL_SUCCESS = IPSProxy.IPS_LOGMESSAGE + 2;              //Success Message                     | FG: Black | BG: Green  | STYLE : NONE
  static KL_NOTIFY = IPSProxy.IPS_LOGMESSAGE + 3;               //Notify about Changes                | FG: Black | BG: Blue   | STLYE : NONE
  static KL_WARNING = IPSProxy.IPS_LOGMESSAGE + 4;              //Warnings                            | FG: Black | BG: Yellow | STLYE : NONE
  static KL_ERROR = IPSProxy.IPS_LOGMESSAGE + 5;                //Error Message                       | FG: Black | BG: Red    | STLYE : BOLD
  static KL_DEBUG = IPSProxy.IPS_LOGMESSAGE + 6;                //Debug Information + Script Results  | FG: Grey  | BG: White  | STLYE : NONE
  static KL_CUSTOM = IPSProxy.IPS_LOGMESSAGE + 7;               //User Message                        | FG: Black | BG: White  | STLYE : NONE

  // --- MODULE LOADER
  static IPS_MODULEMESSAGE = IPSProxy.IPS_BASE + 300;           //ModuleLoader Message
  static ML_LOAD = IPSProxy.IPS_MODULEMESSAGE + 1;              //Module loaded
  static ML_UNLOAD = IPSProxy.IPS_MODULEMESSAGE + 2;            //Module unloaded

  // --- OBJECT MANAGER
  static IPS_OBJECTMESSAGE = IPSProxy.IPS_BASE + 400;
  static OM_REGISTER = IPSProxy.IPS_OBJECTMESSAGE + 1;          //Object was registered
  static OM_UNREGISTER = IPSProxy.IPS_OBJECTMESSAGE + 2;        //Object was unregistered
  static OM_CHANGEPARENT = IPSProxy.IPS_OBJECTMESSAGE + 3;      //Parent was Changed
  static OM_CHANGENAME = IPSProxy.IPS_OBJECTMESSAGE + 4;        //Name was Changed
  static OM_CHANGEINFO = IPSProxy.IPS_OBJECTMESSAGE + 5;        //Info was Changed
  static OM_CHANGETYPE = IPSProxy.IPS_OBJECTMESSAGE + 6;        //Type was Changed
  static OM_CHANGESUMMARY = IPSProxy.IPS_OBJECTMESSAGE + 7;     //Summary was Changed
  static OM_CHANGEPOSITION = IPSProxy.IPS_OBJECTMESSAGE + 8;    //Position was Changed
  static OM_CHANGEREADONLY = IPSProxy.IPS_OBJECTMESSAGE + 9;    //ReadOnly was Changed
  static OM_CHANGEHIDDEN = IPSProxy.IPS_OBJECTMESSAGE + 10;     //Hidden was Changed
  static OM_CHANGEICON = IPSProxy.IPS_OBJECTMESSAGE + 11;       //Icon was Changed
  static OM_CHILDADDED = IPSProxy.IPS_OBJECTMESSAGE + 12;       //Child for Object was added
  static OM_CHILDREMOVED = IPSProxy.IPS_OBJECTMESSAGE + 13;     //Child for Object was removed
  static OM_CHANGEIDENT = IPSProxy.IPS_OBJECTMESSAGE + 14;      //Ident was Changed
  static OM_CHANGEDISABLED = IPSProxy.IPS_OBJECTMESSAGE + 15;   //Ident was Changed


  // --- INSTANCE MANAGER
  static IPS_INSTANCEMESSAGE = IPSProxy.IPS_BASE + 500;         //Instance Manager Message
  static IM_CREATE = IPSProxy.IPS_INSTANCEMESSAGE + 1;          //Instance created
  static IM_DELETE = IPSProxy.IPS_INSTANCEMESSAGE + 2;          //Instance deleted
  static IM_CONNECT = IPSProxy.IPS_INSTANCEMESSAGE + 3;         //Instance connected
  static IM_DISCONNECT = IPSProxy.IPS_INSTANCEMESSAGE + 4;      //Instance disconnected
  static IM_CHANGESTATUS = IPSProxy.IPS_INSTANCEMESSAGE + 5;    //Status was Changed
  static IM_CHANGESETTINGS = IPSProxy.IPS_INSTANCEMESSAGE + 6;  //Settings were Changed
  static IM_CHANGESEARCH = IPSProxy.IPS_INSTANCEMESSAGE + 7;    //Searching was started/stopped
  static IM_SEARCHUPDATE = IPSProxy.IPS_INSTANCEMESSAGE + 8;    //Searching found new results
  static IM_SEARCHPROGRESS = IPSProxy.IPS_INSTANCEMESSAGE + 9;  //Searching progress in %
  static IM_SEARCHCOMPLETE = IPSProxy.IPS_INSTANCEMESSAGE + 10; //Searching is complete

  // --- VARIABLE MANAGER
  static IPS_VARIABLEMESSAGE = IPSProxy.IPS_BASE + 600;              //Variable Manager Message
  static VM_CREATE = IPSProxy.IPS_VARIABLEMESSAGE + 1;               //Variable Created
  static VM_DELETE = IPSProxy.IPS_VARIABLEMESSAGE + 2;               //Variable Deleted
  static VM_UPDATE = IPSProxy.IPS_VARIABLEMESSAGE + 3;               //On Variable Update
  static VM_CHANGEPROFILENAME = IPSProxy.IPS_VARIABLEMESSAGE + 4;    //On Profile Name Change
  static VM_CHANGEPROFILEACTION = IPSProxy.IPS_VARIABLEMESSAGE + 5;  //On Profile Action Change

  // --- SCRIPT MANAGER
  static IPS_SCRIPTMESSAGE = IPSProxy.IPS_BASE + 700;           //Script Manager Message
  static SM_CREATE = IPSProxy.IPS_SCRIPTMESSAGE + 1;            //On Script Create
  static SM_DELETE = IPSProxy.IPS_SCRIPTMESSAGE + 2;            //On Script Delete
  static SM_CHANGEFILE = IPSProxy.IPS_SCRIPTMESSAGE + 3;        //On Script SetFile
  static SM_BROKEN = IPSProxy.IPS_SCRIPTMESSAGE + 4;            //Script Broken Status changed

  // --- EVENT MANAGER
  static IPS_EVENTMESSAGE = IPSProxy.IPS_BASE + 800;            //Event Scripter Message
  static EM_CREATE = IPSProxy.IPS_EVENTMESSAGE + 1;             //On Event Create
  static EM_DELETE = IPSProxy.IPS_EVENTMESSAGE + 2;             //On Event Delete
  static EM_UPDATE = IPSProxy.IPS_EVENTMESSAGE + 3;
  static EM_CHANGEACTIVE = IPSProxy.IPS_EVENTMESSAGE + 4;
  static EM_CHANGELIMIT = IPSProxy.IPS_EVENTMESSAGE + 5;
  static EM_CHANGESCRIPT = IPSProxy.IPS_EVENTMESSAGE + 6;
  static EM_CHANGETRIGGER = IPSProxy.IPS_EVENTMESSAGE + 7;
  static EM_CHANGETRIGGERVALUE = IPSProxy.IPS_EVENTMESSAGE + 8;
  static EM_CHANGETRIGGEREXECUTION = IPSProxy.IPS_EVENTMESSAGE + 9;
  static EM_CHANGECYCLIC = IPSProxy.IPS_EVENTMESSAGE + 10;
  static EM_CHANGECYCLICDATEFROM = IPSProxy.IPS_EVENTMESSAGE + 11;
  static EM_CHANGECYCLICDATETO = IPSProxy.IPS_EVENTMESSAGE + 12;
  static EM_CHANGECYCLICTIMEFROM = IPSProxy.IPS_EVENTMESSAGE + 13;
  static EM_CHANGECYCLICTIMETO = IPSProxy.IPS_EVENTMESSAGE + 14;
  static EM_ADDSCHEDULEACTION = IPSProxy.IPS_EVENTMESSAGE + 15;
  static EM_REMOVESCHEDULEACTION = IPSProxy.IPS_EVENTMESSAGE + 16;
  static EM_CHANGESCHEDULEACTION = IPSProxy.IPS_EVENTMESSAGE + 17;
  static EM_ADDSCHEDULEGROUP = IPSProxy.IPS_EVENTMESSAGE + 18;
  static EM_REMOVESCHEDULEGROUP = IPSProxy.IPS_EVENTMESSAGE + 19;
  static EM_CHANGESCHEDULEGROUP = IPSProxy.IPS_EVENTMESSAGE + 20;
  static EM_ADDSCHEDULEGROUPPOINT = IPSProxy.IPS_EVENTMESSAGE + 21;
  static EM_REMOVESCHEDULEGROUPPOINT = IPSProxy.IPS_EVENTMESSAGE + 22;
  static EM_CHANGESCHEDULEGROUPPOINT = IPSProxy.IPS_EVENTMESSAGE + 23;

  // --- MEDIA MANAGER
  static IPS_MEDIAMESSAGE = IPSProxy.IPS_BASE + 900;            //Media Manager Message
  static MM_CREATE = IPSProxy.IPS_MEDIAMESSAGE + 1;             //On Media Create
  static MM_DELETE = IPSProxy.IPS_MEDIAMESSAGE + 2;             //On Media Delete
  static MM_CHANGEFILE = IPSProxy.IPS_MEDIAMESSAGE + 3;         //On Media SetFile
  static MM_AVAILABLE = IPSProxy.IPS_MEDIAMESSAGE + 4;          //Media Available Status changed
  static MM_UPDATE = IPSProxy.IPS_MEDIAMESSAGE + 5;
  static MM_CHANGECACHED = IPSProxy.IPS_MEDIAMESSAGE + 6;

  // --- LINK MANAGER
  static IPS_LINKMESSAGE = IPSProxy.IPS_BASE + 1000;           //Link Manager Message
  static LM_CREATE = IPSProxy.IPS_LINKMESSAGE + 1;             //On Link Create
  static LM_DELETE = IPSProxy.IPS_LINKMESSAGE + 2;             //On Link Delete
  static LM_CHANGETARGET = IPSProxy.IPS_LINKMESSAGE + 3;       //On Link Change Target

  // --- FLOW HANDLER
  static IPS_FLOWMESSAGE = IPSProxy.IPS_BASE + 1100;            //Flow Handler Message
  static FM_CONNECT = IPSProxy.IPS_FLOWMESSAGE + 1;             //On Instance Connect
  static FM_DISCONNECT = IPSProxy.IPS_FLOWMESSAGE + 2;          //On Instance Disconnect

  // --- SCRIPT ENGINE
  static IPS_ENGINEMESSAGE = IPSProxy.IPS_BASE + 1200;           //Script Engine Message
  static SE_UPDATE = IPSProxy.IPS_ENGINEMESSAGE + 1;             //On Library Refresh
  static SE_EXECUTE = IPSProxy.IPS_ENGINEMESSAGE + 2;            //On Script Executed Delete
  static SE_RUNNING = IPSProxy.IPS_ENGINEMESSAGE + 3;            //On Script Executing Start

  // --- PROFILE POOL
  static IPS_PROFILEMESSAGE = IPSProxy.IPS_BASE + 1300;
  static PM_CREATE = IPSProxy.IPS_PROFILEMESSAGE + 1;
  static PM_DELETE = IPSProxy.IPS_PROFILEMESSAGE + 2;
  static PM_CHANGETEXT = IPSProxy.IPS_PROFILEMESSAGE + 3;
  static PM_CHANGEVALUES = IPSProxy.IPS_PROFILEMESSAGE + 4;
  static PM_CHANGEDIGITS = IPSProxy.IPS_PROFILEMESSAGE + 5;
  static PM_CHANGEICON = IPSProxy.IPS_PROFILEMESSAGE + 6;
  static PM_ASSOCIATIONADDED = IPSProxy.IPS_PROFILEMESSAGE + 7;
  static PM_ASSOCIATIONREMOVED = IPSProxy.IPS_PROFILEMESSAGE + 8;
  static PM_ASSOCIATIONCHANGED = IPSProxy.IPS_PROFILEMESSAGE + 9;

  // --- TIMER POOL
  static IPS_TIMERMESSAGE = IPSProxy.IPS_BASE + 1400;            //Timer Pool Message
  static TM_REGISTER = IPSProxy.IPS_TIMERMESSAGE + 1;
  static TM_UNREGISTER = IPSProxy.IPS_TIMERMESSAGE + 2;
  static TM_SETINTERVAL = IPSProxy.IPS_TIMERMESSAGE + 3;
  static TM_UPDATED = IPSProxy.IPS_TIMERMESSAGE + 4;
  static TM_EXECUTING = IPSProxy.IPS_TIMERMESSAGE + 5;

  // --- TInstanceStatus Constants

  // --- STATUS CODES
  static IS_SBASE = 100;
  static IS_CREATING = IPSProxy.IS_SBASE + 1; //module is being created
  static IS_ACTIVE = IPSProxy.IS_SBASE + 2;   //module created and running
  static IS_DELETING = IPSProxy.IS_SBASE + 3; //module us being deleted
  static IS_INACTIVE = IPSProxy.IS_SBASE + 4; //module is not beeing used

  // --- ERROR CODES
  static IS_EBASE = 200;               //default error code
  static IS_NOTCREATED = IPSProxy.IS_EBASE + 1; //instance could not be created

  // --- Search Handling
  static FOUND_UNKNOWN = 0;     //Undefined value
  static FOUND_NEW = 1;         //Device is new and not configured yet
  static FOUND_OLD = 2;         //Device is already configued (InstanceID should be set)
  static FOUND_CURRENT = 3;     //Device is already configued (InstanceID is from the current/searching Instance)
  static FOUND_UNSUPPORTED = 4; //Device is not supported by Module

  // --- WebFront Messages
  static WFC_BASE = 20100;
  static WFC_SEND_POPUP = IPSProxy.WFC_BASE + 1;
  static WFC_TEXT_NOTIFICATION = IPSProxy.WFC_BASE + 2;
  static WFC_AUDIO_NOTIFICATION = IPSProxy.WFC_BASE + 3;
  static WFC_SWITCH_PAGE = IPSProxy.WFC_BASE + 4;
  static WFC_RELOAD = IPSProxy.WFC_BASE + 5;
  static WFC_OPEN_CATEGORY = IPSProxy.WFC_BASE + 6;


  constructor(network, broadcaster) {
    this.network = network;
    this.broadcaster = broadcaster;
    this.objects = new Map();
    this.profiles = new Map();
    this.archive = new Map();
  }

  subscribe(callback) {
    return this.broadcaster.subscribe(callback);
  }

  unsubscribe(reference) {
    this.broadcaster.unsubscribe(reference);
  }

  loadSnapshot(progressCallback) {
    let context = this;
    return new Promise(function (resolve, reject) {
      context.network.makeRequest('IPS_GetSnapshot', [], progressCallback).then(function (snapshot) {

        if(snapshot['timestamp'] == null)
          throw 'Snapshot is missing timestamp';

        if(snapshot['objects'] == null)
          throw 'Snapshot is missing objects';

        if(snapshot['profiles'] == null)
          throw 'Snapshot is missing profiles';

        context.lastTimestamp = snapshot['timestamp'];

        //preprocess some data
        let objects = snapshot['objects'];
        for (let key in objects) {
          if (!objects.hasOwnProperty(key)) {
            continue;
          }

          let object = objects[key];

          object['id'] = Number.parseInt(key.substring(2));

          //fix up invalid type information for hidden and readonly field
          if(!Number.isNaN(object['hidden']))
            object['hidden'] = object['hidden'] != 0;
          if(!Number.isNaN(object['readOnly']))
            object['readOnly'] = object['readOnly'] != 0;

          //fix up invalid type information for variable value
          if(object['type'] == 2) {
            //if we are bool but have received an int
            if((object['data']['type'] == 0) && (!Number.isNaN(object['data']['value']))) {
              object['data']['value'] = false;
            }
            //if we are str but have received an int
            if((object['data']['type'] == 3) && (!Number.isNaN(object['data']['value']))) {
              object['data']['value'] = '';
            }
          }
        }

        //preprocess some data
        let archive = snapshot['archive'];
        for (let key in archive) {
          if (!archive.hasOwnProperty(key)) {
            continue;
          }

          let object = archive[key];
          let variableID = Number.parseInt(key.substring(2));

          context.archive.set(variableID, object);
        }

        /**
         *
         * We want to build the profile first, as the IPSVariable
         * is subscribing to existing profiles
         *
         */

        //build IPSVariableProfiles
        let profiles = snapshot['profiles'];
        for (let key in profiles) {
          if (!profiles.hasOwnProperty(key)) {
            continue;
          }

          let data = profiles[key];
          let profile = new IPSVariableProfile(key, data);
          context.profiles.set(profile.profileName, profile);
        }

        //build IPSObjects
        objects = snapshot['objects'];
        for (let key in objects) {
          if (!objects.hasOwnProperty(key)) {
            continue;
          }

          let data = objects[key];
          let object = null;

          switch(data['type']) {
            case 0:
              object = new IPSCategory(context, data);
              break;
            case 1:
              object = new IPSInstance(context, data);
              break;
            case 2:
              object = new IPSVariable(context, data);
              break;
            case 3:
              object = new IPSScript(context, data);
              break;
            case 4:
              object = new IPSEvent(context, data);
              break;
            case 5:
              object = new IPSMedia(context, data);
              break;
            case 6:
              object = new IPSLink(context, data);
              break;
            default:
              throw 'Proxy contains unknown object type';
          }
          context.objects.set(object.objectID, object);
        }

        //build children arrays
        context.objects.forEach(function (object) {
          if (object.objectID != 0) {
            context.objects.get(object.parentID).children.push(object);
          }
        });

        resolve(null);

      }, function (error) {
        reject(error);
      });
    });
  }

  loadSnapshotChanges() {
    let context = this;
    return new Promise(function (resolve, reject) {
      context.network.makeRequest(
        'IPS_GetSnapshotChanges',
        [context.lastTimestamp]
      ).then(function (snapshotChanges) {
        if(snapshotChanges.length > 0) {
          context.lastTimestamp = snapshotChanges[snapshotChanges.length - 1]['TimeStamp'];
          if(context.lastTimestamp == null)
            throw 'Snapshot is missing timestamp';

          //we take care of a special case where we just get the newest timestamp
          if(!((snapshotChanges.length == 1) && (snapshotChanges[snapshotChanges.length - 1]['Message'] == 0)))
            context.processSnapshotChanges(snapshotChanges);
        }

        resolve(null);
      }, function (error) {
        reject(error);
      });
    });
  }

  processSnapshotChanges(snapshotChanges) {
    snapshotChanges.forEach(function (message) {
      let m = new IPSMessage(message);
      //console.log("Timestamp: " + String(message['TimeStamp']) + ' > ' + IPSProxy.messageToString(m.message) + ' for ' + String(m.senderID) + ' > ' + m.data);

      //lets process CREATE and DELETE messages here
      switch(m.message) {
        case IPSProxy.OM_REGISTER:
          let object = {
            position: 0,
            readOnly: false,
            ident: "",
            hidden: false,
            disabled: false,
            type: 0,
            name: "",
            info: "",
            icon: "",
            parentID: 0,
            summary: ""
          };
          object['id'] = m.senderID;
          object['name'] = sprintf('Unnamed Object (ID: %d)', m.senderID);
          object['type'] = m.data[0];
          this.objects.set(m.senderID, new IPSObject(this, object));
          switch(m.data[0]) {
            case 0: /* Category */
              this.objects.set(m.senderID, new IPSCategory(this, object));
              break;
            case 1: /* Instance */
              object['data'] = {
                moduleType: 0,
                moduleName: "",
                connectionID: 0,
                moduleID: "",
                status: 0
              };
              this.objects.set(m.senderID, new IPSInstance(this, object));
              break;
            case 2: /* Variable */
              object['data'] = {
                action: 0,
                customAction: 0,
                profile: "",
                lastUpdate: 0,
                value: false,
                customProfile: "",
                lastChange: 0,
                type: 0,
                isLocked: false
              };
              this.objects.set(m.senderID, new IPSVariable(this, object));
              break;
            case 3: /* Script */
              object['data'] = {
                isBroken: false,
                lastExecute: 0,
                type: 0,
                file: ""
              };
              this.objects.set(m.senderID, new IPSScript(this, object));
              break;
            case 4: /* Event */
              object['data'] = {
                type: 0,
                active: false,
                limit: 0,
                script: "",
                lastRun: 0,
                nextRun: 0,
                triggerType: 1,
                triggerVariableID: 0,
                triggerValue: "",
                triggerSubsequentExecution: true
              };
              this.objects.set(m.senderID, new IPSEvent(this, object));
              break;
            case 5: /* Media */
              object['data'] = {
                lastUpdate: 0,
                type: 0,
                file: "",
                crc: "",
                size: 0,
                isAvailable: false
              };
              this.objects.set(m.senderID, new IPSMedia(this, object));
              break;
            case 6: /* Link */
              object['data'] = {
                targetID: 0
              };
              this.objects.set(m.senderID, new IPSLink(this, object));
              break;
          }
          break;
        case IPSProxy.OM_UNREGISTER:
          this.objects.delete(m.senderID);
          break;
        case IPSProxy.PM_CREATE:
          let profile = {
            associations: [],
            suffix: "",
            minValue: 0,
            prefix: "",
            maxValue: 0,
            digits: 0,
            stepSize: 0,
            type: 0,
            icon: ""
          };
          profile['type'] = m.data[1];
          this.profiles.set(m.data[0], new IPSVariableProfile(m.data[0], profile));
          break;
        case IPSProxy.PM_DELETE:
          this.profiles.delete(m.data[0]);
          break;
        default:
          //check for a profile message first
          if(IPSProxy.messageToString(m.message).startsWith("PM_")) {

            if(this.hasProfile(m.data[0])) {
              this.getProfile(m.data[0]).processMessage(m);
            }

            //forward to normal objects
          } else if(this.hasObject(m.senderID)) {

            this.getObject(m.senderID).processMessage(m);

          }
      }
      // Notify all observers
      this.broadcaster.send(m);
    }, this);
  }

  hasObject(objectID) {
    return this.objects.has(objectID);
  }

  getObject(objectID) {
    if (!this.hasObject(objectID))
      throw 'Cannot find object with ID ' + String(objectID);
    return this.objects.get(objectID);
  }

  getProfileNames(type) {
    let names = [];
    this.profiles.forEach( (profile) => {
      if ((type === undefined) || (type === profile.profileType)) {
        names.push(profile.profileName);
      }
    });
    return names;
  }

  hasProfile(profileName) {
    return this.profiles.has(profileName);
  }

  getProfile(profileName) {
    if(!this.hasProfile(profileName))
      throw 'Cannot find profile with name ' + profileName;

    return this.profiles.get(profileName);
  }

  getFirstObjectIDByGUID(guid) {
    let result = -1;
    this.objects.forEach( (object) => {
      if (result !== -1) {
        return;
      }
      if ((typeof object.moduleID === 'string') && (object.moduleID.valueOf() === guid.valueOf())) {
        result = object.objectID;
      }
    });
    if (result !== -1) {
      return result;
    }
    else {
      throw ("Object not found by GUID: " + guid);
    }
  }

  getObjectLocation(objectID) {
    let context = this;
    let buildString = function(currentID) {
      if (currentID !== 0) {
        try {
          let object = context.getObject(currentID);
          let parentName = buildString(object.parentID);
          if (parentName === '') {
            return object.objectName;
          } else {
            return parentName + '\\' + object.objectName;
          }
        } catch (error) {
          return 'INVALID PARENT';
        }
      } else {
        return '';
      }
    };

    try {
      let object = this.getObject(objectID);
      let ret = '';
      if (objectID === 0) {
        ret = 'None';
      } else {
        ret = object.objectName;
      }

      if (object.parentID === 0) {
        return ret;
      } else {
        return buildString(object.parentID) + '\\' + ret;
      }
    } catch (error) {
      return 'Object ' + objectID + ' does not exist';
    }
  }

  static messageToString(message) {
    switch(message)
    {
      case IPSProxy.IPS_BASE:
        return "IPS_BASE";
      /*
       case IPSProxy.IPS_KERNELSHUTDOWN:
       return "IPS_KERNELSHUTDOWN";
       case IPSProxy.IPS_KERNELSTARTED:
       return "IPS_KERNELSTARTED";
       */
      case IPSProxy.IPS_KERNELMESSAGE:
        return "IPS_KERNELMESSAGE";
      // --- KERNEL
      case IPSProxy.KR_CREATE:
        return "KR_CREATE";
      case IPSProxy.KR_INIT:
        return "KR_INIT";
      case IPSProxy.KR_READY:
        return "KR_READY";
      case IPSProxy.KR_UNINIT:
        return "KR_UNINIT";
      case IPSProxy.KR_SHUTDOWN:
        return "KR_SHUTDOWN";
      case IPSProxy.IPS_LOGMESSAGE:
        return "IPS_LOGMESSAGE";
      case IPSProxy.KL_MESSAGE:
        return "KL_MESSAGE";
      case IPSProxy.KL_SUCCESS:
        return "KL_SUCCESS";
      case IPSProxy.KL_NOTIFY:
        return "KL_NOTIFY";
      case IPSProxy.KL_WARNING:
        return "KL_WARNING";
      case IPSProxy.KL_ERROR:
        return "KL_ERROR";
      case IPSProxy.KL_DEBUG:
        return "KL_DEBUG";
      case IPSProxy.KL_CUSTOM:
        return "KL_CUSTOM";
      // --- MODULE LOADER
      case IPSProxy.IPS_MODULEMESSAGE:
        return "IPS_MODULEMESSAGE";
      case IPSProxy.ML_LOAD:
        return "ML_LOAD";
      case IPSProxy.ML_UNLOAD:
        return "ML_UNLOAD";
      // --- OBJECT MANAGER
      case IPSProxy.IPS_OBJECTMESSAGE:
        return "IPS_OBJECTMESSAGE";
      case IPSProxy.OM_REGISTER:
        return "OM_REGISTER";
      case IPSProxy.OM_UNREGISTER:
        return "OM_UNREGISTER";
      case IPSProxy.OM_CHANGEPARENT:
        return "OM_CHANGEPARENT";
      case IPSProxy.OM_CHANGENAME:
        return "OM_CHANGENAME";
      case IPSProxy.OM_CHANGEINFO:
        return "OM_CHANGEINFO";
      case IPSProxy.OM_CHANGETYPE:
        return "OM_CHANGETYPE";
      case IPSProxy.OM_CHANGESUMMARY:
        return "OM_CHANGESUMMARY";
      case IPSProxy.OM_CHANGEPOSITION:
        return "OM_CHANGEPOSITION";
      case IPSProxy.OM_CHANGEREADONLY:
        return "OM_CHANGEREADONLY";
      case IPSProxy.OM_CHANGEHIDDEN:
        return "OM_CHANGEHIDDEN";
      case IPSProxy.OM_CHANGEICON:
        return "OM_CHANGEICON";
      case IPSProxy.OM_CHILDADDED:
        return "OM_CHILDADDED";
      case IPSProxy.OM_CHILDREMOVED:
        return "OM_CHILDREMOVED";
      case IPSProxy.OM_CHANGEIDENT:
        return "OM_CHANGEIDENT";
      case IPSProxy.OM_CHANGEDISABLED:
        return "OM_CHANGEDISABLED";
      // --- INSTANCE MANAGER
      case IPSProxy.IPS_INSTANCEMESSAGE:
        return "IPS_INSTANCEMESSAGE";
      case IPSProxy.IM_CREATE:
        return "IM_CREATE";
      case IPSProxy.IM_DELETE:
        return "IM_DELETE";
      case IPSProxy.IM_CONNECT:
        return "IM_CONNECT";
      case IPSProxy.IM_DISCONNECT:
        return "IM_DISCONNECT";
      case IPSProxy.IM_CHANGESTATUS:
        return "IM_CHANGESTATUS";
      case IPSProxy.IM_CHANGESETTINGS:
        return "IM_CHANGESETTINGS";
      /*
       case IPSProxy.IM_CHANGESEARCH:
       return "IM_CHANGESEARCH";
       case IPSProxy.IM_SEARCHUPDATE:
       return "IM_SEARCHUPDATE";
       case IPSProxy.IM_SEARCHPROGRESS:
       return "IM_SEARCHPROGRESS";
       case IPSProxy.IM_SEARCHCOMPLETE:
       return "IM_SEARCHCOMPLETE";
       */
      // --- VARIABLE MANAGER
      case IPSProxy.IPS_VARIABLEMESSAGE:
        return "IPS_VARIABLEMESSAGE";
      case IPSProxy.VM_CREATE:
        return "VM_CREATE";
      case IPSProxy.VM_DELETE:
        return "VM_DELETE";
      case IPSProxy.VM_UPDATE:
        return "VM_UPDATE";
      case IPSProxy.VM_CHANGEPROFILENAME:
        return "VM_CHANGEPROFILENAME";
      case IPSProxy.VM_CHANGEPROFILEACTION:
        return "VM_CHANGEPROFILEACTION";
      // --- SCRIPT MANAGER
      case IPSProxy.IPS_SCRIPTMESSAGE:
        return "IPS_SCRIPTMESSAGE";
      case IPSProxy.SM_CREATE:
        return "SM_CREATE";
      case IPSProxy.SM_DELETE:
        return "SM_DELETE";
      case IPSProxy.SM_CHANGEFILE:
        return "SM_CHANGEFILE";
      case IPSProxy.SM_BROKEN:
        return "SM_BROKEN";
      // --- EVENT MANAGER
      case IPSProxy.IPS_EVENTMESSAGE:
        return "IPS_EVENTMESSAGE";
      case IPSProxy.EM_CREATE:
        return "EM_CREATE";
      case IPSProxy.EM_DELETE:
        return "EM_DELETE";
      case IPSProxy.EM_UPDATE:
        return "EM_UPDATE";
      case IPSProxy.EM_CHANGEACTIVE:
        return "EM_CHANGEACTIVE";
      case IPSProxy.EM_CHANGELIMIT:
        return "EM_CHANGELIMIT";
      case IPSProxy.EM_CHANGESCRIPT:
        return "EM_CHANGESCRIPT";
      case IPSProxy.EM_CHANGETRIGGER:
        return "EM_CHANGETRIGGER";
      case IPSProxy.EM_CHANGETRIGGERVALUE:
        return "EM_CHANGETRIGGERVALUE";
      case IPSProxy.EM_CHANGETRIGGEREXECUTION:
        return "EM_CHANGETRIGGEREXECUTION";
      case IPSProxy.EM_CHANGECYCLIC:
        return "EM_CHANGECYCLIC";
      case IPSProxy.EM_CHANGECYCLICDATEFROM:
        return "EM_CHANGECYCLICDATEFROM";
      case IPSProxy.EM_CHANGECYCLICDATETO:
        return "EM_CHANGECYCLICDATETO";
      case IPSProxy.EM_CHANGECYCLICTIMEFROM:
        return "EM_CHANGECYCLICTIMEFROM";
      case IPSProxy.EM_CHANGECYCLICTIMETO:
        return "EM_CHANGECYCLICTIMETO";
      case IPSProxy.EM_ADDSCHEDULEACTION:
        return "EM_ADDSCHEDULEACTION";
      case IPSProxy.EM_REMOVESCHEDULEACTION:
        return "EM_REMOVESCHEDULEACTION";
      case IPSProxy.EM_CHANGESCHEDULEACTION:
        return "EM_CHANGESCHEDULEACTION";
      case IPSProxy.EM_ADDSCHEDULEGROUP:
        return "EM_ADDSCHEDULEGROUP";
      case IPSProxy.EM_REMOVESCHEDULEGROUP:
        return "EM_REMOVESCHEDULEGROUP";
      case IPSProxy.EM_CHANGESCHEDULEGROUP:
        return "EM_CHANGESCHEDULEGROUP";
      case IPSProxy.EM_ADDSCHEDULEGROUPPOINT:
        return "EM_ADDSCHEDULEGROUPPOINT";
      case IPSProxy.EM_REMOVESCHEDULEGROUPPOINT:
        return "EM_REMOVESCHEDULEGROUPPOINT";
      case IPSProxy.EM_CHANGESCHEDULEGROUPPOINT:
        return "EM_CHANGESCHEDULEGROUPPOINT";
      // --- MEDIA MANAGER
      case IPSProxy.IPS_MEDIAMESSAGE:
        return "IPS_MEDIAMESSAGE";
      case IPSProxy.MM_CREATE:
        return "MM_CREATE";
      case IPSProxy.MM_DELETE:
        return "MM_DELETE";
      case IPSProxy.MM_CHANGEFILE:
        return "MM_CHANGEFILE";
      case IPSProxy.MM_AVAILABLE:
        return "MM_AVAILABLE";
      case IPSProxy.MM_UPDATE:
        return "MM_UPDATE";
      // --- LINK MANAGER
      case IPSProxy.IPS_LINKMESSAGE:
        return "IPS_LINKMESSAGE";
      case IPSProxy.LM_CREATE:
        return "LM_CREATE";
      case IPSProxy.LM_DELETE:
        return "LM_DELETE";
      case IPSProxy.LM_CHANGETARGET:
        return "LM_CHANGETARGET";
      // --- FLOW HANDLER
      case IPSProxy.IPS_FLOWMESSAGE:
        return "IPS_FLOWMESSAGE";
      case IPSProxy.FM_CONNECT:
        return "FM_CONNECT";
      case IPSProxy.FM_DISCONNECT:
        return "FM_DISCONNECT";
      // --- SCRIPT ENGINE
      case IPSProxy.IPS_ENGINEMESSAGE:
        return "IPS_ENGINEMESSAGE";
      case IPSProxy.SE_UPDATE:
        return "SE_UPDATE";
      case IPSProxy.SE_EXECUTE:
        return "SE_EXECUTE";
      case IPSProxy.SE_RUNNING:
        return "SE_RUNNING";
      // --- PROFILE POOL
      case IPSProxy.IPS_PROFILEMESSAGE:
        return "IPS_PROFILEMESSAGE";
      case IPSProxy.PM_CREATE:
        return "PM_CREATE";
      case IPSProxy.PM_DELETE:
        return "PM_DELETE";
      case IPSProxy.PM_CHANGETEXT:
        return "PM_CHANGETEXT";
      case IPSProxy.PM_CHANGEVALUES:
        return "PM_CHANGEVALUES";
      case IPSProxy.PM_CHANGEDIGITS:
        return "PM_CHANGEDIGITS";
      case IPSProxy.PM_CHANGEICON:
        return "PM_CHANGEICON";
      case IPSProxy.PM_ASSOCIATIONADDED:
        return "PM_ASSOCIATIONADDED";
      case IPSProxy.PM_ASSOCIATIONREMOVED:
        return "PM_ASSOCIATIONREMOVED";
      case IPSProxy.PM_ASSOCIATIONCHANGED:
        return "PM_ASSOCIATIONCHANGED";
      // --- WEBFRONT CONFIGURATOR
      case IPSProxy.WFC_SEND_POPUP:
        return "WFC_POPUP";
      case IPSProxy.WFC_TEXT_NOTIFICATION:
        return "WFC_TEXT_NOTIFICATION";
      case IPSProxy.WFC_AUDIO_NOTIFICATION:
        return "WFC_AUDIO_NOTIFICATION";
      case IPSProxy.WFC_SWITCH_PAGE:
        return "WFC_SWITCHPAGE";
      case IPSProxy.WFC_RELOAD:
        return "WFC_RELOAD";
      default:
        return "Unknown message " + String(message);
    }
  }

  setUrl(url) {
    this.network.setUrl(url);
  }

  setCredentials(username, password) {
    this.network.setCredentials(username, password);
  }

  makeRequest(method, params, progressCallback) {
    return this.network.makeRequest(method, params, progressCallback);
  }
}