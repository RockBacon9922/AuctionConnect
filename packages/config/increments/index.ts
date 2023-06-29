const incrementPairs = {
  0: 5,
  50: 10,
  100: 20,
  200: 50,
  500: 100,
  1000: 200,
  2000: 500,
  5000: 1000,
  10000: 2000,
  20000: 5000,
  50000: 10000,
  100000: 20000,
  200000: 50000,
  500000: 100000,
  1000000: 200000,
  2000000: 500000,
  5000000: 1000000,
  10000000: 2000000,
  20000000: 5000000,
  50000000: 10000000,
  100000000: 20000000,
};

const increments = [
  1, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000,
  100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000,
  50000000, 100000000,
];

const getIncrementForPrice = (price: number) => {
  const increment = increments.find((increment) => increment > price);
  return increment;
};

export default getIncrementForPrice;

export { getIncrementForPrice, incrementPairs, increments };
