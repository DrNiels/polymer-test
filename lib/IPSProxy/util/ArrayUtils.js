export default class ArrayUtils {
  /**
   * Removes an object from an array without modifying the source array.
   * @param inputArray Source array.
   * @param object Object to remove.
   * @return {*} Copy of the source array without the removed object, if
   * any object has been removed. If none was removed, this function returns the
   * source array.
   */
  static removeFromArray(inputArray, object) {
    // Find the object
    let index = inputArray.findIndex(function(element) {
      return element == object;
    });

    if (index != -1) {
      // Remove the object if present
      return inputArray.splice(index);
    }

    // Return input array if the element has not been removed
    return inputArray;
  }

  /**
   * Find an object in an array using the supplied comparator function and removes
   * the first object meeting the criteria without modifying the source array.
   * @param inputArray Source array.
   * @param comparator Comparator function to use for finding the object to delete.
   * @return {*} Copy of the source array without the removed object, if any object
   * has been removed. If none was removed, this function returns the source array.
   */
  static findAndRemoveFromArray(inputArray, comparator) {
    // Find the object
    let index = inputArray.findIndex(comparator);

    if (index != -1) {
      // Remove the object if present
      return inputArray.splice(index);
    }

    // Return input array if the element has not been removed
    return inputArray;
  }

  /**
   * Finds the first object from an array meeting some criteria as defined by the
   * supplied comparator function.
   * @param array Array to search in.
   * @param comparator Comparator function to use for finding the object.
   * @param defaultValue Return value for this function in case no object could be
   * found.
   * @return {*} If an object was found, it is returned. If no object could be found,
   * the supplied default value is returned, or null else.
   */
  static findFirst(array, comparator, defaultValue) {
    // Find the object
    let index = array.findIndex(comparator);

    if (index != -1) {
      // Return the object we found
      return array[index];
    }

    // Could not find the object. Return a default value
    if (typeof defaultValue !== "undefined") {
      return defaultValue;
    }

    return null;
  }
}