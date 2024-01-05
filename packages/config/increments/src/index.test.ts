import getAskFromPrice, { getIncrementFromPrice } from "./index";

describe("Checking the function getAskFromPrice", () => {
  it("should return 2 for 1", () => {
    expect(getAskFromPrice(1)).toBe(2);
  });
  it("should return 5 for 4 ", () => {
    expect(getAskFromPrice(4)).toBe(5);
  });
  it("should return 10 for 5", () => {
    expect(getAskFromPrice(5)).toBe(10);
  });
  it("should return 10 for 9", () => {
    expect(getAskFromPrice(9)).toBe(10);
  });
});

describe("Checking the function getIncrementFromPrice", () => {
  it("should return 5 for 1", () => {
    expect(getIncrementFromPrice(1)).toBe(5);
  });
  it("should return 5 for 5", () => {
    expect(getIncrementFromPrice(5)).toBe(5);
  });
  it("should return 10 for 50", () => {
    expect(getIncrementFromPrice(50)).toBe(10);
  });
  it("should return 20 for 100", () => {
    expect(getIncrementFromPrice(100)).toBe(20);
  });
});
