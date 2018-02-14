export default class IPSIcons {
  static getIconList() {
    let icons = new Map();
    icons['Aircraft'] = [];

    icons['Alert'] = [];

    icons['ArrowRight'] = [];

    icons['Backspace'] = [];

    icons['Basement'] = [];

    icons['Battery'] = [];
    icons['Battery'].push(0);
    icons['Battery'].push(50);
    icons['Battery'].push(100);

    icons['Bed'] = [];

    icons['Bulb'] = [];

    icons['Calendar'] = [];

    icons['Camera'] = [];

    icons['Car'] = [];

    icons['Caret'] = [];

    icons['Cat'] = [];

    icons['Climate'] = [];

    icons['Clock'] = [];

    icons['Close'] = [];

    icons['CloseAll'] = [];

    icons['Cloud'] = [];

    icons['Cocktail'] = [];

    icons['Cross'] = [];

    icons['Database'] = [];

    icons['Dining'] = [];

    icons['Distance'] = [];

    icons['DoctorBag'] = [];

    icons['Dog'] = [];

    icons['Dollar'] = [];

    icons['Drops'] = [];

    icons['Duck'] = [];

    icons['Edit'] = [];

    icons['Electricity'] = [];

    icons['ErlenmeyerFlask'] = [];

    icons['Euro'] = [];

    icons['Execute'] = [];

    icons['Eyes'] = [];
    icons['Eyes'].push(0);
    icons['Eyes'].push(100);

    icons['Factory'] = [];

    icons['Female'] = [];

    icons['Flag'] = [];

    icons['Flame'] = [];

    icons['Flower'] = [];

    icons['Fog'] = [];

    icons['Garage'] = [];
    icons['Garage'].push(0);
    icons['Garage'].push(25);
    icons['Garage'].push(100);

    icons['Gauge'] = [];

    icons['Gear'] = [];

    icons['Graph'] = [];

    icons['GroundFloor'] = [];

    icons['HollowArrowDown'] = [];

    icons['HollowArrowLeft'] = [];

    icons['HollowArrowRight'] = [];

    icons['HollowArrowUp'] = [];

    icons['HollowDoubleArrowDown'] = [];

    icons['HollowDoubleArrowLeft'] = [];

    icons['HollowDoubleArrowRight'] = [];

    icons['HollowDoubleArrowUp'] = [];

    icons['HollowLargeArrowDown'] = [];

    icons['HollowLargeArrowLeft'] = [];

    icons['HollowLargeArrowRight'] = [];

    icons['HollowLargeArrowUp'] = [];

    icons['Hourglass'] = [];
    icons['Hourglass'].push(0);
    icons['Hourglass'].push(30);
    icons['Hourglass'].push(60);
    icons['Hourglass'].push(100);

    icons['HouseRemote'] = [];

    icons['Image'] = [];

    icons['Information'] = [];

    icons['Intensity'] = [];
    icons['Intensity'].push(0);
    icons['Intensity'].push(25);
    icons['Intensity'].push(50);
    icons['Intensity'].push(75);
    icons['Intensity'].push(100);

    icons['Internet'] = [];

    icons['IPS'] = [];

    icons['Jalousie'] = [];
    icons['Jalousie'].push(0);
    icons['Jalousie'].push(50);
    icons['Jalousie'].push(100);

    icons['Key'] = [];

    icons['Keyboard'] = [];

    icons['Kitchen'] = [];

    icons['Leaf'] = [];

    icons['Light'] = [];
    icons['Light'].push(0);
    icons['Light'].push(1);
    icons['Light'].push(25);
    icons['Light'].push(50);
    icons['Light'].push(75);
    icons['Light'].push(100);

    icons['Lightning'] = [];

    icons['Lock'] = [];
    icons['Lock'].push(0);
    icons['Lock'].push(100);

    icons['LockClosed'] = [];

    icons['LockOpen'] = [];

    icons['Macro'] = [];

    icons['Mail'] = [];

    icons['Male'] = [];

    icons['Melody'] = [];

    icons['Minus'] = [];

    icons['Mobile'] = [];

    icons['Moon'] = [];

    icons['Motion'] = [];

    icons['Move'] = [];

    icons['Music'] = [];

    icons['Network'] = [];

    icons['Notebook'] = [];

    icons['Ok'] = [];

    icons['Pacifier'] = [];

    icons['Paintbrush'] = [];

    icons['Plug'] = [];

    icons['Plus'] = [];

    icons['Popcorn'] = [];

    icons['Power'] = [];

    icons['Radiator'] = [];

    icons['Rainfall'] = [];

    icons['Recycling'] = [];

    icons['Repeat'] = [];

    icons['Return'] = [];

    icons['Robot'] = [];

    icons['Rocket'] = [];

    icons['Script'] = [];

    icons['Shift'] = [];

    icons['Shower'] = [];

    icons['Shuffle'] = [];

    icons['Shutter'] = [];

    icons['Sleep'] = [];

    icons['Snow'] = [];

    icons['Snowflake'] = [];

    icons['Sofa'] = [];

    icons['Speaker'] = [];
    icons['Speaker'].push(0);
    icons['Speaker'].push(1);
    icons['Speaker'].push(25);
    icons['Speaker'].push(50);
    icons['Speaker'].push(100);

    icons['Speedo'] = [];
    icons['Speedo'].push(0);
    icons['Speedo'].push(25);
    icons['Speedo'].push(50);
    icons['Speedo'].push(75);
    icons['Speedo'].push(100);

    icons['Stars'] = [];

    icons['Sun'] = [];

    icons['Talk'] = [];

    icons['Tap'] = [];

    icons['Telephone'] = [];

    icons['Temperature'] = [];
    icons['Temperature'].push(0);
    icons['Temperature'].push(25);
    icons['Temperature'].push(50);
    icons['Temperature'].push(75);
    icons['Temperature'].push(100);

    icons['Title'] = [];

    icons['TopFloor'] = [];

    icons['Tree'] = [];

    icons['TurnLeft'] = [];

    icons['TurnRight'] = [];

    icons['TV'] = [];

    icons['Unicorn'] = [];

    icons['Ventilation'] = [];

    icons['Warning'] = [];

    icons['Wave'] = [];

    icons['WC'] = [];

    icons['Wellness'] = [];

    icons['WindDirection'] = [];

    icons['Window'] = [];
    icons['Window'].push(0);
    icons['Window'].push(100);

    icons['WindSpeed'] = [];
    icons['WindSpeed'].push(0);
    icons['WindSpeed'].push(30);
    icons['WindSpeed'].push(60);
    icons['WindSpeed'].push(100);

    icons['XBMC'] = [];

    //special case when no icon should be displayed
    icons['Transparent'] = [];

    return icons;
  }

  static existsAdaptiveIcon(iconName) {
    return (iconName == "Clock") ||
      (IPSIcons.getIconList()[iconName] != null && IPSIcons.getIconList()[iconName].length > 0);
  }

  static getAdaptiveIcon(iconName, percentageValue) {
    let result = "";

    //clock icons will be handled differently:
    if (iconName == "Clock"){
      let minuteRounded = Math.floor(((percentageValue * 14.4) % 60) / 5) * 5;
      let hour = Math.floor((percentageValue * 14.4) / 60);
      let minuteString = String(minuteRounded);
      if (minuteString.length < 2) {
        minuteString = "0" + minuteString;
      }
      return 'Clock-' + String(12 + (hour % 12)) + '-' + minuteString;
    }

    //we try to get the value-adaptive icon
    if (IPSIcons.getIconList()[iconName] != null && IPSIcons.getIconList()[iconName].length > 0){
      let lastValue = 100;
      IPSIcons.getIconList()[iconName].forEach(function (value) {
        if (percentageValue == Number(value)){
          result = iconName + "-" + String(value);
        } else if (percentageValue <  Number(value) && percentageValue > Number(lastValue))
          result = iconName + "-" + String(lastValue);
        lastValue = value;
      });
      if (result != '')
        return result;
    }

    //if there is no valid adaptive icon:
    return iconName;
  }
}
