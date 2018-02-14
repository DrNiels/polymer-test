export default class DateUtils {
  /**
   * Formats the UTC date with "ddMMyyyy".
   * @param d Date object to format.
   * @return {string} Formatted date.
   */
  static formatDateUTC(d) {
    return ("0" + d.getUTCDate()).slice(-2) + "-" + ("0"+(d.getUTCMonth()+1)).slice(-2) + "-" +
      d.getUTCFullYear();
  }

  /**
   * Formats the UTC date with "hh:mm".
   * @param d Date object to format.
   * @return {string} Formatted time.
   */
  static formatTimeUTC(d) {
    return ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2);
  }

  /**
   * Formats the UTC date with "hh:mm:ss".
   * @param d Date object to format.
   * @return {string} Formatted time.
   */
  static formatTimeWithSecondsUTC(d) {
    return ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2) + ":" +
      ("0" + d.getUTCSeconds()).slice(-2);
  }

  /**
   * Checks if two dates are on the same day.
   * @param d1 First Date object to compare.
   * @param d2 Second Date object to compare.
   * @return {boolean} True if both dates are on the same day, false else.
   */
  static isSameDay(d1, d2) {
    return d1.getUTCFullYear() == d2.getUTCFullYear() &&
        d1.getUTCMonth() == d2.getUTCMonth() &&
        d1.getUTCDate() == d2.getUTCDate();
  }
}