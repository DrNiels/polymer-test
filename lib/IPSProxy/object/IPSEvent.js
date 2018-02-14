import IPSObject from "./IPSObject";
import Comparable from "./Comparable";
import IPSProxy from "../network/IPSProxy";
import Comparators from "../util/Comparators";
import DateUtils from "../util/DateUtils";
import ArrayUtils from "../util/ArrayUtils";

let sprintf = require("node_modules/sprintf-js/dist/sprintf.min.js").sprintf;

class IPSEventDate {
  constructor(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
  }
}

class IPSEventTime {
  constructor(hour, minute, second) {
    this.hour = hour;
    this.minute = minute;
    this.second = second;
  }
}

class IPSEventAction {
  constructor(id, name, color, scriptText) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.scriptText = scriptText;
  }
}

class IPSEventGroup {
  constructor(id, days, points) {
    this.id = id;
    this.days = days;
    this.points = points;
  }
}

class IPSEventPoint extends Comparable {
  constructor(id, start, actionID) {
    super();
    this.id = id;
    this.start = start;
    this.actionID = actionID;
  }

  compareTo(other) {
    let thisTime = (this.start.hour * 60 * 60) + (this.start.minute * 60) + this.start.second;
    let otherTime = (other.start.hour * 60 * 60) + (other.start.minute * 60) + other.start.second;

    return thisTime - otherTime;
  }
}

export default class IPSEvent extends IPSObject {
  //trigger type
  static evtOnUpdate = 0;
  static evtOnChange = 1;
  static evtOnLimitExceed = 2;
  static evtOnLimitDrop = 3;
  static evtOnValue = 4;

  //cyclic date type
  static cdtNone = 0;
  static cdtOnce = 1;
  static cdtDay = 2;
  static cdtWeek = 3;
  static cdtMonth = 4;
  static cdtYear = 5;

  //cyclic time type
  static cttOnce = 0;
  static cttSecond = 1;
  static cttMinute = 2;
  static cttHour = 3;

  static etTrigger = 0;
  static etCyclic = 1;
  static etSchedule = 2;

  constructor(proxy, object) {
    super(proxy, object);

    this.eventType = object['data']['type'];
    this.eventActive = object['data']['active'];
    this.eventLimit = object['data']['limit'];
    this.eventScript = object['data']['script'];

    this.triggerType = IPSEvent.evtOnUpdate;
    this.triggerVariableID = 0;
    this.triggerValue = '';
    this.triggerSubsequentExecution = true;

    this.cyclicDateType = IPSEvent.cdtNone;
    this.cyclicDateValue = 0;
    this.cyclicDateDay = 0;
    this.cyclicDateDayValue = 0;
    this.cyclicDateFrom = new IPSEventDate(0, 0, 0);
    this.cyclicDateTo = new IPSEventDate(0, 0, 0);
    this.cyclicTimeType = IPSEvent.cttOnce;
    this.cyclicTimeFrom = new IPSEventTime(0, 0, 0);
    this.cyclicTimeTo = new IPSEventTime(0, 0, 0);

    this.scheduleGroups = [];
    this.scheduleActions = [];

    this.lastRun = object['data']['lastRun'];
    this.nextRun = object['data']['nextRun'];

    switch (this.eventType) {
      case IPSEvent.etTrigger: //Trigger
        this.triggerType = object['data']['triggerType'];
        this.triggerVariableID = object['data']['triggerVariableID'];
        this.triggerValue = object['data']['triggerValue'];
        this.triggerSubsequentExecution = object['data']['triggerSubsequentExecution'];
        break;
      case IPSEvent.etCyclic: //Cyclic
        this.cyclicDateType = object['data']['cyclicDateType'];
        this.cyclicDateValue = object['data']['cyclicDateValue'];
        this.cyclicDateDay = object['data']['cyclicDateDay'];
        this.cyclicDateDayValue = object['data']['cyclicDateDayValue'];
        this.cyclicDateFrom.day = object['data']['cyclicDateFrom']['day'];
        this.cyclicDateFrom.month = object['data']['cyclicDateFrom']['month'];
        this.cyclicDateFrom.year = object['data']['cyclicDateFrom']['year'];
        this.cyclicDateTo.day = object['data']['cyclicDateTo']['day'];
        this.cyclicDateTo.month = object['data']['cyclicDateTo']['month'];
        this.cyclicDateTo.year = object['data']['cyclicDateTo']['year'];
        this.cyclicTimeType = object['data']['cyclicTimeType'];
        this.cyclicTimeValue = object['data']['cyclicTimeValue'];
        this.cyclicTimeFrom.hour = object['data']['cyclicTimeFrom']['hour'];
        this.cyclicTimeFrom.minute = object['data']['cyclicTimeFrom']['minute'];
        this.cyclicTimeFrom.second = object['data']['cyclicTimeFrom']['second'];
        this.cyclicTimeTo.hour = object['data']['cyclicTimeTo']['hour'];
        this.cyclicTimeTo.minute = object['data']['cyclicTimeTo']['minute'];
        this.cyclicTimeTo.second = object['data']['cyclicTimeTo']['second'];
        break;
      case IPSEvent.etSchedule: //Schedule
        for (let scheduleAction of object['data']['scheduleActions']){
          let newAction = new IPSEventAction(
            scheduleAction['id'],
            scheduleAction['name'],
            scheduleAction['color'],
            scheduleAction['scriptText']
          );

          this.scheduleActions.push(newAction);
        }
        for (let scheduleGroup of object['data']['scheduleGroups']){
          let newGroup = new IPSEventGroup(scheduleGroup['id'], scheduleGroup['days'], []);

          for (let point of scheduleGroup['points']){
            let newStart = new IPSEventTime(point['start']['hour'], point['start']['minute'], point['start']['second']);
            let newPoint = new IPSEventPoint(point['id'], newStart, point['actionID']);
            newGroup.points.push(newPoint);
          }
          this.scheduleGroups.push(newGroup);
        }
        break;
    }
  }

  processMessage(message) {
    // Variables that are assigned in different case blocks have to be declared outside
    // of the switch block, because apparently case blocks are not properly scoped in
    // Javascript.
    let changedScheduleGroup = null;

    switch(message.message) {
      case IPSProxy.EM_CREATE:
        this.eventType = message.data[0];
        break;
      case IPSProxy.EM_UPDATE:
        this.lastRun = message.data[0];
        this.nextRun = message.data[1];
        break;
      case IPSProxy.EM_CHANGEACTIVE:
        this.eventActive = message.data[0];
        break;
      case IPSProxy.EM_CHANGELIMIT:
        this.eventLimit = message.data[0];
        break;
      case IPSProxy.EM_CHANGESCRIPT:
        this.eventScript = message.data[0];
        break;
      case IPSProxy.EM_CHANGETRIGGER:
        this.triggerType = message.data[0];
        this.triggerVariableID = message.data[1];
        break;
      case IPSProxy.EM_CHANGETRIGGERVALUE:
        this.triggerValue = message.data[0];
        break;
      case IPSProxy.EM_CHANGETRIGGEREXECUTION:
        this.triggerSubsequentExecution = message.data[0];
        break;
      case IPSProxy.EM_CHANGECYCLIC:
        this.cyclicDateType = message.data[0];
        this.cyclicDateValue = message.data[1];
        this.cyclicDateDay = message.data[2];
        this.cyclicDateDayValue = message.data[3];
        this.cyclicTimeType = message.data[4];
        this.cyclicTimeValue = message.data[5];
        break;
      case IPSProxy.EM_CHANGECYCLICDATEFROM:
        this.cyclicDateFrom.day = message.data[0];
        this.cyclicDateFrom.month = message.data[1];
        this.cyclicDateFrom.year = message.data[2];
        break;
      case IPSProxy.EM_CHANGECYCLICDATETO:
        this.cyclicDateTo.day = message.data[0];
        this.cyclicDateTo.month = message.data[1];
        this.cyclicDateTo.year = message.data[2];
        break;
      case IPSProxy.EM_CHANGECYCLICTIMEFROM:
        this.cyclicTimeFrom.hour = message.data[0];
        this.cyclicTimeFrom.minute = message.data[1];
        this.cyclicTimeFrom.second = message.data[2];
        break;
      case IPSProxy.EM_CHANGECYCLICTIMETO:
        this.cyclicTimeTo.hour = message.data[0];
        this.cyclicTimeTo.minute = message.data[1];
        this.cyclicTimeTo.second = message.data[2];
        break;
      case IPSProxy.EM_ADDSCHEDULEACTION:
        let newScheduleAction = new IPSEventAction(message.data[0], message.data[1], message.data[2], message.data[3]);
        this.scheduleActions.push(newScheduleAction);
        break;
      case IPSProxy.EM_REMOVESCHEDULEACTION:
        this.scheduleActions = ArrayUtils.findAndRemoveFromArray(
          function (element) {
            return element.id == message.data[0];
          }
        );
        break;
      case IPSProxy.EM_CHANGESCHEDULEACTION:
        let changedScheduleAction = ArrayUtils.findFirst(
          this.scheduleActions,
          function (element) {
            return element.id == message.data[0];
          },
          null
        );
        if (changedScheduleAction != null){
          changedScheduleAction.name = message.data[1];
          changedScheduleAction.color = message.data[2];
          changedScheduleAction.scriptText = message.data[3];
        }
        break;
      case IPSProxy.EM_ADDSCHEDULEGROUP:
        let newScheduleGroup = new IPSEventGroup(message.data[0], message.data[1], []);
        this.scheduleGroups.push(newScheduleGroup);
        break;
      case IPSProxy.EM_REMOVESCHEDULEGROUP:
        this.scheduleGroups = ArrayUtils.findAndRemoveFromArray(
          this.scheduleGroups,
          function (element) {
            return element.id == message.data[0];
          }
        );
        break;
      case IPSProxy.EM_CHANGESCHEDULEGROUP:
        changedScheduleGroup = ArrayUtils.findFirst(
          this.scheduleActions,
          function (element) {
            return element.id == message.data[0];
          },
          null
        );
        if (changedScheduleGroup != null){
          changedScheduleGroup.days = message.data[1];
        }
        break;
      case IPSProxy.EM_ADDSCHEDULEGROUPPOINT:
        let newScheduleTime = new IPSEventTime(message.data[2], message.data[3], message.data[4]);
        let newSchedulePoint = new IPSEventPoint(message.data[1], newScheduleTime, message.data[5]);

        changedScheduleGroup = ArrayUtils.findFirst(
          this.scheduleActions,
          function (element) {
            return element.id == message.data[0];
          },
          null
        );
        if (changedScheduleGroup != null){
          changedScheduleGroup.points.push(newSchedulePoint);
        }

        break;
      case IPSProxy.EM_REMOVESCHEDULEGROUPPOINT:
        changedScheduleGroup = ArrayUtils.findFirst(
          this.scheduleActions,
          function (element) {
            return element.id == message.data[0];
          },
          null
        );
        if (changedScheduleGroup != null){
          changedScheduleGroup.points = ArrayUtils.findAndRemoveFromArray(
            changedScheduleGroup.points,
            function(element) {
              return element.id == message.data[1];
            }
          );
        }
        break;
      case IPSProxy.EM_CHANGESCHEDULEGROUPPOINT:
        changedScheduleGroup = ArrayUtils.findFirst(
          this.scheduleActions,
          function (element) {
            return element.id == message.data[0];
          },
          null
        );
        if (changedScheduleGroup != null){
          let changedSchedulePoint = ArrayUtils.findFirst(
            this.scheduleActions,
            function (element) {
              return element.id == message.data[1];
            },
            null
          );
          if (changedSchedulePoint != null){
            changedSchedulePoint.start.hour = message.data[2];
            changedSchedulePoint.start.minute = message.data[3];
            changedSchedulePoint.start.second = message.data[4];
            changedSchedulePoint.actionID = message.data[5];
          }
        }
        break;
    }

    super.processMessage(message);
  }

  compareTo(other) {
    //position is more important
    if(this.objectPosition == other.objectPosition) {
      //if the other object is an event use our special comparator
      if((other instanceof IPSEvent)) {
        if(this.eventType != other.eventType)
          return Comparators.compareNumber(this.eventType, other.eventType);

        //Trigger
        if(this.eventType == IPSEvent.etTrigger) {
          if(this.triggerType != other.triggerType)
            return Comparators.compareNumber(this.triggerType, other.triggerType);

          if(this.triggerVariableID != other.triggerVariableID)
            return Comparators.compareNumber(this.triggerVariableID, other.triggerVariableID);
        }

        //Cyclic
        if(this.eventType == IPSEvent.etCyclic) {
          if(this.cyclicDateType != other.cyclicDateType)
            return Comparators.compareNumber(this.cyclicDateType, other.cyclicDateType);

          if(this.cyclicTimeType != other.cyclicTimeType)
            return Comparators.compareNumber(this.cyclicTimeType, other.cyclicTimeType);
        }

        //Schedule
        if(this.eventType == IPSEvent.etSchedule) {
          //FIXME: Can we compare schedules?
        }
      }
    }

    //fallback to default comparator
    return super.compareTo(other);
  }
  toString() {
    let nextRun = new Date(this.nextRun * 1000);
    let now = Date.now();

    let runDay = new Date.UTC(nextRun.year, nextRun.month, nextRun.day);
    let today = new Date.UTC(now.year, now.month, now.day);
    let tomorrow = new Date.UTC(now.year, now.month, now.day+1);

    let dateString = DateUtils.formatDateUTC(nextRun);

    let timeString = DateUtils.formatTimeUTC(nextRun);
    if(this.cyclicTimeType == 1 /* Second */) {
      timeString = DateUtils.formatTimeWithSecondsUTC(nextRun);
    }

    if(this.nextRun == 0) {
      return '-';
    } else if(DateUtils.isSameDay(runDay, today)) {
      return sprintf('Today, %s', timeString);
    } else if(DateUtils.isSameDay(runDay, tomorrow)) {
      return sprintf('Tomorrow, %s', timeString);
    } else {
      return sprintf('%s, %s', dateString, timeString);
    }
  }

  getDescription() {

  }

  getName(varName = '') {
    let triggerTypeToNiceString = function(triggerType) {
      switch (triggerType) {
        case IPSEvent.evtOnUpdate:
          return 'On Variable Update';
        case IPSEvent.evtOnChange:
          return 'On Variable Change';
        case IPSEvent.evtOnLimitExceed:
          return 'On Limit Exceeded';
        case IPSEvent.evtOnLimitDrop:
          return 'On Limit Drop';
        case IPSEvent.evtOnValue:
          return 'On specific value';
        default:
          return '';
      }
    };

    let getDays = function(value) {
      if (value == null) {
        return '???';
      }
      let daysText = '';
      let add = function (string) {
        if (daysText.length < 1) {
          daysText = string;
        } else {
          daysText += ', ' + string;
        }
      };
      if (value > 0)
        add('Mon');
      if ((value << 1) > 0)
        add('Tue');
      if ((value << 2) > 0)
        add('Wed');
      if ((value << 3) > 0)
        add('Thu');
      if ((value << 4) > 0)
        add('Fri');
      if ((value << 5) > 0)
        add('Sat');
      if ((value << 6) > 0)
        add('Sun');

      return daysText.length < 1 ? '???' : daysText;
    };

    let getMonthDays = function (value) {
      if (value === 0) {
        return 'day';
      } else {
        return getDays(value);
      }
    };

    let getMonthDayValue = function (value, dateDay) {
      if (dateDay === 0) {
        if (value > 31) {
          return 'last';
        } else {
          return String(value) + '.';
        }
      } else {
        if (value > 5) {
          return 'last';
        } else {
          return String(value) + '.';
        }
      }
    };

    switch (this.eventType) {
      case IPSEvent.etTrigger:
        let triggerTypeString = triggerTypeToNiceString(this.triggerType);
        if (this.triggerValue  == null) {
          this.triggerValue = '???';
        }

        switch (this.triggerType) {
          case IPSEvent.evtOnUpdate:
          case IPSEvent.evtOnChange:
            return triggerTypeString + ' for Variable "' + varName + '"';
          case IPSEvent.evtOnLimitExceed:
          case IPSEvent.evtOnLimitDrop:
          case IPSEvent.evtOnValue:
            return triggerTypeString + ' for Variable "' + varName + '" with Limit ' + this.triggerValue;
        }
        break;

      case IPSEvent.etCyclic:
        let datePattern = '';
        let timePattern = '';

        switch (this.cyclicDateType) {
          case IPSEvent.cdtNone:
            datePattern = 'Daily';
            break;
          case IPSEvent.cdtOnce:
            datePattern = sprintf('On %02d.%02d.%04d',
              this.cyclicDateFrom.day, this.cyclicDateFrom.month, this.cyclicDateFrom.year);
            break;
          case IPSEvent.cdtDay:
            datePattern = sprintf('Every %d day(s)', this.cyclicDateValue);
            break;
          case IPSEvent.cdtWeek:
            if (this.cyclicDateDay === 0) {
              datePattern = sprintf('Every %d week(s) on no day', this.cyclicDateValue);
            } else {
              datePattern = sprintf('Every %d week(s) on %s', this.cyclicDateValue, getDays(this.cyclicDateDay));
            }
            break;
        }

        switch (this.cyclicTimeType) {
          case IPSEvent.cttOnce:
            timePattern = sprintf('at %02d:%02d:%02d',
              this.cyclicTimeFrom.hour, this.cyclicTimeFrom.minute, this.cyclicTimeFrom.second);
            break;
          case IPSEvent.cttSecond:
            timePattern = sprintf('every %d second(s)', this.cyclicTimeValue);
            break;
          case IPSEvent.cttMinute:
            timePattern = sprintf('every %d minute(s)', this.cyclicTimeValue);
            break;
          case IPSEvent.cttHour:
            timePattern = sprintf('every %d hour(s)', this.cyclicTimeValue);
            break;
        }

        return datePattern + ' ' + timePattern;
        break;
      case IPSEvent.etSchedule:
        let resString = 'Schedule event';

        if (this.scheduleGroups.length > 0) {
          resString += ' (' + getDays(this.scheduleGroups[0].days);
          for (let i = 1; i < this.scheduleGroups.length - 1; i++) {
            resString += ' | ' + getDays(this.scheduleGroups[i].days);
          }
          resString +=')';
        }

        return resString;
    }

    // Fallback
    return 'Unknown Event Type';
  }
}
