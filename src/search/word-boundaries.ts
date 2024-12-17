export function containsAtWordBoundary(needle: string, haystack: string): boolean {
  if (haystack.startsWith(needle)) {
    return true
  }

  let startIndex = 0
  while (true) {
    // Termination proof: on each loop iteration, either we exit the loop
    // or we increase startIndex. Eventually, startIndex will be off the end
    // of the haystack string, so foundIndex will be -1 and we'll break out.
    const foundIndex = haystack.indexOf(needle, startIndex)
    if (foundIndex === -1) {
      break;
    }

    if (isWordBreakingChar(haystack[foundIndex - 1])) {
      return true
    } else {
      assert(foundIndex >= startIndex, "foundIndex is less than startIndex; loop will not terminate!")
      startIndex = foundIndex + 1
    }
  }

  return false
}

function isWordBreakingChar(c: string): boolean {
  return " \n\r\t`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?".includes(c)
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}
