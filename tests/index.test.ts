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

  it('should throw Error when the number of colors is less than 1 on any side', () => {
    expect(() => getAsymmetricDivergingColors('Balance', 0, 7, true, true))
      .toThrow(Error);
    expect(() => getAsymmetricDivergingColors('Balance', 7, 0, true, true))
      .toThrow(Error);
    expect(() => getAsymmetricDivergingColors('Balance', 0, 0, true, true))
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

  it('should return the same colors for balanced and unbalanced palettes when classRight==classLeft and centralClass==true', () => {
    for (let n = 1; n <= 15; n++) {
      for (const name of allDivergingNames) {
        const colorsBalanced = getAsymmetricDivergingColors(name, n, n, true, true);
        const colorsUnbalanced = getAsymmetricDivergingColors(name, n, n, true, false);
        expect(colorsBalanced).toBeDefined();
        expect(colorsUnbalanced).toBeDefined();
        expect(colorsBalanced).toEqual(colorsUnbalanced);
      }
    }
  });

  it('should return the same colors for balanced and unbalanced palettes when classRight==classLeft and centralClass==false', () => {
    for (let n = 1; n <= 15; n++) {
      for (const name of allDivergingNames) {
        const colorsBalanced = getAsymmetricDivergingColors(name, n, n, false, true);
        const colorsUnbalanced = getAsymmetricDivergingColors(name, n, n, false, false);
        expect(colorsBalanced).toBeDefined();
        expect(colorsUnbalanced).toBeDefined();
        expect(colorsBalanced).toEqual(colorsUnbalanced);
      }
    }
  });

  it('should return a reversed palette when "reverse" parameter is used', () => {
    const params: [string, number, number, boolean, boolean][] = [
      // Without interpolation
      ['Balance', 2, 3, true, true], // Central class is true / balanced is true
      ['Balance', 2, 3, true, false], // Central class is true / balanced is false
      ['Balance', 2, 3, false, true], // Etc.
      ['Balance', 2, 3, false, false],
      // With interpolation
      ['Balance', 7, 8, true, true],
      ['Balance', 7, 8, true, false],
      ['Balance', 7, 8, false, true],
      ['Balance', 7, 8, false, false],
    ];
    for (const [name, nLeft, nRight, centralClass, balanced] of params) {
      const colors = getAsymmetricDivergingColors(name, nLeft, nRight, centralClass, balanced);
      const colorsRev = getAsymmetricDivergingColors(name, nLeft, nRight, centralClass, balanced, true);
      expect(colorsRev).toBeDefined();
      expect(colorsRev.length).toBe(colors.length);
      expect(colorsRev).toEqual(colors.slice().reverse());
    }
  });

  it('should always return all colors as hex strings', () => {
    const params: [string, number, number, boolean, boolean][] = [
      // All cases (central class / balanced) without needing interpolation
      ['Balance', 3, 2, true, true],
      ['Balance', 3, 2, true, false],
      ['Balance', 3, 2, false, true],
      ['Balance', 3, 2, false, false],
      // All cases (central class / balanced) needing interpolation
      ['Balance', 13, 12, true, true],
      ['Balance', 13, 12, true, false],
      ['Balance', 13, 12, false, true],
      ['Balance', 13, 12, false, false],
    ];
    for (const [name, nLeft, nRight, centralClass, balanced] of params) {
      const colors = getAsymmetricDivergingColors(name, nLeft, nRight, centralClass, balanced);
      for (const color of colors) {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });
});
