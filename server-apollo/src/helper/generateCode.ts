/**
 * It generates a random number between the given min and max values.
 * @param [min=0] - The minimum value of the range.
 * @param [max=100] - The maximum number that can be generated.
 * @returns A random number between 0 and 100.
 */
function generateCode(min = 0, max = 100): number {
  // find diff
  const difference = max - min;

  // generate random number
  let rand = Math.random();

  // multiply with difference
  rand = Math.floor(rand * difference);

  // add with min value
  rand = rand + min;

  return rand;
}

export default generateCode;
