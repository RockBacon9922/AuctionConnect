/**
 * This list is used to determine the increment for a given price
 * @param {number} 1 is the price
 * @param {number} 2 is the increment
 */
const increments = [
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
  [50, 10],
  [100, 20],
  [200, 50],
  [500, 10],
  [1000, 200],
  [2000, 500],
  [5000, 1000],
  [10000, 2000],
  [20000, 5000],
  [50000, 10000],
  [100000, 20000],
  [200000, 50000],
  [500000, 100000],
  [1000000, 200000],
  [2000000, 500000],
  [5000000, 1000000],
  [10000000, 2000000],
  [20000000, 5000000],
  [50000000, 10000000],
  [100000000, 20000000],
];

/**
 * @description This function returns the ask price from a given bid price
 * for example if the current bid was 45 and the increment was 10 then the ask price would be 50
 * @param price
 */
const getAskFromPrice = (price: number): number => {
  // find the closest increment
  const increment = increments.find(
    (increment) => (increment[0] as number) > price,
  );
  // check if the increment exists
  if (increment) {
    // find the closest number which is divisible by the increment but is greater than the price
    return (
      Math.ceil(price / (increment[1] as number)) * (increment[1] as number)
    );
  }
  throw new Error(`No increment found for price ${price}`);
};

export default getAskFromPrice;

export { getAskFromPrice };
