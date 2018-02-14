export default class Comparators {
  /**
   * Compares two numbers.
   * @param a First number to compare.
   * @param b Second number to compare.
   * @return {number} -1 if a < b, 1 if a > b, 0 if a = b.
   */
  static compareNumber(a, b) {
    if (a < b)
      return -1;

    if (a > b)
      return 1;

    return 0;
  }

  /**
   * Compares two strings lexicographically.
   * @param a First string to compare.
   * @param b Second string to compare.
   * @return {number} -1 if a is lexicographically smaller than b, 1 if a is larger
   * than b, 0 if they are equal.
   */
  static compareStringLex(a, b) {
    if (a < b)
      return -1;

    if (a > b)
      return 1;

    return 0;
  }
}
