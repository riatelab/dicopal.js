import {
  getAsymmetricDivergingColors,
  getPalette,
  getPalettes,
  getSequentialColors,
} from '../src';

describe('getPalette', () => {
  it('should return a palette when the name exists', () => {
    const palette = getPalette('Vivid', 7);
    expect(palette).toBeDefined();
    expect(palette!.colors.length).toBe(7);
  });

  it('should return undefined when the name does not exist', () => {
    const palette = getPalette('NonExistent', 7);
    expect(palette).toBeUndefined();
  });

  it('should return undefined when the number doesn\'t exist', () => {
    const palette1 = getPalette('Vivid', 1);
    expect(palette1).toBeUndefined();

    const palette2 = getPalette('Vivid', 12000);
    expect(palette2).toBeUndefined();
  });
});

describe('getSequentialColors', () => {
  it('should return a palette when the name exists, without interpolation if not needed', () => {
    const colors = getSequentialColors('Blues', 4);
    expect(colors).toBeDefined();
    expect(colors.length).toBe(4);
  });

  it('should return a palette when the name exists, with interpolation if needed', () => {
    const colors = getSequentialColors('Blues', 20);
    expect(colors).toBeDefined();
    expect(colors.length).toBe(20);
  });

  it('should throw Error when the name does not exist', () => {
    expect(() => getSequentialColors('NonExistent', 7))
      .toThrow(Error);
  });

  it('should return a reversed palette when "reverse" parameter is used', () => {
    const colors = getSequentialColors('Blues', 20);
    const colorsRev = getSequentialColors('Blues', 20, true);
    expect(colorsRev).toBeDefined();
    expect(colorsRev.length).toBe(20);
    expect(colorsRev).toEqual(colors.slice().reverse());
  });
});

const allDivergingNames = new Set(getPalettes({ type: "diverging" }).map((p) => p.name));

describe('getAsymmetricDivergingColors', () => {
  it('should throw Error when the name does not exist', () => {
    expect(() => getAsymmetricDivergingColors('NonExistent', 7, 7, true, true))
      .toThrow(Error);
  });

  it('should return the correct number of colors for balanced palettes with central class', () => {
    for (let nRight = 1; nRight <= 15; nRight++) {
      for (let nLeft = 1; nLeft <= 15; nLeft++) {
        for (const name of allDivergingNames) {
          const colors = getAsymmetricDivergingColors(name, nLeft, nRight, true, true);
          expect(colors).toBeDefined();
          expect(colors.length).toBe(nLeft + nRight + 1);
        }
      }
    }
  });

  it('should return the correct number of colors for balanced palettes without central class', () => {
    for (let nRight = 1; nRight <= 15; nRight++) {
      for (let nLeft = 1; nLeft <= 15; nLeft++) {
        for (const name of allDivergingNames) {
          const colors = getAsymmetricDivergingColors(name, nLeft, nRight, false, true);
          expect(colors).toBeDefined();
          expect(colors.length).toBe(nLeft + nRight);
        }
      }
    }
  });

  it('should return the correct number of colors for unbalanced palettes with central class', () => {
    for (let nRight = 1; nRight <= 15; nRight++) {
      for (let nLeft = 1; nLeft <= 15; nLeft++) {
        for (const name of allDivergingNames) {
          const colors = getAsymmetricDivergingColors(name, nLeft, nRight, true, false);
          expect(colors).toBeDefined();
          expect(colors.length).toBe(nLeft + nRight + 1);
        }
      }
    }
  });

  it('should return the correct number of colors for unbalanced palettes without central class', () => {
    for (let nRight = 1; nRight <= 15; nRight++) {
      for (let nLeft = 1; nLeft <= 15; nLeft++) {
        for (const name of allDivergingNames) {
          const colors = getAsymmetricDivergingColors(name, nLeft, nRight, false, false);
          expect(colors).toBeDefined();
          expect(colors.length).toBe(nLeft + nRight);
        }
      }
    }
  });
});
